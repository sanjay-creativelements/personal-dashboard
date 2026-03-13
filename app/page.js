import Link from "next/link";
import IntroOverlay from "@/app/components/IntroOverlay";

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

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}


export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <IntroOverlay />
      {/* Subtle top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500" />

      <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        {/* Hero / Profile */}
        <section className="mb-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl font-bold text-white shadow-lg">
              SW
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Sanjay Waugh
                </h1>
                <p className="mt-1 text-base font-medium text-indigo-600 dark:text-indigo-400">
                  Junior Builder · Creative Elements
                </p>
              </div>

              <p className="max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                Junior Builder at Creative Elements. Currently in Week 1 —
                learning JavaScript, Node.js, and modern development workflows.
              </p>

              <a
                href="https://github.com/sanjay-creativelements"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors duration-200 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              >
                <GitHubIcon />
                github.com/sanjay-creativelements
              </a>
            </div>
          </div>
        </section>

        {/* About my work */}
        <section className="mb-16">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400">
              What I&apos;m building
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              At Creative Elements, the software I help build actually gets
              used — by real clients, in production, with real stakes attached.
              I contribute across the stack, from shaping interfaces to writing
              backend logic and wiring up data, working inside{" "}
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                Next.js
              </span>{" "}
              codebases that serve live users. It&apos;s not coursework and it&apos;s
              not simulation. Every line I write is either in front of users or
              one step away from it — which turns out to be the fastest way to
              learn what actually matters.
            </p>
          </div>
        </section>

        {/* Projects CTA */}
        <section className="flex justify-center">
          <Link
            href="/projects"
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-violet-500/50"
          >
            {/* Animated glow ring on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
            />
            <span className="relative">See my projects</span>
            <span className="relative">
              <ArrowRightIcon />
            </span>
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-xs text-zinc-400 dark:text-zinc-600">
          Updated March 2026 · Creative Elements
        </footer>
      </main>
    </div>
  );
}
