"use client";

import { useState, useRef, useEffect } from "react";
import { projects } from "@/lib/projects";
import ProjectCard from "@/app/components/ProjectCard";

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

export default function ProjectsExplorer() {
  const [phase, setPhase] = useState("grid");
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const timers = useRef([]);
  // "slideInRight" on first open; "fadeIn" when switching via sidebar.
  const detailAnim = useRef("slideInRight 0.3s ease both");

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

  const selected = projects.find((p) => p.slug === selectedSlug) ?? null;

  return (
    <div>
      {/* ── Card grid ─────────────────────────────────────────────────────── */}
      {showGrid && (
        <div className="flex flex-wrap justify-center gap-5">
          {projects.map((p, i) => (
            <div
              key={p.slug}
              className="w-full sm:w-[calc(50%-0.625rem)]"
              style={{
                animation: `cardReveal 280ms ease both`,
                animationDelay: `${i * 50}ms`,
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
          ))}
        </div>
      )}

      {/* ── Sidebar + detail panel ────────────────────────────────────────── */}
      {showSidebar && (
        <div className="flex items-start gap-6">

          {/* Pill sidebar — hidden on mobile, visible on md+ */}
          <nav className="hidden w-[200px] shrink-0 flex-col md:flex">
            {projects.map((p, i) => {
              const isSelected  = p.slug === selectedSlug;
              const isGrowing   = phase === "forming-pills";
              const isShrinking = phase === "shrinking-pills";
              const reverseIdx  = projects.length - 1 - i;

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
