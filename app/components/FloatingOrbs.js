export default function FloatingOrbs() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[0] overflow-hidden"
      aria-hidden="true"
    >
      {/* ── DESKTOP — strictly left and right edges only ── */}
      <div className="hidden sm:block">
        {/* Left orb — far left edge only */}
        <div
         className="absolute -left-40 top-[20%] h-[380px] w-[380px] rounded-full bg-violet-600 opacity-[0.22]"
          style={{ filter: "blur(150px)", animation: "orbUpDown 8s ease-in-out infinite" }}
        />
        {/* Right orb — far right edge only */}
        <div
          className="absolute -right-40 top-[25%] h-[380px] w-[380px] rounded-full bg-indigo-600 opacity-[0.20]"
          style={{ filter: "blur(150px)", animation: "orbUpDown 10s ease-in-out infinite", animationDelay: "-4s" }}
        />
      </div>

      {/* ── MOBILE — free floating ── */}
      <div className="block sm:hidden">
        <div
          className="absolute -left-20 top-[10%] h-[350px] w-[350px] rounded-full bg-violet-600 opacity-[0.35]"
          style={{ filter: "blur(100px)", animation: "orbFloat1 12s ease-in-out infinite" }}
        />
        <div
          className="absolute -right-20 top-[40%] h-[320px] w-[320px] rounded-full bg-indigo-600 opacity-[0.30]"
          style={{ filter: "blur(100px)", animation: "orbFloat2 15s ease-in-out infinite" }}
        />
        <div
          className="absolute left-[10%] bottom-[10%] h-[300px] w-[300px] rounded-full bg-purple-700 opacity-[0.28]"
          style={{ filter: "blur(90px)", animation: "orbFloat3 18s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}