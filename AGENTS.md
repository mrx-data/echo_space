# Echo Space Agent Notes

## Project Snapshot

Echo Space is a small personal website in `/Users/echo/Documents/echo_space`.

- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, lucide-react.
- Pages: `/`, `/articles`, `/editor`, `/content/[slug]`, `/content/echo-space`.
- API: `POST /api/articles` — saves a new article to `lib/content.ts`.
- Content source: `lib/content.ts` — exports `articles` array, `featuredArticle` alias, `getArticleBySlug()`, and `topicTags`.
- Design system: Neo-brutalism with hard black borders, hard offset shadows, cream canvas, red/yellow/violet accents, sticker rotations, and Space Grotesk.

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`

Use `npm run dev`, not raw `next dev`, because the script pins dev mode to webpack.

## Important Implementation Details

- `package.json` sets `dev` to `next dev --webpack`.
- `next.config.ts` sets `turbopack.root` to `__dirname` so Next does not infer `/Users/echo` as the workspace root because of an upper-level lockfile.
- `app/layout.tsx` uses `next/font/google` for Space Grotesk and declares `/icon.svg`.
- `app/globals.css` owns design tokens, texture utilities, custom animations, text outline styling, and reduced-motion behavior.
- `app/editor/page.tsx` is a `"use client"` component (interactive form with state).
- All other components under `components/` are Server Components unless interactivity requires a client component.
- `app/api/articles/route.ts` reads/writes `lib/content.ts` directly via Node.js `fs`.

## Editing Guidelines

- Keep public copy in Chinese unless the user asks otherwise.
- Keep the first viewport brand-forward: "Echo Space" must remain visually dominant on the homepage.
- Prefer existing primitives (`NeoButton`, `NeoCard`, `StickerBadge`, `MarqueeStrip`, `SiteHeader`, `SiteFooter`) over one-off UI.
- Preserve the Neo-brutalist constraints: no gray palettes, no soft shadows, no blur effects, no mid-radius rounded cards, and no gradient hero.
- When adding pages, update `README.md`, `docs/architecture.md`, and `docs/runbook.md`.

## Verified State

On 2026-05-02:

- `npm run lint` passed.
- `npm run build` passed.
- Routes verified: `/`, `/articles`, `/editor`, `/content/horizontal-vertical-ai-research`, `/content/echo-space`, `/api/articles`.
