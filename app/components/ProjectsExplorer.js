"use client";

import { useState, useRef, useEffect } from "react";
import { projects } from "@/lib/projects";
import ProjectCard from "@/app/components/ProjectCard";

// ─── Phase state machine ──────────────────────────────────────────────────────
//
// OPEN sequence:
//   grid → hiding → sliding → detail
//   (fade content out) (collapse + slide left) (show detail panel)
//
// CLOSE sequence:
//   detail → hiding-detail → expanding → showing-content → grid
//   (fade detail out) (expand right)  (restore + fade content in)
//
// The key invariant: maxHeight snaps (no transition) only while opacity is
// already 0, so the snap is invisible and text never visibly reflows.
// ─────────────────────────────────────────────────────────────────────────────

function deriveState(phase) {
  // Content opacity — drives fade in/out of descriptions + tags
  const contentVisible = phase === "grid" || phase === "showing-content";

  // Content presence — drives maxHeight (instant snap, always invisible)
  // True while the content needs to take up space (during fade or fully visible)
  const contentPresent =
    phase === "grid" || phase === "hiding" || phase === "showing-content";

  // Left panel width
  const panelNarrow =
    phase === "sliding" || phase === "detail" || phase === "hiding-detail";

  // Enable width transition only during the actual slide phases
  const panelTransition =
    phase === "sliding" || phase === "expanding"
      ? "width 0.65s cubic-bezier(0.4, 0, 0.2, 1)"
      : "none";

  // Whether to show the sidebar title list vs the card grid
  const showSidebar = phase === "detail" || phase === "hiding-detail";

  // Whether the right detail panel is mounted
  const showDetail = phase === "detail" || phase === "hiding-detail";

  // Whether the detail panel is fading out
  const detailFadingOut = phase === "hiding-detail";

  return {
    contentVisible,
    contentPresent,
    panelNarrow,
    panelTransition,
    showSidebar,
    showDetail,
    detailFadingOut,
  };
}

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

function ArrowLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
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
  const timers = useRef([]);

  useEffect(() => {
    const ts = timers.current;
    return () => ts.forEach(clearTimeout);
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
    setPhase("hiding");                          // step 1: fade content out (0.3s)
    schedule(() => setPhase("sliding"), 300);    // step 2: collapse + slide (0.65s)
    schedule(() => setPhase("detail"),  950);    // step 3: show detail panel
  }

  // ── Close ─────────────────────────────────────────────────────────────────
  function handleClose() {
    if (phase !== "detail") return;
    clearTimers();
    setPhase("hiding-detail");                         // step 1: fade detail out (0.3s)
    schedule(() => setPhase("expanding"),       330);  // step 2: expand panel (0.65s)
    schedule(() => setPhase("showing-content"), 980);  // step 3: restore + fade content in (0.3s)
    schedule(() => {
      setSelectedSlug(null);
      setPhase("grid");
    }, 1280);
  }

  // ── Switch project (sidebar click — no layout transition needed) ──────────
  function handleSidebarSelect(slug) {
    if (phase !== "detail") return;
    setSelectedSlug(slug);
  }

  const {
    contentVisible,
    contentPresent,
    panelNarrow,
    panelTransition,
    showSidebar,
    showDetail,
    detailFadingOut,
  } = deriveState(phase);

  const selected = projects.find((p) => p.slug === selectedSlug) ?? null;

  return (
    <div
      style={{
        display: "flex",
        gap: showDetail ? "1.5rem" : "0",
        alignItems: "flex-start",
      }}
    >
      {/* ── Left panel ──────────────────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          width: panelNarrow ? "220px" : "100%",
          overflow: "hidden",
          transition: panelTransition,
        }}
      >
        {showSidebar ? (
          <nav
            style={{ animation: "fadeIn 0.3s ease both" }}
            className="flex flex-col"
          >
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
              Projects
            </p>

            {projects.map((p) => (
              <button
                key={p.slug}
                onClick={() => handleSidebarSelect(p.slug)}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors duration-200 ${
                  selectedSlug === p.slug
                    ? "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                {p.title}
              </button>
            ))}

            <button
              onClick={handleClose}
              className="mt-6 flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300"
            >
              <ArrowLeftIcon />
              Back to grid
            </button>
          </nav>
        ) : (
          <div className="flex flex-wrap justify-center gap-5">
            {projects.map((p) => (
              <div key={p.slug} className="w-full sm:w-[calc(50%-0.625rem)]">
                <ProjectCard
                  {...p}
                  contentVisible={contentVisible}
                  contentPresent={contentPresent}
                  onClick={() => handleCardClick(p.slug)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right detail panel ──────────────────────────────────────────── */}
      {showDetail && selected && (
        <article
          key={selectedSlug}
          style={{
            opacity: detailFadingOut ? 0 : 1,
            transition: detailFadingOut ? "opacity 0.3s ease" : "none",
            animation: detailFadingOut
              ? "none"
              : "slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) both",
          }}
          className="min-w-0 flex-1 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {selected.title}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
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
  );
}
