// Server component — pure decorative markup, no interactivity.
// z-[-1] places orbs below all page content in the body stacking context.
// Page root divs are bg-transparent so the body background shows through,
// letting the orbs be visible between the body colour and page content.
export default function FloatingOrbs() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Light theme orbs (hidden in dark mode) ─────────────────────────
          Softer lavender / pink / indigo tones, slightly higher opacity
          so they read against a white background.                          */}
      <div className="dark:hidden">
        {/* Top-left — lavender violet */}
        <div
          className="absolute -left-28 -top-28 h-[520px] w-[520px] rounded-full bg-violet-300 opacity-[0.30]"
          style={{ filter: "blur(120px)", animation: "orbFloat1 20s ease-in-out infinite" }}
        />
        {/* Top-right — soft indigo */}
        <div
          className="absolute -right-20 top-10 h-[440px] w-[440px] rounded-full bg-indigo-200 opacity-[0.35]"
          style={{ filter: "blur(110px)", animation: "orbFloat2 26s ease-in-out infinite" }}
        />
        {/* Centre — light purple */}
        <div
          className="absolute left-[38%] top-[30%] h-[460px] w-[460px] rounded-full bg-purple-200 opacity-[0.28]"
          style={{ filter: "blur(130px)", animation: "orbFloat3 18s ease-in-out infinite" }}
        />
        {/* Bottom-right — soft fuchsia / pink */}
        <div
          className="absolute -bottom-20 right-[18%] h-[400px] w-[400px] rounded-full bg-fuchsia-200 opacity-[0.30]"
          style={{ filter: "blur(115px)", animation: "orbFloat1 23s ease-in-out infinite 4s" }}
        />
        {/* Bottom-left — light pink */}
        <div
          className="absolute -bottom-28 -left-16 h-[380px] w-[380px] rounded-full bg-pink-200 opacity-[0.25]"
          style={{ filter: "blur(105px)", animation: "orbFloat2 29s ease-in-out infinite 8s" }}
        />
      </div>

      {/* ── Dark theme orbs (hidden in light mode) ─────────────────────────
          Rich violet / indigo / purple at low opacity against near-black.  */}
      <div className="hidden dark:block">
        {/* Top-left — violet */}
        <div
          className="absolute -left-28 -top-28 h-[520px] w-[520px] rounded-full bg-violet-600 opacity-[0.18]"
          style={{ filter: "blur(120px)", animation: "orbFloat1 22s ease-in-out infinite" }}
        />
        {/* Top-right — indigo */}
        <div
          className="absolute -right-20 top-10 h-[440px] w-[440px] rounded-full bg-indigo-600 opacity-[0.15]"
          style={{ filter: "blur(110px)", animation: "orbFloat2 27s ease-in-out infinite" }}
        />
        {/* Centre — purple */}
        <div
          className="absolute left-[38%] top-[30%] h-[460px] w-[460px] rounded-full bg-purple-700 opacity-[0.12]"
          style={{ filter: "blur(130px)", animation: "orbFloat3 19s ease-in-out infinite" }}
        />
        {/* Bottom-right — violet */}
        <div
          className="absolute -bottom-20 right-[18%] h-[400px] w-[400px] rounded-full bg-violet-500 opacity-[0.16]"
          style={{ filter: "blur(115px)", animation: "orbFloat1 24s ease-in-out infinite 5s" }}
        />
        {/* Bottom-left — indigo */}
        <div
          className="absolute -bottom-28 -left-16 h-[380px] w-[380px] rounded-full bg-indigo-500 opacity-[0.13]"
          style={{ filter: "blur(105px)", animation: "orbFloat2 30s ease-in-out infinite 9s" }}
        />
      </div>
    </div>
  );
}
