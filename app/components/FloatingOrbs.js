export default function FloatingOrbs() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[0] overflow-hidden"
      aria-hidden="true"
    >
      {/* ── DESKTOP — 3 orbs, up/down only, away from center image ── */}
      <div className="hidden sm:block">
        {/* Left orb — near the name/text area */}
        <div
          className="absolute -left-20 top-[20%] h-[500px] w-[500px] rounded-full bg-violet-600 opacity-[0.45]"
          style={{ filter: "blur(120px)", animation: "orbUpDown 8s ease-in-out infinite" }}
        />
        {/* Right orb — near the quote message area */}
        <div
          className="absolute -right-20 top-[25%] h-[480px] w-[480px] rounded-full bg-indigo-600 opacity-[0.40]"
          style={{ filter: "blur(120px)", animation: "orbUpDown 10s ease-in-out infinite", animationDelay: "-4s" }}
        />
        {/* Bottom center — subtle, sits below content */}
        <div
          className="absolute bottom-[-10%] left-[35%] h-[400px] w-[400px] rounded-full bg-purple-700 opacity-[0.30]"
          style={{ filter: "blur(130px)", animation: "orbUpDown 12s ease-in-out infinite", animationDelay: "-6s" }}
        />
      </div>

      {/* ── MOBILE — 3 orbs, free floating anywhere ── */}
      <div className="block sm:hidden">
        <div
          className="absolute -left-20 top-[10%] h-[350px] w-[350px] rounded-full bg-violet-600 opacity-[0.45]"
          style={{ filter: "blur(100px)", animation: "orbFloat1 12s ease-in-out infinite" }}
        />
        <div
          className="absolute -right-20 top-[40%] h-[320px] w-[320px] rounded-full bg-indigo-600 opacity-[0.40]"
          style={{ filter: "blur(100px)", animation: "orbFloat2 15s ease-in-out infinite" }}
        />
        <div
          className="absolute left-[10%] bottom-[10%] h-[300px] w-[300px] rounded-full bg-purple-700 opacity-[0.35]"
          style={{ filter: "blur(90px)", animation: "orbFloat3 18s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}