# Echo Space

Echo Space is a small personal website built with Next.js App Router, TypeScript, Tailwind CSS v4, and lucide-react. The first version uses Chinese narrative copy and a loud Neo-brutalist visual system: cream paper background, pure black borders, hard offset shadows, saturated red/yellow/violet blocks, sticker-like rotations, and heavy typography.

## Routes

- `/` — homepage with the main brand signal, site positioning, topic tags, and featured article entry.
- `/articles` — article list page showing all published articles with Neo-brutalist card grid.
- `/editor` — article editor with live preview. Fill in metadata, sections, and save to persist.
- `/content/horizontal-vertical-ai-research` — article detail page for `横纵分析法：把 AI 深度研究融入个人知识工作流`.
- `/content/echo-space` — legacy article URL that renders the current featured article.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4 via `@tailwindcss/postcss`
- `next/font/google` with Space Grotesk
- `lucide-react` icons

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  articles/page.tsx
  editor/page.tsx
  api/articles/route.ts
  content/[slug]/page.tsx
  content/echo-space/page.tsx
  globals.css
components/
  article-list.tsx
  article-page.tsx
  article-preview.tsx
  marquee-strip.tsx
  neo-button.tsx
  neo-card.tsx
  site-footer.tsx
  site-header.tsx
  sticker-badge.tsx
lib/
  content.ts
  utils.ts
public/
  icon.svg
docs/
  architecture.md
  runbook.md
```

## Editing Content

### Via the Editor (recommended)

Open `/editor` in the browser. Fill in the article form (title, slug, tags, excerpt, highlight, sections), then click "保存文章". The article is appended to `lib/content.ts` via the `POST /api/articles` API route. After saving, restart the dev server or rebuild to see the new article at `/content/{slug}`.

### Manual editing

Articles and topic metadata live in `lib/content.ts`.

The `articles` array holds all published articles. Each entry contains:

- slug
- title
- date
- readingTime
- tags
- excerpt
- highlight
- source metadata
- sections and callouts

To add a new article, push a new object into the `articles` array. The first item is automatically used as the featured article on the homepage (via `featuredArticle` alias). `getArticleBySlug(slug)` looks up any article by its slug.

Article routes are generated from the `articles` array through `app/content/[slug]/page.tsx`. The `/articles` page lists all articles. The homepage, header, and footer link to `/articles`.

## Design Notes

Core design tokens are centralized in `app/globals.css`:

- `--neo-bg: #FFFDF5`
- `--neo-ink: #000000`
- `--neo-accent: #FF6B6B`
- `--neo-secondary: #FFD93D`
- `--neo-muted: #C4B5FD`

Reusable primitives live in `components/`. Prefer extending these components before adding one-off Tailwind blocks.

## Known Development Note

`npm run dev` uses `next dev --webpack`. On 2026-05-02, local verification showed Next 16 Turbopack dev mode could fail to resolve the internal `next/font/google` font module for Space Grotesk in this workspace. Production `npm run build` succeeds with Turbopack.
