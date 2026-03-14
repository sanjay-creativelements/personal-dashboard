import Link from "next/link";
import Image from "next/image";
import IntroOverlay from "@/app/components/IntroOverlay";
import GitHubActivity from "@/app/components/GitHubActivity";

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

function EmailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
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
    <div className="min-h-screen font-sans">
      <IntroOverlay />
      {/* Subtle top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500" />

      <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        {/* Hero / Profile */}
        <section className="mb-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

            {/* Profile */}
            <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
              {/* Avatar */}
              <div className="relative h-20 w-20 shrink-0 rounded-full p-[2px] bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 shadow-lg shadow-violet-500/30">
                <div className="relative overflow-hidden rounded-full h-full w-full">
                  <Image
                    src="/profile.png"
                    alt="Sanjay Waugh"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-200">
                    Sanjay Waugh
                  </h1>
                  <p className="mt-2 text-base font-medium text-indigo-600 dark:text-indigo-400">
                    Junior Builder · creativelements.org
                  </p>
                </div>

                <p className="max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Learning by building and shipping real things.
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

            {/* Contact card */}
            <div className="rounded-2xl border-2 border-zinc-300 bg-white p-6 dark:border dark:border-zinc-800 dark:bg-zinc-900 lg:w-60 lg:shrink-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400">
                Contact
              </p>
              <p className="mt-2 text-sm leading-snug text-zinc-600 dark:text-zinc-400">
                Got something in mind?<br />
                Let&apos;s talk —
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href="mailto:sanjay@creativelements.org"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-violet-500 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"
                >
                  <EmailIcon />
                  Email me
                </a>
                <a
                  href="https://www.linkedin.com/in/sanjay-waugh-50540625b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-violet-500 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"
                >
                  <LinkedInIcon />
                  LinkedIn
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* About my work */}
        <section className="mb-16">
          <div className="rounded-2xl border-2 border-zinc-300 bg-white p-8 dark:border dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400">
              What I&apos;m building
            </h2>
            <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              At creativelements, the software I help build actually gets
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

        {/* GitHub Activity */}
        <GitHubActivity />

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
          Updated March 2026 · creativelements
        </footer>
      </main>
    </div>
  );
}
