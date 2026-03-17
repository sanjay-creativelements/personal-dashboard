# Personal Dashboard — CLAUDE.md

## What this project is

A personal dashboard / portfolio site for Sanjay Waugh (Junior Builder at creativelements.org). It shows a profile, bio, contact card, GitHub activity feed, a "What I'm building" section, and a portfolio of projects. It is a real public-facing site deployed on Vercel — not a demo.

---

## How to run locally

```bash
npm install
npm run dev        # starts at http://localhost:3000
npm run build      # production build
npm run start      # serves the production build
npm run lint       # ESLint
```

Node.js ≥ 18 required. The GitHub Activity section fetches from the public GitHub API client-side (no token required, subject to rate limiting).

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | Optional (recommended) | Powers AI-generated project descriptions on `/projects` via `claude-haiku-4-5`. Without it, the site falls back to GitHub repo descriptions or "No description available." |

For local dev, create a `.env.local` file:
```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Deployment

Deployed on **Vercel**. Push to `main` triggers a production deploy automatically. No build configuration changes needed — Vercel detects Next.js automatically.

**Required Vercel env var:** Set `ANTHROPIC_API_KEY` in the Vercel project settings (Settings → Environment Variables) for AI descriptions to work in production.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS v4 (PostCSS plugin, no `tailwind.config.js`) |
| Dark mode | Class-based (`.dark` on `<html>`), controlled by ThemeToggle + inline script |
| Fonts | Geist Sans + Geist Mono via `next/font/google` |
| Images | `next/image` with `fill` + `object-cover` for the profile photo |
| Data | Dynamic: GitHub API + Anthropic AI via `/api/projects`; static `lib/projects.js` for `/projects/[slug]` only |
| AI | `@anthropic-ai/sdk` with `claude-haiku-4-5`, cached via `unstable_cache` (24h revalidation) |
| Favicon | `/public/favicon-round.png` (circular-cropped PNG, generated with `sharp`) |

---

## File structure

```
/
├── app/
│   ├── layout.js                  Root layout — fonts, metadata, ThemeToggle, FloatingOrbs,
│   │                              inline dark-mode script
│   ├── globals.css                Tailwind import, CSS variables, dark mode variant,
│   │                              all @keyframes definitions
│   ├── favicon.png                App Router auto-detected favicon (copy of favicon-round.png)
│   ├── page.js                    Home page — profile, contact card, "What I'm building",
│   │                              GitHub activity, CTA button, footer
│   │
│   ├── api/
│   │   └── projects/
│   │       └── route.js           GET /api/projects — fetches GitHub repos, generates AI
│   │                              descriptions, groups by created_at, returns JSON
│   │
│   ├── projects/
│   │   ├── page.js                /projects — server shell + <ProjectsExplorer />
│   │   └── [slug]/
│   │       └── page.js            /projects/[slug] — statically generated project pages
│   │
│   └── components/
│       ├── IntroOverlay.js        Fullscreen intro animation (client component)
│       ├── ProjectCard.js         Reusable card — link mode or button mode; shows
│       │                          "Updated X days ago" label via updatedAt prop
│       ├── ProjectsExplorer.js    Pill-based split-panel explorer on /projects (client);
│       │                          fetches /api/projects, renders time-group headers
│       ├── GitHubActivity.js      GitHub recent repos feed (client component)
│       ├── FloatingOrbs.js        Decorative background orbs, both themes (server component)
│       ├── ThemeToggle.js         Fixed top-right sun/moon toggle (client component)
│       └── QuoteFooter.js         Unused — kept in repo but not rendered anywhere
│
├── lib/
│   └── projects.js                Static fallback data — used only by /projects/[slug]
│                                  (dynamic /projects page now sources from /api/projects)
│
├── public/
│   ├── profile.png                Profile photo (used in avatar)
│   ├── favicon.png                Original square favicon
│   └── favicon-round.png          Circular favicon (generated with sharp, used in metadata)
│
├── next.config.mjs                Minimal Next.js config (no custom options)
├── postcss.config.mjs             Enables @tailwindcss/postcss
├── jsconfig.json                  Path alias: @/* → ./*
└── CLAUDE.md                      This file
```

---

## Features built

### Theme system (`app/layout.js`, `app/components/ThemeToggle.js`, `app/globals.css`)
- **Default: dark mode** — all visitors start in dark mode unless they've previously switched to light.
- An inline `<script>` in `<head>` runs synchronously before first paint, reads `localStorage('theme')`, and adds `.dark` to `<html>` if the value is not `'light'`. This prevents any flash of the wrong theme.
- `<html>` has `suppressHydrationWarning` to suppress React's class-mismatch warning caused by this script.
- `ThemeToggle` is a fixed top-right circle button (z-50). It reads the current `.dark` class on mount and writes to `localStorage` on toggle.
- Tailwind dark mode is class-based via `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` — **not** `prefers-color-scheme`.

### Floating orbs background (`app/components/FloatingOrbs.js`)
- Server component — purely decorative, no interactivity.
- `fixed inset-0 z-[-1]` — sits below all page content. Page root divs are `bg-transparent` so the `body` background shows through and orbs are visible.
- **Two separate orb sets**: `dark:hidden` for light mode (soft lavender/pink/indigo, opacity 0.25–0.35), `hidden dark:block` for dark mode (rich violet/indigo/purple, opacity 0.12–0.18).
- Each orb uses `filter: blur(105px–130px)` and one of three keyframe animations (`orbFloat1`, `orbFloat2`, `orbFloat3`) with different durations (18–30s) and delays for organic, independent drift.
- Keyframes are defined in `globals.css` — ±40–60px movement, `orbFloat3` also scales (0.94–1.08).

### Intro animation (`app/components/IntroOverlay.js`)
- Plays once per browser session — tracked via `sessionStorage` key `introPlayed`.
- On return visits: `useEffect` reads `sessionStorage` immediately and sets phase to `done` (overlay never mounts visibly).
- Fullscreen dark glass overlay (`bg-zinc-950/80 backdrop-blur-md`) centred over the page.
- Text: *"Hey! Want a* ***glimpse*** *into* ***my work***?" — italic words styled `text-violet-400`.
- Responsive font: `text-2xl sm:text-4xl lg:text-5xl`.
- Total duration: exactly **4.5 seconds**.

  | Phase | What happens | Timing |
  |---|---|---|
  | `covered` | Overlay visible, transitions disabled | Initial state |
  | `enter` | Text fades + lifts in | starts at 50ms, 1.2s transition |
  | `fadeText` | Text fades out | starts at 2250ms, 1.2s transition |
  | `fadeOverlay` | Whole overlay fades out | starts at 3450ms, 0.8s transition |
  | `done` | Component returns null | at 4500ms |

- **No SSR output** — client-only, so no hydration mismatch is possible.

### Home page (`app/page.js`)
- Profile section: circular avatar (`profile.png`) with violet/indigo/sky gradient ring, name, role subtitle, bio, GitHub link button.
- Contact card (right of profile on large screens): "Let's Talk" heading, email link (`sanjay@creativelements.org`), LinkedIn link.
- "What I'm building" card: prose paragraph about work at creativelements.
- GitHub Activity section (see below).
- "See my projects" CTA: gradient pill button with animated arrow, glow ring on hover.
- Footer: "Updated March 2026 · creativelements".

### GitHub Activity section (`app/components/GitHubActivity.js`)
- Client component — fetches on mount from the GitHub REST API (public, no auth token).
- Endpoint: `https://api.github.com/users/sanjay-creativelements/repos?sort=updated&per_page=5`
- Shows 5 most-recently-updated repos: name (links to GitHub), description, language dot + colour, star count, relative time ("2h ago", "3 days ago", etc.).
- Loading state: animated skeleton (5 pulse rows).
- Error state: graceful "Unable to load activity." message.
- Language colours are defined in a `LANGUAGE_COLORS` map inside the component.

### Dynamic projects API (`app/api/projects/route.js`)
- **GET `/api/projects`** — returns `{ groups: [{ group, projects }] }`.

#### Card types
Each project card has a `type` field:
- `"repo"` with `isRepoSummary: false` — standalone repo with no subfolders (single card)
- `"repo"` with `isRepoSummary: true` — repo that has subfolders; shows a subtle "repo" badge on the card
- `"folder"` — a root-level subfolder inside a repo; links to the folder on GitHub

#### Data flow per repo
1. **GitHub fetch**: pulls all non-fork repos (`sort=updated&per_page=100`), filters `my-nextjs-app` and `personal-dashboard`. Cache: 1h.
2. **Subfolder detection** (`getRepoSubfolders`): fetches the shallow (non-recursive) root tree for the repo. Filters `type === "tree"` items whose `path` contains no `/` (root-level only). Tries `main` then `master`. Returns `[{ name, branch }]`.
3. **If no subfolders**: emits one standalone `type: "repo"` card with `isRepoSummary: false`.
4. **If subfolders exist**: emits one `type: "repo"` card with `isRepoSummary: true`, then one `type: "folder"` card per subfolder.
5. All cards from the same repo share the same `timeGroup` (based on repo `created_at`).

#### Slug format
- Repo cards: `slug = repoName`
- Folder cards: `slug = "${repoName}--${folderName}"` (double-dash separator)

#### AI descriptions
- **Repo-level** (`getRepoAIDescriptions` / `getCachedRepoAIDescriptions`): uses `getRepoContent` — recursive tree, README + up to 2 code files, ≤4000 chars. Cache key: `project-ai-descriptions-v7`.
- **Folder-level** (`getFolderAIDescriptions` / `getCachedFolderAIDescriptions`): uses `getFolderContent` — same recursive tree (HTTP-cached, no duplicate request), filters blobs by `path.startsWith(folderName + "/")`. Cache key: `project-folder-ai-descriptions-v1`.
- Both call `claude-haiku-4-5` asking for `{"short":"...","long":"..."}` JSON. Regex-extracts first `{...}` block to handle model preamble. Falls back to GitHub description (repo) or generic string (folder) on any failure.
- **API key check is OUTSIDE `unstable_cache`** in both wrapper functions — prevents caching fallback results when the key is missing.

#### GitHub link
- Repo card: `repo.html_url`
- Folder card: `https://github.com/{user}/{repo}/tree/{branch}/{folderName}`

#### Project object shape
`{ slug, title, description (≤100 chars, AI short), longDescription (50-80 words, AI long), tags ([language]), githubUrl, updatedAt (ISO), timeGroup, type ("repo"|"folder"), isRepoSummary (bool), repoName, folderName? }`

#### Time grouping
Uses `created_at`, UTC calendar-day arithmetic: 0–6 days → "This Week", 7–13 → "Last Week", 14–29 → "Last Month", 30+ → "Older". `GROUP_ORDER = ["This Week", "Last Week", "Last Month", "Older"]`.

#### Other
- Batch size: 5 repos processed with `Promise.all` per batch (avoids Vercel timeouts).
- All `catch` blocks log via `console.error` — never silent.
- Logging prefixes: `[projects:folders]`, `[projects:content]`, `[projects:folder-content]`, `[projects:ai]`.

### Project cards (`app/components/ProjectCard.js`)
- Two rendering modes controlled by the `onClick` prop:
  - **Link mode** (default): renders a `<Link>` to `/projects/[slug]`
  - **Button mode** (`onClick` provided): renders a `<button>`, used by ProjectsExplorer
- Props for animation (all default `true`, used only by ProjectsExplorer):
  - `contentVisible` — controls opacity of description + tags
  - `contentPresent` — controls maxHeight of description + tags (snaps instantly, never transitions)
  - `titleVisible` — controls opacity of the card title separately
- `updatedAt` prop (ISO string): shows "Updated today / yesterday / N days ago" at the bottom. Computed by `formatUpdatedAt()`.
- `isRepoSummary` prop (bool, default `false`): when `true`, shows a small "repo" badge (uppercase, zinc/border style) in the top-right of the card header, aligned with the title. The badge respects the `titleVisible` opacity animation.
- Hover: card lifts (`-translate-y-1`), violet border + violet glow box-shadow.

### Projects page split-panel (`app/components/ProjectsExplorer.js`)
- **Data source**: fetches `/api/projects` on mount. Shows `<LoadingSkeleton />` (5 pulsing cards) while loading, and an error message with "Try again" button on failure. `retryCount` state triggers a re-fetch when incremented.
- **Default state**: cards grouped by time (`created_at`) with section headers ("This Week", "Last Week", etc.), rendered as a `flex flex-wrap justify-center` 2-column grid with `cardReveal` stagger animation. `cardReveal` stagger index is global across all groups.
- **Click a card**: behaviour differs by screen size (see below).
- **Left sidebar**: pill buttons scoped to the same time group as the selected project (not all projects). Selected pill is violet. Clicking a different pill swaps the detail panel with a `fadeIn` animation. Hidden on mobile (`hidden md:flex`).
- **Right panel**: project title, `longDescription`, tags, GitHub button. Slides in with `slideInRight` on first open.
- **Back to grid** (desktop): "Back to grid" button in the sidebar collapses pills in reverse stagger, grid re-mounts with `cardReveal`.
- **Back button** (mobile): "← Back" button at the top of the detail panel (`md:hidden`) snaps instantly back to grid.

  #### Desktop (≥ 768px) — animated pill transition

  **Open:** `grid → hiding-content → forming-pills → detail`

  | Phase | What's animated | Timing |
  |---|---|---|
  | `hiding-content` | All card content + titles fade to opacity 0 | 300ms |
  | `forming-pills` | Layout snaps to sidebar, pills grow in (staggered, `pillGrow`) | 300ms |
  | `detail` | Detail panel slides in from right | CSS animation |

  **Close:** `detail → hiding-detail → shrinking-pills → grid`

  | Phase | What's animated | Timing |
  |---|---|---|
  | `hiding-detail` | Detail panel fades to opacity 0 | 300ms |
  | `shrinking-pills` | Pills shrink in reverse stagger (`pillShrink`) | 300ms |
  | `grid` | Cards re-mount with `cardReveal` stagger | CSS animation |

  #### Mobile (< 768px) — instant swap, no pill animation

  **Open:** `grid → detail` (instant, no intermediate phases)
  **Close:** `detail → grid` (instant)

  The sidebar nav is CSS-hidden on mobile. `isMobile` is tracked via `matchMedia("(max-width: 767px)")` inside `useEffect` with a resize listener, so handlers know to skip the pill phases entirely.

  **Critical invariant:** `maxHeight` on cards always snaps instantly (no CSS transition). It only changes while opacity is already 0 so the snap is invisible and text never reflows.

### Individual project pages (`app/projects/[slug]/page.js`)
- Statically generated at build time via `generateStaticParams()`.
- `params` is awaited — required in Next.js 15+ (`async` function, `await params`).
- Shows: title, `longDescription`, tags, GitHub button ("Click to see my work :)"), back arrow to dashboard.
- 404 via `notFound()` for unknown slugs.
- `generateMetadata` also awaits `params` and returns per-project `<title>`.

### Favicon (`app/favicon.png`, `public/favicon-round.png`)
- The favicon is a circular crop of `public/favicon.png`, generated once with `sharp` (200×200, SVG circle mask, `dest-in` blend).
- The round PNG is saved as `public/favicon-round.png`.
- `app/favicon.png` is a copy of the round version — Next.js App Router auto-detects and serves any `favicon.*` in the `app/` directory.
- `metadata.icons` in `layout.js` explicitly declares both `icon` and `apple` pointing to `/favicon-round.png`.
- `app/favicon.ico` has been deleted — if it existed it would take priority over everything else.

---

## Color theme

All accent colors derive from the violet/indigo/sky palette. **Never introduce a new accent color.**

| Token | Value | Used for |
|---|---|---|
| `from-violet-500 via-indigo-500 to-sky-500` | gradient | Top accent bar (all pages) |
| `from-violet-500 via-indigo-500 to-sky-500` | gradient | Avatar ring |
| `from-violet-600 to-indigo-600` | gradient | CTA button background |
| `violet-400` / `violet-500` | solid | Card hover border (dark / light), section labels, sidebar selected ring |
| `indigo-600` / `indigo-400` | solid | Role subtitle text (light / dark) |
| `violet-500` / `violet-400` | solid | Section heading labels |
| `violet-950/80` | semi-transparent | Intro overlay background |
| `zinc-950/80` | solid | Intro overlay dark glass layer |

---

## Conventions

### Tailwind-only styling
All styling uses Tailwind utility classes. Do not add custom CSS classes except for `@keyframes` in `globals.css` (Tailwind can't express these). Inline `style` props are acceptable only for values that change at runtime (animation phases, dynamic widths).

### Text alignment
All paragraph/body text uses `text-justify`. Apply this to every `<p>` that contains prose content — bio, "What I'm building", card descriptions, project detail descriptions. Do not apply it to labels, headings, tags, or UI chrome.

### Dark mode
Use `dark:` Tailwind variants — not media queries. The variant is class-based via `@custom-variant dark (&:where(.dark, .dark *))`. Any new component that needs dark styles must use `dark:` prefixed classes.

### App Router structure
- Pages in `app/` are **server components by default**. Add `"use client"` only when you need `useState`, `useEffect`, browser APIs, or event handlers.
- `metadata` exports belong in server components. If a page needs both metadata and client state, keep the server component as a thin shell and extract interactivity to a component in `app/components/`.
- Dynamic route `params` must be **awaited** — they are Promises in Next.js 15+.

### Animation approach
- Sequential animations use `setTimeout` chains tracked in a `useRef` array. Always clear all timers on unmount and before re-triggering (`clearTimers()` pattern in ProjectsExplorer).
- CSS `transition` and `animation` do the actual interpolation. JS only sets state at the right moments.
- Never animate `height` directly. Use `maxHeight` snap (instant, invisible, no CSS transition declared) + `opacity` transition instead.
- All `@keyframes` live in `globals.css`: `slideInRight`, `fadeIn`, `pillGrow`, `pillShrink`, `cardReveal`, `orbFloat1`, `orbFloat2`, `orbFloat3`.

### Project data
The `/projects` page now sources data **dynamically** from `/api/projects` (GitHub + AI). `lib/projects.js` is still used by `/projects/[slug]` for static generation at build time. These two data sources are independent — if you add a project to `lib/projects.js`, it won't automatically appear on the dynamic `/projects` listing (it will appear via the GitHub API instead).

Dynamic project objects have this shape: `{ slug, title, description (≤100 chars, AI short), longDescription (50-80 words, AI long), tags ([language]), githubUrl, updatedAt (ISO), timeGroup }`.

Static project objects in `lib/projects.js` require: `slug`, `title`, `description`, `longDescription`, `tags`, `githubUrl`.

### Path aliases
Use `@/` for all internal imports (e.g. `@/lib/projects`, `@/app/components/ProjectCard`). Relative imports are not used.

### Page backgrounds
Every page root div uses `min-h-screen font-sans` with **no background color class**. The `body` CSS variable background (`--background`) shows through, and `FloatingOrbs` (at `z-[-1]`) is visible between the body color and page content. Do not add `bg-white`, `bg-zinc-50`, or any solid background to page root divs — it will hide the orbs.

---

## Known quirks and things to be careful about

### Dark mode default + hydration
The inline `<script>` in `layout.js` applies `.dark` to `<html>` synchronously before React hydrates. This means the `className` on `<html>` differs between the server render (no class) and the first client render (has `.dark`). `suppressHydrationWarning` on `<html>` suppresses React's warning about this. **Do not remove `suppressHydrationWarning`.**

The current inline script: apply `.dark` unless `localStorage.getItem('theme') === 'light'`. This means dark is the default for all new visitors regardless of system preference.

### `app/favicon.ico` must stay deleted
If `app/favicon.ico` is ever recreated, Next.js will serve it as the favicon and completely ignore the `metadata.icons` setting and `app/favicon.png`. Keep it deleted.

### `params` must be awaited in Next.js 15+
In `app/projects/[slug]/page.js`, both `generateMetadata` and the default export are `async` and `await params` before destructuring `slug`. Follow this pattern for any new dynamic routes.

### Tailwind v4 — no `tailwind.config.js`
Tailwind v4 is configured via `postcss.config.mjs` and the `@import "tailwindcss"` directive in `globals.css`. There is no `tailwind.config.js` — that's intentional. Arbitrary values (`w-[calc(50%-0.625rem)]`, `shadow-[...]`, `opacity-[0.18]`) work without any config.

### Card grid centering (odd last card)
The project grid uses `flex flex-wrap justify-center` with each card at `w-full sm:w-[calc(50%-0.625rem)]`. This automatically centres the lone last card when the total count is odd. If you change the layout to CSS `grid-cols-2`, you lose this behaviour and must handle it manually.

### `contentVisible` / `contentPresent` / `titleVisible` props on ProjectCard
These props exist specifically for ProjectsExplorer's animation. When `ProjectCard` is used elsewhere (e.g. `[slug]` page), all three default to `true` and have no visible effect. Do not remove them.

### ProjectsExplorer phase guards
`handleCardClick` is guarded with `if (phase !== 'grid') return` and `handleClose` with `if (phase !== 'detail') return`. These prevent mid-animation double-clicks from corrupting the state machine. Do not remove them.

### `sessionStorage` and SSR
`sessionStorage` is browser-only. All reads/writes must happen inside `useEffect`, never at module or render scope.

### GitHub API rate limiting
`GitHubActivity` fetches from the unauthenticated GitHub API. The limit is 60 requests/hour per IP. In development with hot-reloading this can be hit quickly. If you see the "Unable to load activity." error message, wait a minute or add a `GITHUB_TOKEN` environment variable and pass it as a header (not currently implemented).

### `QuoteFooter.js` is unused
`app/components/QuoteFooter.js` exists in the repo but is not imported or rendered anywhere. It was built then removed. Leave it as-is or delete it — it has no effect on the site.

### GitHub tree API — never use `?recursive=false`
The GitHub Git Trees API treats any non-empty string value for `recursive` as truthy, so `?recursive=false` actually triggers full recursive expansion (same as `?recursive=1`). `getRepoSubfolders` intentionally omits the `recursive` query parameter entirely (omitting it = non-recursive, root-only). Additionally, even if the API returns nested items unexpectedly, `getRepoSubfolders` filters items to only those whose `path` contains no `/`, guaranteeing root-level folders only.

### `unstable_cache` and missing API keys
If `ANTHROPIC_API_KEY` is absent when `/api/projects` first runs, the fallback (GitHub description) must NOT be cached — otherwise it gets served for 24h even after the key is added. The API key check lives in the `getAIDescriptions` wrapper outside `unstable_cache`. Never move that check inside `getCachedAIDescriptions`.

If you ever need to bust the AI description cache (e.g. after fixing a prompt or changing the model), increment the cache key version string in `getCachedAIDescriptions`: `["project-ai-descriptions-v6"]` → `v7`, etc.

### `created_at` vs `updated_at` in `/api/projects`
Time grouping uses `created_at` — when the repo was first created. The `updatedAt` field on each project object is `repo.updated_at` (last push), used only for the "Updated X days ago" label on cards. Do not conflate these two fields.

### GitHub API rate limiting in `/api/projects`
`/api/projects` makes several GitHub API calls per repo (tree + file contents). The route uses `next: { revalidate }` on each `fetch`, so repeated requests within the revalidation window are served from Next.js's fetch cache and don't hit GitHub. In development with `npm run dev`, the fetch cache may not persist between restarts. If you see 403/rate-limit errors in the server logs, wait 60 seconds or add a `GITHUB_TOKEN` header to `GITHUB_HEADERS` (not currently implemented).
