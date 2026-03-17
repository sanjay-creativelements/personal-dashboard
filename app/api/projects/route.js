import { unstable_cache } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const GITHUB_USER = "sanjay-creativelements";

const GITHUB_HEADERS = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": `${GITHUB_USER}-dashboard`,
};

// ── GitHub helpers ────────────────────────────────────────────────────────────

async function ghFetch(url, revalidate = 3600) {
  const res = await fetch(url, {
    headers: GITHUB_HEADERS,
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  return res.json();
}

// Detect the default branch and return root-level subfolders.
// Uses a shallow (non-recursive) tree so it only sees top-level entries.
// Returns [{ name, branch }] or [] if no valid branch / no folders.
async function getRepoSubfolders(repoName) {
  for (const branch of ["main", "master"]) {
    try {
      // Omitting ?recursive returns only root-level entries.
      // Filter out any path containing "/" as a safety net against API changes.
      const tree = await ghFetch(
        `https://api.github.com/repos/${GITHUB_USER}/${repoName}/git/trees/${branch}`,
        3600,
      );
      const folders = (tree.tree ?? [])
        .filter((item) => item.type === "tree" && !item.path.includes("/"))
        .map((item) => ({ name: item.path, branch }));
      console.log(
        `[projects:folders] ${repoName} — ${folders.length} folder(s) on "${branch}":`,
        folders.map((f) => f.name).join(", ") || "(none)",
      );
      return folders;
    } catch (err) {
      console.log(
        `[projects:folders] ${repoName} — branch "${branch}" failed: ${err.message}`,
      );
    }
  }
  console.log(`[projects:folders] ${repoName} — no branch found, assuming no folders`);
  return [];
}

// Fetch README + up to 2 code files from the whole repo (recursive tree).
// Used for repo-level AI descriptions.
async function getRepoContent(repoName) {
  let tree = null;
  for (const branch of ["main", "master"]) {
    try {
      tree = await ghFetch(
        `https://api.github.com/repos/${GITHUB_USER}/${repoName}/git/trees/${branch}?recursive=1`,
        86400,
      );
      console.log(`[projects:content] ${repoName} — using branch "${branch}"`);
      break;
    } catch (err) {
      console.log(
        `[projects:content] ${repoName} — branch "${branch}" not found (${err.message})`,
      );
    }
  }

  if (!tree) {
    console.error(`[projects:content] ${repoName} — no valid branch found`);
    return null;
  }

  const blobs = (tree.tree ?? []).filter((f) => f.type === "blob");
  const readme = blobs.find((f) => f.path.toLowerCase() === "readme.md");
  const codeFiles = blobs
    .filter(
      (f) =>
        /\.(js|ts|jsx|tsx|py|go|rb|java|cs|php|rs)$/.test(f.path) &&
        !f.path.includes("node_modules") &&
        !f.path.includes(".min."),
    )
    .slice(0, 3);

  const targets = readme ? [readme, ...codeFiles.slice(0, 2)] : codeFiles.slice(0, 3);
  if (targets.length === 0) {
    console.log(`[projects:content] ${repoName} — no README or code files found`);
    return null;
  }

  console.log(
    `[projects:content] ${repoName} — fetching ${targets.length} file(s): ` +
      targets.map((f) => f.path).join(", "),
  );

  const parts = await Promise.all(
    targets.map(async (f) => {
      try {
        const data = await ghFetch(
          `https://api.github.com/repos/${GITHUB_USER}/${repoName}/contents/${f.path}`,
          86400,
        );
        if (!data.content) return null;
        const text = Buffer.from(data.content, "base64").toString("utf-8").slice(0, 1500);
        return `=== ${f.path} ===\n${text}`;
      } catch (err) {
        console.error(`[projects:content] ${repoName}/${f.path} — fetch error: ${err.message}`);
        return null;
      }
    }),
  );

  const combined = parts.filter(Boolean).join("\n\n").slice(0, 4000);
  console.log(`[projects:content] ${repoName} — ${combined.length} chars`);
  return combined || null;
}

// Fetch code files inside a specific subfolder (filtered from the recursive tree).
// The recursive tree fetch URL is identical to what getRepoContent uses, so
// Next.js's fetch cache deduplicates the HTTP request within the same handler run.
async function getFolderContent(repoName, folderName, branch) {
  let tree;
  try {
    tree = await ghFetch(
      `https://api.github.com/repos/${GITHUB_USER}/${repoName}/git/trees/${branch}?recursive=1`,
      86400,
    );
  } catch (err) {
    console.error(
      `[projects:folder-content] ${repoName}/${folderName} — tree fetch failed: ${err.message}`,
    );
    return null;
  }

  const prefix = `${folderName}/`;
  const blobs = (tree.tree ?? []).filter(
    (f) => f.type === "blob" && f.path.startsWith(prefix),
  );

  const readme = blobs.find(
    (f) => f.path.toLowerCase() === `${folderName}/readme.md`,
  );
  const codeFiles = blobs
    .filter(
      (f) =>
        /\.(js|ts|jsx|tsx|py|go|rb|java|cs|php|rs)$/.test(f.path) &&
        !f.path.includes("node_modules") &&
        !f.path.includes(".min."),
    )
    .slice(0, 3);

  const targets = readme ? [readme, ...codeFiles.slice(0, 2)] : codeFiles.slice(0, 3);
  if (targets.length === 0) {
    console.log(`[projects:folder-content] ${repoName}/${folderName} — no files found`);
    return null;
  }

  console.log(
    `[projects:folder-content] ${repoName}/${folderName} — fetching ${targets.length} file(s): ` +
      targets.map((f) => f.path).join(", "),
  );

  const parts = await Promise.all(
    targets.map(async (f) => {
      try {
        const data = await ghFetch(
          `https://api.github.com/repos/${GITHUB_USER}/${repoName}/contents/${f.path}`,
          86400,
        );
        if (!data.content) return null;
        const text = Buffer.from(data.content, "base64").toString("utf-8").slice(0, 1500);
        return `=== ${f.path} ===\n${text}`;
      } catch (err) {
        console.error(
          `[projects:folder-content] ${repoName}/${f.path} — fetch error: ${err.message}`,
        );
        return null;
      }
    }),
  );

  const combined = parts.filter(Boolean).join("\n\n").slice(0, 4000);
  console.log(`[projects:folder-content] ${repoName}/${folderName} — ${combined.length} chars`);
  return combined || null;
}

// ── AI descriptions — repo level ───────────────────────────────────────────────
//
// API key check is OUTSIDE unstable_cache so a missing-key fallback is never
// cached and blocks real AI calls after the key is added.
// Cache key bumped to v7 (v6 was the previous shape).

const getCachedRepoAIDescriptions = unstable_cache(
  async (repoName, githubDescription) => {
    const fallback = {
      shortDesc: githubDescription
        ? githubDescription.slice(0, 97) + (githubDescription.length > 97 ? "..." : "")
        : "No description available.",
      longDesc: githubDescription || "No description available.",
    };

    console.log(`[projects:ai] Calling Anthropic for repo: ${repoName}`);
    const content = await getRepoContent(repoName);
    if (!content) {
      console.log(`[projects:ai] ${repoName} — no content, using fallback`);
      return fallback;
    }

    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const message = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content:
              `You are analyzing a GitHub repository called ${repoName}. ` +
              `Based on the following code and files, write a clean 50-80 word description of what this project does. ` +
              `Do not use markdown formatting. Do not ask for more information. ` +
              `Write in first person as the developer. ` +
              `If the code is minimal, describe what you can see.\n\n` +
              `Also write a short 1-sentence version under 100 characters for card previews.\n\n` +
              `Respond with ONLY a raw JSON object — no markdown, no code fences:\n` +
              `{"short":"one sentence under 100 chars","long":"50-80 word description"}\n\n` +
              content,
          },
        ],
      });

      const block = message.content[0];
      if (block.type !== "text") {
        console.error(`[projects:ai] ${repoName} — unexpected block type: ${block.type}`);
        return fallback;
      }

      console.log(`[projects:ai] ${repoName} — raw response: ${block.text.slice(0, 120)}`);

      const match = block.text.trim().match(/\{[\s\S]*\}/);
      if (!match) {
        console.error(`[projects:ai] ${repoName} — could not extract JSON`);
        return fallback;
      }

      const parsed = JSON.parse(match[0]);
      const shortDesc =
        typeof parsed.short === "string" && parsed.short.length > 0
          ? parsed.short.slice(0, 100)
          : fallback.shortDesc;
      const longDesc =
        typeof parsed.long === "string" && parsed.long.length > 0
          ? parsed.long
          : fallback.longDesc;

      console.log(`[projects:ai] ${repoName} — short: "${shortDesc}"`);
      return { shortDesc, longDesc };
    } catch (err) {
      console.error(`[projects:ai] Anthropic API error for ${repoName}:`, err.message);
      return fallback;
    }
  },
  ["project-ai-descriptions-v7"],
  { revalidate: 86400 },
);

async function getRepoAIDescriptions(repoName, githubDescription) {
  const fallback = {
    shortDesc: githubDescription
      ? githubDescription.slice(0, 97) + (githubDescription.length > 97 ? "..." : "")
      : "No description available.",
    longDesc: githubDescription || "No description available.",
  };
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log(`[projects:ai] No API key — skipping Anthropic for repo ${repoName}`);
    return fallback;
  }
  return getCachedRepoAIDescriptions(repoName, githubDescription);
}

// ── AI descriptions — folder level ─────────────────────────────────────────────
//
// Same pattern: API key check outside cache, args (repoName, folderName, branch)
// are used by unstable_cache as part of the full cache key automatically.

const getCachedFolderAIDescriptions = unstable_cache(
  async (repoName, folderName, branch) => {
    const fallback = {
      shortDesc: `Code inside the ${folderName} folder.`,
      longDesc: `This is the ${folderName} directory inside the ${repoName} repository.`,
    };

    console.log(`[projects:ai] Calling Anthropic for folder: ${repoName}/${folderName}`);
    const content = await getFolderContent(repoName, folderName, branch);
    if (!content) {
      console.log(`[projects:ai] ${repoName}/${folderName} — no content, using fallback`);
      return fallback;
    }

    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const message = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content:
              `You are analyzing a folder called "${folderName}" inside the GitHub repository "${repoName}". ` +
              `Based on the following code and files, write a clean 50-80 word description of what this folder contains and does. ` +
              `Do not use markdown formatting. Do not ask for more information. ` +
              `Write in first person as the developer. ` +
              `If the code is minimal, describe what you can see.\n\n` +
              `Also write a short 1-sentence version under 100 characters for card previews.\n\n` +
              `Respond with ONLY a raw JSON object — no markdown, no code fences:\n` +
              `{"short":"one sentence under 100 chars","long":"50-80 word description"}\n\n` +
              content,
          },
        ],
      });

      const block = message.content[0];
      if (block.type !== "text") {
        console.error(
          `[projects:ai] ${repoName}/${folderName} — unexpected block type: ${block.type}`,
        );
        return fallback;
      }

      console.log(
        `[projects:ai] ${repoName}/${folderName} — raw response: ${block.text.slice(0, 120)}`,
      );

      const match = block.text.trim().match(/\{[\s\S]*\}/);
      if (!match) {
        console.error(`[projects:ai] ${repoName}/${folderName} — could not extract JSON`);
        return fallback;
      }

      const parsed = JSON.parse(match[0]);
      const shortDesc =
        typeof parsed.short === "string" && parsed.short.length > 0
          ? parsed.short.slice(0, 100)
          : fallback.shortDesc;
      const longDesc =
        typeof parsed.long === "string" && parsed.long.length > 0
          ? parsed.long
          : fallback.longDesc;

      console.log(`[projects:ai] ${repoName}/${folderName} — short: "${shortDesc}"`);
      return { shortDesc, longDesc };
    } catch (err) {
      console.error(
        `[projects:ai] Anthropic API error for ${repoName}/${folderName}:`,
        err.message,
      );
      return fallback;
    }
  },
  ["project-folder-ai-descriptions-v1"],
  { revalidate: 86400 },
);

async function getFolderAIDescriptions(repoName, folderName, branch) {
  const fallback = {
    shortDesc: `Code inside the ${folderName} folder.`,
    longDesc: `This is the ${folderName} directory inside the ${repoName} repository.`,
  };
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log(
      `[projects:ai] No API key — skipping Anthropic for folder ${repoName}/${folderName}`,
    );
    return fallback;
  }
  return getCachedFolderAIDescriptions(repoName, folderName, branch);
}

// ── Time grouping ─────────────────────────────────────────────────────────────
//
// Groups by created_at. All arithmetic in UTC to avoid timezone drift.

function getTimeGroup(createdAt) {
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const c = new Date(createdAt);
  const createdUTC = Date.UTC(c.getUTCFullYear(), c.getUTCMonth(), c.getUTCDate());
  const diffDays = Math.round((todayUTC - createdUTC) / 86_400_000);

  if (diffDays < 7) return "This Week";   // 0-6 days
  if (diffDays < 14) return "Last Week";  // 7-13 days
  if (diffDays < 30) return "Last Month"; // 14-29 days
  return "Older";
}

const GROUP_ORDER = ["This Week", "Last Week", "Last Month", "Older"];

function toTitle(name) {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Process repos ──────────────────────────────────────────────────────────────
//
// For each repo:
//   - Check root-level subfolders (shallow tree).
//   - Subfolders exist → emit 1 repo summary card + 1 folder card per subfolder.
//   - No subfolders      → emit 1 standalone repo card (current behaviour).
// All cards from the same repo share the same timeGroup (repo created_at).
// Slug format: repo cards use `repoName`; folder cards use `repoName--folderName`.

async function processRepos(repos) {
  const BATCH_SIZE = 5;
  const allCards = [];

  for (let i = 0; i < repos.length; i += BATCH_SIZE) {
    const batch = repos.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (repo) => {
        const repoCards = [];
        const timeGroup = getTimeGroup(repo.created_at);
        const tags = [repo.language].filter(Boolean);

        // 1. Detect subfolders
        const subfolders = await getRepoSubfolders(repo.name);

        // 2. Repo-level AI (used for both standalone and summary cards)
        const { shortDesc: repoShortDesc, longDesc: repoLongDesc } =
          await getRepoAIDescriptions(repo.name, repo.description ?? "");

        // 3. Repo card
        repoCards.push({
          slug: repo.name,
          title: toTitle(repo.name),
          description: repoShortDesc,
          longDescription: repoLongDesc,
          tags,
          githubUrl: repo.html_url,
          updatedAt: repo.updated_at,
          timeGroup,
          type: "repo",
          // isRepoSummary signals to the card UI to show a subtle "repo" badge
          isRepoSummary: subfolders.length > 0,
          repoName: repo.name,
        });

        // 4. Folder cards (only when subfolders exist)
        if (subfolders.length > 0) {
          const folderCards = await Promise.all(
            subfolders.map(async ({ name: folderName, branch }) => {
              const { shortDesc, longDesc } = await getFolderAIDescriptions(
                repo.name,
                folderName,
                branch,
              );
              return {
                slug: `${repo.name}--${folderName}`,
                title: toTitle(folderName),
                description: shortDesc,
                longDescription: longDesc,
                tags,
                githubUrl: `https://github.com/${GITHUB_USER}/${repo.name}/tree/${branch}/${folderName}`,
                updatedAt: repo.updated_at,
                timeGroup,
                type: "folder",
                isRepoSummary: false,
                repoName: repo.name,
                folderName,
              };
            }),
          );
          repoCards.push(...folderCards);
        }

        return repoCards;
      }),
    );
    allCards.push(...batchResults.flat());
  }

  return allCards;
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function GET() {
  try {
    console.log("API route called");
    console.log("TODAY:", new Date().toISOString());
    console.log("API KEY EXISTS:", !!process.env.ANTHROPIC_API_KEY);

    console.log("Fetching repos...");
    const repos = await ghFetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
    );

    const EXCLUDED = new Set(["my-nextjs-app", "personal-dashboard"]);
    const ownRepos = repos.filter((r) => !r.fork && !EXCLUDED.has(r.name));
    console.log(`[projects] ${ownRepos.length} repos after filtering`);

    const projects = await processRepos(ownRepos);

    const grouped = Object.fromEntries(GROUP_ORDER.map((g) => [g, []]));
    for (const p of projects) {
      if (grouped[p.timeGroup]) grouped[p.timeGroup].push(p);
    }

    const groups = GROUP_ORDER.filter((g) => grouped[g].length > 0).map(
      (g) => ({ group: g, projects: grouped[g] }),
    );

    console.log(
      `[projects] Returning ${groups.length} group(s):`,
      groups.map((g) => `${g.group}(${g.projects.length})`).join(", "),
    );
    return NextResponse.json({ groups });
  } catch (error) {
    console.error("[projects] Route handler error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
