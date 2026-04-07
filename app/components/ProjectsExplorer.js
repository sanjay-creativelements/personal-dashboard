"use client";

import { useState, useRef, useEffect } from "react";
import ProjectCard from "@/app/components/ProjectCard";

// ── ✏️  EDIT YOUR PROJECTS HERE ───────────────────────────────────────────────
//
// Each object in PROJECTS represents one card on the /projects page.
//
// Required fields:
//   slug          — URL-safe unique ID (used in the sidebar, must be unique)
//   title         — Card heading / sidebar pill label
//   description   — Short blurb shown on the card (keep it under ~100 chars)
//   longDescription — Full paragraph shown in the detail panel (50–80 words)
//   tags          — Array of strings shown as small badges, e.g. ["Next.js", "TypeScript"]
//   githubUrl     — Full GitHub URL for the "Click to see my work" button
//   updatedAt     — ISO date string used for "Updated X days ago" label,
//                   e.g. "2026-03-15T00:00:00Z" — set to today's date for new projects
//   timeGroup     — Which section header the card appears under.
//                   Must be one of: "This Week" | "Last Week" | "Last Month" | "Older"
//
// Optional fields:
//   isRepoSummary — Set to true to show a small "repo" badge on the card.
//                   Useful when a card represents a whole repo rather than a subfolder.
//                   Defaults to false if omitted.
//
// Tips:
//   • Order within each group is the order entries appear in this array.
//   • To add a project: copy an existing object, change its fields, save. Done.
//   • To remove a project: delete its object from the array.
//   • To move between groups: change its timeGroup field.
//
// ─────────────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    slug: "rankmob-io",
    title: "rankmob.io",
    description: "A rank tracking and SEO analytics platform — built across the full stack with Next.js",
    longDescription:
      "A full-stack rank tracking and SEO analytics platform built with Next.js. " +
      "I work across both the frontend and backend — building the UI, wiring up APIs, " +
      "and handling the data layer. It's a live product used by real users, which means " +
      "every decision I make in the codebase has a direct impact on what people experience.",
    tags: ["Frontend", "Backend"],
    githubUrl: "https://rankmob.io",
    updatedAt: null,
    timeGroup: "This Week",
    status: "In Progress",
  },
  {
    slug: "personal-dashboard",
    title: "Personal Dashboard",
    description: "A public-facing portfolio and dashboard site built with Next.js.",
    longDescription:
      "A live portfolio site built with Next.js 16, React 19, and Tailwind CSS v4. " +
      "Features a dark-mode-first design, animated intro overlay, floating orb background, " +
      "a split-panel project explorer with pill navigation, and AI-generated project descriptions " +
      "via claude-haiku-4-5. Deployed on Vercel with automatic production deploys on push to main.",
    tags: ["Next.js", "React", "Tailwind CSS", "Anthropic AI"],
    githubUrl: "https://github.com/sanjay-creativelements/personal-dashboard",
    updatedAt: "2026-03-20T00:00:00Z",
    timeGroup: "This Week",
    isRepoSummary: true,
  },
  // ── Add more projects below. Copy the block above, change the fields. ────────
  // {
  //   slug: "my-project",
  //   title: "My Project",
  //   description: "One sentence about what this project does.",
  //   longDescription:
  //     "Two to four sentences describing the project in more depth. " +
  //     "Mention the tech stack, what problem it solves, and any interesting details.",
  //   tags: ["React", "Node.js"],
  //   githubUrl: "https://github.com/sanjay-creativelements/my-project",
  //   updatedAt: "2026-04-01T00:00:00Z",
  //   timeGroup: "This Week",
  // },
];

// ── Group ordering — do not change unless you rename the timeGroup values above.
const GROUP_ORDER = ["This Week", "Last Week", "Last Month", "Older"];

// Derive the grouped structure once (static — no fetch needed).
const GROUPS = GROUP_ORDER
  .map((group) => ({ group, projects: PROJECTS.filter((p) => p.timeGroup === group) }))
  .filter((g) => g.projects.length > 0);

// ── Phase state machine ────────────────────────────────────────────────────────
//
// DESKTOP OPEN:   grid → hiding-content → forming-pills → detail
// DESKTOP CLOSE:  detail → hiding-detail → shrinking-pills → grid
//
// MOBILE OPEN:    grid → detail          (no pill animation)
// MOBILE CLOSE:   detail → grid          (no pill animation)
//
// On mobile the sidebar nav is CSS-hidden (hidden md:flex). The detail panel
// renders full-width and includes a "← Back" button (md:hidden) at the top.
// ─────────────────────────────────────────────────────────────────────────────

const PILL_DURATION = 300; // ms — per-pill grow/shrink duration
const PILL_STAGGER  =  45; // ms — delay between consecutive pills

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ProjectsExplorer() {
  const [phase, setPhase] = useState("grid");
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const timers = useRef([]);
  // "slideInRight" on first open; "fadeIn" when switching via sidebar.
  const detailAnim = useRef("slideInRight 0.3s ease both");

  // Flat list of all projects across all time groups (used for selection lookup).
  const allProjects = GROUPS.flatMap((g) => g.projects);

  // The group that contains the selected project — drives sidebar scope.
  const selectedGroupData =
    GROUPS.find((g) => g.projects.some((p) => p.slug === selectedSlug)) ?? null;
  // Only show projects from the same time group in the sidebar.
  const sidebarProjects = selectedGroupData?.projects ?? [];
  const sidebarGroupName = selectedGroupData?.group ?? "";

  // Cleanup animation timers on unmount
  useEffect(() => {
    const ts = timers.current;
    return () => ts.forEach(clearTimeout);
  }, []);

  // Track mobile breakpoint so handlers can skip the pill animation.
  // md breakpoint = 768px, matching Tailwind's default.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function schedule(fn, delay) {
    timers.current.push(setTimeout(fn, delay));
  }

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  // ── Open ──────────────────────────────────────────────────────────────────
  function handleCardClick(slug) {
    if (phase !== "grid") return;
    clearTimers();
    setSelectedSlug(slug);

    // Mobile: skip pill animation, jump straight to detail.
    if (isMobile) {
      setPhase("detail");
      return;
    }

    detailAnim.current = "slideInRight 0.3s ease both";
    setPhase("hiding-content");                       // 1. fade out all card content
    schedule(() => setPhase("forming-pills"), 300);   // 2. layout snaps, pills grow in
    schedule(() => setPhase("detail"),        650);   // 3. detail slides in
  }

  // ── Close ─────────────────────────────────────────────────────────────────
  function handleClose() {
    if (phase !== "detail") return;
    clearTimers();

    // Mobile: skip pill animation, snap straight back to grid.
    if (isMobile) {
      setSelectedSlug(null);
      setPhase("grid");
      return;
    }

    setPhase("hiding-detail");                        // 1. right panel fades out
    schedule(() => setPhase("shrinking-pills"), 300); // 2. pills collapse
    schedule(() => {
      setSelectedSlug(null);
      setPhase("grid");                               // 3. grid re-mounts with cardReveal
    }, 650);
  }

  // ── Switch project (sidebar click) ────────────────────────────────────────
  function handleSidebarSelect(slug) {
    if (phase !== "detail") return;
    detailAnim.current = "fadeIn 0.3s ease both";
    setSelectedSlug(slug);
  }

  // ── Derived visibility ────────────────────────────────────────────────────
  const showGrid    = phase === "grid" || phase === "hiding-content";
  const showSidebar = phase === "forming-pills" || phase === "detail" ||
                      phase === "hiding-detail"  || phase === "shrinking-pills";
  const showDetail  = phase === "detail" || phase === "hiding-detail";

  const selected = allProjects.find((p) => p.slug === selectedSlug) ?? null;

  return (
    <div>
      {/* ── Card grid with time-group headers ──────────────────────────────── */}
      {showGrid && (
        <div>
          {GROUPS.map(({ group, projects: groupProjects }) => (
            <div key={group} className="mb-10">

              {/* Time-group header */}
              <div className="mb-6 flex items-center gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {group}
                </h2>
                <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                <span className="text-xs text-zinc-400 dark:text-zinc-600">
                  {groupProjects.length}
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-5">
                {groupProjects.map((p) => {
                  // Use global index so cardReveal stagger spans all groups.
                  const globalIndex = allProjects.indexOf(p);
                  return (
                    <div
                      key={p.slug}
                      className="w-full sm:w-[calc(50%-0.625rem)]"
                      style={{
                        animation: `cardReveal 280ms ease both`,
                        animationDelay: `${globalIndex * 50}ms`,
                      }}
                    >
                      <ProjectCard
                        {...p}
                        onClick={() => handleCardClick(p.slug)}
                        contentVisible={phase !== "hiding-content"}
                        titleVisible={phase !== "hiding-content"}
                        contentPresent={true}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Sidebar + detail panel ────────────────────────────────────────── */}
      {showSidebar && (
        <div className="flex items-start gap-6">

          {/* Pill sidebar — hidden on mobile, visible on md+
              Shows only projects from the same time group as the selected project. */}
          <nav className="hidden w-[200px] shrink-0 flex-col md:flex">

            {/* Group label */}
            {sidebarGroupName && (
              <div className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {sidebarGroupName}
              </div>
            )}

            {sidebarProjects.map((p, i) => {
              const isSelected  = p.slug === selectedSlug;
              const isGrowing   = phase === "forming-pills";
              const isShrinking = phase === "shrinking-pills";
              // Reverse index is scoped to this group's project count.
              const reverseIdx  = sidebarProjects.length - 1 - i;

              const wrapperStyle = {
                marginBottom: "6px",
                ...(isGrowing && {
                  overflow: "hidden",
                  animation: `pillGrow ${PILL_DURATION}ms ease both`,
                  animationDelay: `${i * PILL_STAGGER}ms`,
                }),
                ...(isShrinking && {
                  overflow: "hidden",
                  animation: `pillShrink ${PILL_DURATION}ms ease both`,
                  animationDelay: `${reverseIdx * PILL_STAGGER}ms`,
                }),
              };

              return (
                <div key={p.slug} style={wrapperStyle}>
                  <button
                    onClick={() => handleSidebarSelect(p.slug)}
                    disabled={phase !== "detail"}
                    className={`h-10 w-full truncate rounded-lg px-3 text-left text-sm font-medium transition-colors duration-200 disabled:pointer-events-none ${
                      isSelected
                        ? "bg-violet-100 text-violet-700 ring-1 ring-violet-400/50 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-500/40"
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                    }`}
                  >
                    {p.title}
                  </button>
                </div>
              );
            })}

            {/* Desktop back button — inside the sidebar, hidden on mobile */}
            {(phase === "detail" || phase === "hiding-detail") && (
              <button
                onClick={handleClose}
                className="mt-4 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition-colors duration-200 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300"
              >
                <ArrowLeftIcon />
                Back to grid
              </button>
            )}
          </nav>

          {/* Detail panel */}
          {showDetail && selected && (
            <article
              key={selectedSlug}
              style={{
                opacity:    phase === "hiding-detail" ? 0 : undefined,
                transition: phase === "hiding-detail" ? "opacity 0.3s ease" : undefined,
                animation:  phase === "detail" ? detailAnim.current : "none",
              }}
              className="min-w-0 flex-1 rounded-2xl border-2 border-zinc-300 bg-white p-6 shadow-sm sm:p-8 dark:border dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* Mobile back button — hidden on md+ where the sidebar handles navigation */}
              <button
                onClick={handleClose}
                className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 md:hidden"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </button>

              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {selected.title}
              </h2>

              <p className="mt-4 text-base leading-relaxed text-justify text-zinc-600 dark:text-zinc-400">
                {selected.longDescription}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {selected.status && (
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {selected.status}
                  </span>
                </div>
              )}

              <div className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-800">
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <GitHubIcon />
                  Click to see my work :)
                </a>
              </div>
            </article>
          )}
        </div>
      )}
    </div>
  );
}
