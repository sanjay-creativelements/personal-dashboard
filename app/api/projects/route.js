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

// Fetch README + up to 2 code files from the repo's default branch.
// Tries "main" first, falls back to "master" if main doesn't exist.
// Returns a labelled string (≤4000 chars), or null on any failure.
async function getRepoContent(repoName) {
  // Try main branch first, then master.
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
      console.log(`[projects:content] ${repoName} — branch "${branch}" not found (${err.message})`);
    }
  }

  if (!tree) {
    console.error(`[projects:content] ${repoName} — no valid branch found, returning null`);
    return null;
  }

  const blobs = (tree.tree ?? []).filter((f) => f.type === "blob");
  console.log(`[projects:content] ${repoName} — ${blobs.length} blobs in tree`);

  const readme = blobs.find((f) => f.path.toLowerCase() === "readme.md");
  const codeFiles = blobs
    .filter(
      (f) =>
        /\.(js|ts|jsx|tsx|py|go|rb|java|cs|php|rs)$/.test(f.path) &&
        !f.path.includes("node_modules") &&
        !f.path.includes(".min."),
    )
    .slice(0, 3);

  const targets = readme
    ? [readme, ...codeFiles.slice(0, 2)]
    : codeFiles.slice(0, 3);

  if (targets.length === 0) {
    console.log(`[projects:content] ${repoName} — no README or code files found`);
    return null;
  }

  console.log(`[projects:content] ${repoName} — fetching ${targets.length} file(s): ${targets.map((f) => f.path).join(", ")}`);

  const parts = await Promise.all(
    targets.map(async (f) => {
      try {
        const data = await ghFetch(
          `https://api.github.com/repos/${GITHUB_USER}/${repoName}/contents/${f.path}`,
          86400,
        );
        if (!data.content) {
          console.log(`[projects:content] ${repoName}/${f.path} — no content field`);
          return null;
        }
        const text = Buffer.from(data.content, "base64")
          .toString("utf-8")
          .slice(0, 1500);
        console.log(`[projects:content] ${repoName}/${f.path} — fetched ${text.length} chars`);
        return `=== ${f.path} ===\n${text}`;
      } catch (err) {
        console.error(`[projects:content] ${repoName}/${f.path} — fetch error: ${err.message}`);
        return null;
      }
    }),
  );

  const combined = parts.filter(Boolean).join("\n\n").slice(0, 4000);
  console.log(`[projects:content] ${repoName} — combined content length: ${combined.length} chars`);
  return combined || null;
}

// ── AI descriptions ────────────────────────────────────────────────────────────
//
// API key check is OUTSIDE unstable_cache so a missing-key fallback is never
// cached and blocks real AI calls later.
// Cache key "v6" busts all previous entries (including any stale fallbacks).

const getCachedAIDescriptions = unstable_cache(
  async (repoName, githubDescription) => {
    const fallback = {
      shortDesc: githubDescription
        ? githubDescription.slice(0, 97) +
          (githubDescription.length > 97 ? "..." : "")
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
        console.error(`[projects:ai] ${repoName} — unexpected response block type: ${block.type}`);
        return fallback;
      }

      console.log(`[projects:ai] ${repoName} — raw response: ${block.text.slice(0, 120)}`);

      // Extract the first {...} block in case the model adds surrounding text.
      const match = block.text.trim().match(/\{[\s\S]*\}/);
      if (!match) {
        console.error(`[projects:ai] ${repoName} — could not extract JSON from response`);
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
  ["project-ai-descriptions-v6"],
  { revalidate: 86400 },
);

async function getAIDescriptions(repoName, githubDescription) {
  const fallback = {
    shortDesc: githubDescription
      ? githubDescription.slice(0, 97) +
        (githubDescription.length > 97 ? "..." : "")
      : "No description available.",
    longDesc: githubDescription || "No description available.",
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log(`[projects:ai] No API key — skipping Anthropic for ${repoName}`);
    return fallback;
  }

  return getCachedAIDescriptions(repoName, githubDescription);
}

// ── Time grouping ─────────────────────────────────────────────────────────────
//
// Groups by created_at. All arithmetic in UTC.

function getTimeGroup(createdAt) {
  const now = new Date();

  const todayUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const c = new Date(createdAt);
  const createdUTC = Date.UTC(
    c.getUTCFullYear(),
    c.getUTCMonth(),
    c.getUTCDate(),
  );

  const diffDays = Math.round((todayUTC - createdUTC) / 86_400_000);

  if (diffDays < 7) return "This Week";   // 0-6 days
  if (diffDays < 14) return "Last Week";  // 7-13 days
  if (diffDays < 30) return "Last Month"; // 14-29 days
  return "Older";
}

const GROUP_ORDER = ["This Week", "Last Week", "Last Month", "Older"];

// ── Process repos ──────────────────────────────────────────────────────────────

async function processRepos(repos) {
  const BATCH_SIZE = 5;
  const results = [];

  for (let i = 0; i < repos.length; i += BATCH_SIZE) {
    const batch = repos.slice(i, i + BATCH_SIZE);
    const resolved = await Promise.all(
      batch.map(async (repo) => {
        const { shortDesc, longDesc } = await getAIDescriptions(
          repo.name,
          repo.description ?? "",
        );
        return {
          slug: repo.name,
          title: repo.name
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          description: shortDesc,     // ≤100 chars — shown on cards
          longDescription: longDesc,  // 50-80 words — shown in detail panel
          tags: [repo.language].filter(Boolean),
          githubUrl: repo.html_url,
          updatedAt: repo.updated_at,
          timeGroup: getTimeGroup(repo.created_at),
        };
      }),
    );
    results.push(...resolved);
  }

  return results;
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

    for (const repo of ownRepos) {
      const daysAgo = Math.floor(
        (new Date() - new Date(repo.created_at)) / (1000 * 60 * 60 * 24),
      );
      console.log(repo.name, "created_at:", repo.created_at, "days ago:", daysAgo);
    }

    const projects = await processRepos(ownRepos);

    const grouped = Object.fromEntries(GROUP_ORDER.map((g) => [g, []]));
    for (const p of projects) {
      if (grouped[p.timeGroup]) grouped[p.timeGroup].push(p);
    }

    const groups = GROUP_ORDER.filter((g) => grouped[g].length > 0).map(
      (g) => ({ group: g, projects: grouped[g] }),
    );

    console.log(`[projects] Returning ${groups.length} group(s):`, groups.map((g) => `${g.group}(${g.projects.length})`).join(", "));
    return NextResponse.json({ groups });
  } catch (error) {
    console.error("[projects] Route handler error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
