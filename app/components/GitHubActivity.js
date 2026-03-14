"use client";

import { useState, useEffect } from "react";

const LANGUAGE_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python:     "#3572a5",
  Go:         "#00add8",
  Rust:       "#dea584",
  CSS:        "#563d7c",
  HTML:       "#e34c26",
  Shell:      "#89e051",
  Ruby:       "#701516",
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d !== 1 ? "s" : ""} ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} month${mo !== 1 ? "s" : ""} ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

function Skeleton() {
  return (
    <ul className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="animate-pulse rounded-xl border border-zinc-100 p-4 dark:border-zinc-800"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="h-3.5 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-16 rounded bg-zinc-100 dark:bg-zinc-800/60" />
          </div>
          <div className="mt-2 h-3 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800/60" />
        </li>
      ))}
    </ul>
  );
}

export default function GitHubActivity() {
  const [repos, setRepos] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.github.com/users/sanjay-creativelements/repos?sort=updated&per_page=5"
    )
      .then((r) => {
        if (!r.ok) throw new Error("GitHub API error");
        return r.json();
      })
      .then(setRepos)
      .catch(() => setError(true));
  }, []);

  return (
    <section className="mb-16">
      <div className="rounded-2xl border-2 border-zinc-300 bg-white p-8 dark:border dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400">
          GitHub Activity
        </h2>

        {error && (
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            Unable to load activity.
          </p>
        )}

        {!repos && !error && <Skeleton />}

        {repos && (
          <ul className="space-y-3">
            {repos.map((repo) => (
              <li
                key={repo.id}
                className="group rounded-xl border-2 border-zinc-200 p-4 transition-colors duration-200 hover:border-violet-300 hover:bg-violet-50/40 dark:border dark:border-zinc-800 dark:hover:border-violet-700/50 dark:hover:bg-violet-950/20"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-zinc-800 transition-colors duration-150 group-hover:text-violet-600 dark:text-zinc-200 dark:group-hover:text-violet-400"
                  >
                    {repo.name}
                  </a>
                  <span className="text-xs text-zinc-400 dark:text-zinc-600">
                    Updated {timeAgo(repo.updated_at)}
                  </span>
                </div>

                {repo.description && (
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {repo.description}
                  </p>
                )}

                {(repo.language || repo.stargazers_count > 0) && (
                  <div className="mt-2.5 flex items-center gap-3">
                    {repo.language && (
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              LANGUAGE_COLORS[repo.language] ?? "#71717a",
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        ★ {repo.stargazers_count}
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
