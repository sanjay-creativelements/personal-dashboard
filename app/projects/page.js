import Link from "next/link";
import ProjectsExplorer from "@/app/components/ProjectsExplorer";

export const metadata = {
  title: "Projects · Sanjay Waugh",
  description: "Projects built by Sanjay Waugh at Creative Elements.",
};

function ArrowLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
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

export default function ProjectsPage() {
  return (
    <div className="min-h-screen font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500" />

      <main className="mx-auto max-w-4xl px-6 pb-16 pt-8 sm:pb-24 sm:pt-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <ArrowLeftIcon />
          Back to dashboard
        </Link>

        <h1 className="mb-8 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Projects
        </h1>

        <ProjectsExplorer />

        <footer className="mt-20 text-center text-xs text-zinc-400 dark:text-zinc-600">
          Updated March 2026 · Creative Elements
        </footer>
      </main>
    </div>
  );
}
