export default function FloatingOrbs() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[0] overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute -left-28 -top-28 h-[520px] w-[520px] rounded-full bg-violet-600 opacity-[0.18]"
        style={{ filter: "blur(120px)", animation: "orbFloat1 22s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-20 top-10 h-[440px] w-[440px] rounded-full bg-indigo-600 opacity-[0.15]"
        style={{ filter: "blur(110px)", animation: "orbFloat2 27s ease-in-out infinite" }}
      />
      <div
        className="absolute left-[38%] top-[30%] h-[460px] w-[460px] rounded-full bg-purple-700 opacity-[0.12]"
        style={{ filter: "blur(130px)", animation: "orbFloat3 19s ease-in-out infinite" }}
      />
      <div
        className="absolute -bottom-20 right-[18%] h-[400px] w-[400px] rounded-full bg-violet-500 opacity-[0.16]"
        style={{ filter: "blur(115px)", animation: "orbFloat1 24s ease-in-out infinite 5s" }}
      />
      <div
        className="absolute -bottom-28 -left-16 h-[380px] w-[380px] rounded-full bg-indigo-500 opacity-[0.13]"
        style={{ filter: "blur(105px)", animation: "orbFloat2 30s ease-in-out infinite 9s" }}
      />
    </div>
  );
}