# Personal Dashboard — CLAUDE.md

## What this project is

A personal dashboard / portfolio site built for Sanjay Waugh (Junior Builder at Creative Elements). It shows a profile, a short bio, a "what I'm building" section, and a portfolio of projects built during Week 1. It is a single Next.js application deployed as a static-friendly site.

The intended audience is anyone who wants to see Sanjay's work — it is a real public-facing site, not a demo or exercise project.

---

## How to run locally

```bash
npm install
npm run dev        # starts at http://localhost:3000
npm run build      # production build
npm run start      # serves the production build
npm run lint       # ESLint
```

Node.js ≥ 18 required. No environment variables needed — all data is static.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS v4 (PostCSS plugin, no config file) |
| Data | Static JS array in `lib/projects.js` |
| Deployment target | Vercel (no changes needed) |

---

## File structure

```
/
├── app/
│   ├── layout.js                  Root layout — loads Geist fonts, sets metadata
│   ├── globals.css                Tailwind import, CSS variables, custom keyframes
│   ├── page.js                    Home page — profile, bio, "what I'm building", CTA button
│   │
│   ├── projects/
│   │   ├── page.js                /projects listing — server shell + <ProjectsExplorer />
│   │   └── [slug]/
│   │       └── page.js            /projects/[slug] — static individual project pages
│   │
│   └── components/
│       ├── IntroOverlay.js        Fullscreen intro animation (client component)
│       ├── ProjectCard.js         Reusable card — link mode or button mode
│       └── ProjectsExplorer.js    Split-panel explorer on /projects (client component)
│
├── lib/
│   └── projects.js                Single source of truth for all project data
│
├── public/                        Static assets (favicons, SVGs)
├── next.config.mjs                Minimal Next.js config (no custom options)
├── postcss.config.mjs             Enables @tailwindcss/postcss
├── jsconfig.json                  Path alias: @/* → ./*
└── CLAUDE.md                      This file
```

---

## Features built

### Intro animation (`app/components/IntroOverlay.js`)
- Plays once per browser session (tracked via `sessionStorage` key `introPlayed`)
- Shows a fullscreen dark glass-morphism overlay with centred text: *"Hey! Here's the scoop on me."*
- Total duration: exactly **4.5 seconds**
- Six-phase sequence driven by `useState` + `setTimeout`:

  | Phase | What happens | Duration |
  |---|---|---|
  | `covered` | Overlay visible, text invisible, transitions disabled | 50ms |
  | `enter` | Text fades in | 1.2s transition |
  | `fadeText` | Text fades out | 1.2s transition |
  | `fadeOverlay` | Whole overlay fades out | 0.8s transition |
  | `done` | Component unmounts | — |

- **No SSR output** — the component is client-only, so no hydration mismatch is possible
- On return visits: `useEffect` reads `sessionStorage`, sets phase to `done` immediately (overlay never visible)

### Project cards (`app/components/ProjectCard.js`)
- Two rendering modes controlled by the `onClick` prop:
  - **Link mode** (default): renders a `<Link>` to `/projects/[slug]`
  - **Button mode** (`onClick` provided): renders a `<button>`, used by ProjectsExplorer
- `contentVisible` prop (bool, default `true`) — controls description + tags opacity
- `contentPresent` prop (bool, default `true`) — controls description + tags max-height
- Both content props are used by ProjectsExplorer to animate content out before layout changes
- Hover effect: card lifts (`-translate-y-1`), violet border appears, violet glow box-shadow

### Projects page split-panel (`app/components/ProjectsExplorer.js`)
- **Default state**: 5 project cards in a responsive 2-column flex-wrap grid. Lone last card (odd count) is centred automatically.
- **Click a card**: sequential animation opens a split view
- **Left panel** narrows from 100% → 220px and becomes a sidebar title list
- **Right panel** slides in with the full project detail (long description, tags, GitHub button)
- Clicking a different title in the sidebar swaps the right panel (with a fresh slide-in animation via `key={selectedSlug}`)
- **Back to grid** reverses the animation in sequence

#### Phase state machine (open sequence)
```
grid → hiding → sliding → detail
```
| Phase | What's animated | Duration |
|---|---|---|
| `hiding` | Description + tags fade out (opacity 1→0) | 0.3s |
| `sliding` | Height collapses (instant, invisible), panel slides left | 0.65s |
| `detail` | Sidebar fades in, detail panel slides in from right | CSS animations |

#### Phase state machine (close sequence)
```
detail → hiding-detail → expanding → showing-content → grid
```
| Phase | What's animated | Duration |
|---|---|---|
| `hiding-detail` | Detail panel fades out | 0.3s |
| `expanding` | Panel slides right, cards replace sidebar | 0.65s |
| `showing-content` | Height restores (instant), content fades in | 0.3s |

**Critical invariant:** `maxHeight` always snaps instantly (no CSS transition on it). It only changes while `opacity` is already 0, so the snap is invisible and text never visibly reflows.

### Individual project pages (`app/projects/[slug]/page.js`)
- Statically generated at build time via `generateStaticParams()`
- `params` is awaited (`async` function) — required in Next.js 15+
- Shows: project title, `longDescription`, tags, "Click to see my work :)" GitHub button, back arrow
- 404 via `notFound()` for unknown slugs

### Home page (`app/page.js`)
- Profile: avatar (initials "SW"), name, role badge, short bio, GitHub link button
- "What I'm building" section: prose paragraph describing the work at Creative Elements
- "See my projects" CTA button: gradient pill with arrow icon, glow + scale hover effect

---

## Color theme

All accent colors derive from the same violet/indigo/sky palette. Never introduce a new accent color — extend this set only.

| Token | Value | Used for |
|---|---|---|
| `from-violet-500 via-indigo-500 to-sky-500` | gradient | Top accent bar, avatar gradient |
| `from-violet-500 to-indigo-600` | gradient | SW avatar background |
| `from-violet-600 to-indigo-600` | gradient | CTA button background |
| `violet-400` / `violet-500` | solid | Card hover border (light / dark) |
| `indigo-600` / `indigo-400` | solid | Role subtitle text (light / dark) |
| `violet-500` / `violet-400` | solid | Section label text |
| `violet-950/80` | semi-transparent | Intro overlay background |

---

## Conventions

### Tailwind-only styling
All styling uses Tailwind utility classes. **Do not add custom CSS classes** except for `@keyframes` in `globals.css` (which Tailwind can't express). Inline `style` props are acceptable only for values that change at runtime (animation phases, dynamic widths).

### App Router structure
- Pages in `app/` are **server components by default**. Add `"use client"` only when you need `useState`, `useEffect`, browser APIs, or event handlers.
- `metadata` exports belong in server components. If a page needs both metadata and client-side state, keep the server component as a thin shell and extract the interactive part to a `app/components/*.js` client component.
- Dynamic route params (`params`) must be **awaited** — they are Promises in Next.js 15+.

### Animation approach
- Sequential animations use `setTimeout` chains managed in a `useRef` array. Always clear timers on unmount and when re-triggering.
- CSS `transition` and `animation` handle the actual interpolation. JavaScript only changes state at the right moments.
- Never animate `height` directly (janky, requires explicit values). Use `maxHeight` snap (instant, invisible) + `opacity` transition instead.
- `@keyframes` lives in `globals.css`. Currently defined: `slideInRight`, `fadeIn`.

### Project data
All project content lives in **`lib/projects.js`** as a plain exported array. Both the `/projects` listing and the `/projects/[slug]` pages import from here — never duplicate data. Each project needs: `slug`, `title`, `description` (short, for cards), `longDescription` (50+ words, for detail view), `tags`, `githubUrl`.

### Path aliases
Use `@/` for all internal imports (e.g. `@/lib/projects`, `@/app/components/ProjectCard`). Relative imports are not used.

---

## Known quirks and things to be careful about

### Intro overlay + hydration
The `IntroOverlay` component is **client-only** (no SSR output). This is intentional. A previous version used an inline `<script>` in `layout.js` to add a class to `<html>` before first paint, which caused a hydration mismatch (`className` on the `<html>` element differed between server and client). The current approach avoids this entirely — the overlay is not rendered server-side, so there is nothing for the hydration differ to compare. Do not re-introduce any `<html>` class manipulation.

### `params` must be awaited in Next.js 15+
In `app/projects/[slug]/page.js`, both `generateMetadata` and the default export are `async` functions that `await params` before destructuring `slug`. If you add new dynamic routes, follow the same pattern or you'll get a runtime error.

### Tailwind v4 — no `tailwind.config.js`
This project uses Tailwind CSS v4, which is configured via `postcss.config.mjs` and the `@import "tailwindcss"` directive in `globals.css`. There is no `tailwind.config.js` file — that's intentional. Arbitrary values like `w-[calc(50%-0.625rem)]` and `shadow-[...]` work without any config changes.

### Card grid centering (odd last card)
The project grid uses `flex flex-wrap justify-center` with each card at `w-full sm:w-[calc(50%-0.625rem)]`. This automatically centres the last card when the total count is odd. If you change the layout to CSS grid (`grid-cols-2`), you will lose this behaviour and need to handle the odd-card case manually.

### `contentVisible` / `contentPresent` props on ProjectCard
These two props exist specifically to support the ProjectsExplorer animation. When `ProjectCard` is used outside the explorer (e.g. on the `/projects/[slug]` page or any future listing), both default to `true` and have no effect. Do not remove them — the explorer depends on them.

### ProjectsExplorer phase guards
`handleCardClick` is guarded with `if (phase !== 'grid') return` and `handleClose` with `if (phase !== 'detail') return`. This prevents mid-animation double-clicks from corrupting the state machine. Do not remove these guards.

### sessionStorage and SSR
`sessionStorage` is only available in the browser. Both `IntroOverlay` and any code that reads `introPlayed` must do so inside `useEffect` (or an equivalent client-only context), never at module or render scope.
