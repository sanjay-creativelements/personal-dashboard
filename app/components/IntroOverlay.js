"use client";

import { useEffect, useState } from "react";

export default function IntroOverlay() {
  // "covered" = overlay fully visible, blocking the page.
  // This is the default so the overlay is opaque from the very first
  // client render — no flash of the dashboard underneath.
  // null = not mounted yet (server / pre-hydration); "done" = unmount.
  const [phase, setPhase] = useState("covered");

  useEffect(() => {
    // Return visit: skip the animation entirely and remove the overlay.
    if (sessionStorage.getItem("introPlayed")) {
      setPhase("done");
      return;
    }

    sessionStorage.setItem("introPlayed", "true");

    // One frame after mount: enable transitions and start the text fade-in (1.2s).
    const enter = setTimeout(() => setPhase("enter"), 50);
    // Text fully visible — start fading it out (1.2s).
    const fadeTextOut = setTimeout(() => setPhase("fadeText"), 2250);
    // Text gone — fade the whole overlay out (0.8s).
    const fadeOverlay = setTimeout(() => setPhase("fadeOverlay"), 3450);
    // Remove from DOM — exactly 4.5s total.
    const remove = setTimeout(() => setPhase("done"), 4500);

    return () => {
      clearTimeout(enter);
      clearTimeout(fadeTextOut);
      clearTimeout(fadeOverlay);
      clearTimeout(remove);
    };
  }, []);

  if (phase === "done") return null;

  const overlayOpaque = phase !== "fadeOverlay";
  const textVisible = phase === "enter";
  // Keep transitions disabled during "covered" so nothing animates before
  // useEffect has had a chance to decide whether to play or skip.
  const transitionsActive = phase !== "covered";

  return (
    <div
      aria-hidden="true"
      style={{
        opacity: overlayOpaque ? 1 : 0,
        transition: transitionsActive ? "opacity 0.8s ease" : "none",
      }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
    >
      {/* Dark glass background */}
      <div className="absolute inset-0 bg-zinc-950/80" />

      {/* Centered text */}
      <p
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "translateY(0)" : "translateY(-8px)",
          transition: transitionsActive
            ? "opacity 1.2s ease, transform 1.2s ease"
            : "none",
        }}
        className="relative z-10 px-6 text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl"
      >
        Hey! Here&apos;s the scoop on me.
      </p>
    </div>
  );
}
