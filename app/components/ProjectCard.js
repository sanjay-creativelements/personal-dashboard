import Link from "next/link";

// contentVisible — drives opacity of description + tags (default true)
// contentPresent — drives maxHeight of description + tags (default true)
// Both are animated by ProjectsExplorer. When used outside the explorer
// (e.g. the [slug] pages) neither prop is passed, so they default to true.

function formatUpdatedAt(updatedAt) {
  if (!updatedAt) return null;
  const days = Math.floor((Date.now() - new Date(updatedAt).getTime()) / 86_400_000);
  if (days === 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  return `Updated ${days} days ago`;
}

const cardInner = (title, description, tags, updatedAt, contentVisible, contentPresent, titleVisible, isRepoSummary) => {
  const updatedLabel = formatUpdatedAt(updatedAt);
  return (
    <div className="flex h-full flex-col rounded-2xl border-2 border-zinc-300 bg-white p-6 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-violet-400 group-hover:shadow-[0_0_0_1px_theme(colors.violet.400),0_8px_24px_-4px_theme(colors.violet.200)] dark:border dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:border-violet-500 dark:group-hover:shadow-[0_0_0_1px_theme(colors.violet.500),0_8px_24px_-4px_theme(colors.violet.950)]">
      <div className="flex items-start justify-between gap-2">
        <h3
          className="text-base font-semibold text-zinc-900 dark:text-zinc-50"
          style={{ opacity: titleVisible ? 1 : 0, transition: "opacity 0.3s ease" }}
        >
          {title}
        </h3>
        {isRepoSummary && (
          <span
            className="shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-500"
            style={{ opacity: titleVisible ? 1 : 0, transition: "opacity 0.3s ease" }}
          >
            repo
          </span>
        )}
      </div>

      {/* Animated content wrapper — fades and collapses independently of the
          card border/title so text never visibly reflows during layout changes */}
      <div
        className="flex-1"
        style={{
          opacity: contentVisible ? 1 : 0,
          // maxHeight snaps instantly (no CSS transition declared here).
          // The snap is invisible because opacity is already 0 when it fires.
          maxHeight: contentPresent ? "300px" : "0px",
          overflow: "hidden",
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="mt-4 flex flex-col gap-4">
          <p className="flex-1 text-sm leading-relaxed text-justify text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
          {updatedLabel && (
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              {updatedLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProjectCard({
  slug,
  title,
  description,
  tags,
  updatedAt,
  onClick,
  contentVisible = true,
  contentPresent = true,
  titleVisible = true,
  isRepoSummary = false,
}) {
  if (onClick) {
    return (
      <button onClick={onClick} className="group block h-full w-full text-left">
        {cardInner(title, description, tags, updatedAt, contentVisible, contentPresent, titleVisible, isRepoSummary)}
      </button>
    );
  }

  return (
    <Link href={`/projects/${slug}`} className="group block h-full">
      {cardInner(title, description, tags, updatedAt, contentVisible, contentPresent, titleVisible, isRepoSummary)}
    </Link>
  );
}
