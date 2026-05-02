# Echo Space

Echo Space is a small personal website built with Next.js App Router, TypeScript, Tailwind CSS v4, lucide-react, and a Supabase-backed article CMS. Public copy is Chinese and the visual system stays loud Neo-brutalist: cream paper background, pure black borders, hard offset shadows, saturated red/yellow/violet blocks, sticker-like rotations, and heavy typography.

## Routes

- `/` — homepage with the main brand signal, site positioning, topic tags, and featured article entry.
- `/articles` — article list page showing all published articles with Neo-brutalist card grid.
- `/studio` — redirects to the admin article list.
- `/studio/login` — Supabase magic link login for the configured admin email.
- `/studio/articles` — admin article list, including drafts, published, and archived records.
- `/studio/articles/new` — draft editor with live preview.
- `/studio/articles/[id]` — edit, publish, unpublish, or archive an article.
- `/editor` — compatibility redirect to `/studio/articles/new`.
- `/content/horizontal-vertical-ai-research` — article detail page for `横纵分析法：把 AI 深度研究融入个人知识工作流`.
- `/content/echo-space` — legacy URL that redirects to the current featured article.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4 via `@tailwindcss/postcss`
- CSS font stack preferring Space Grotesk
- `lucide-react` icons
- Supabase Postgres and Auth through server-side REST/Auth calls

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

Seed current file-based articles into Supabase after creating the table:

```bash
npm run seed:articles
```

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  articles/page.tsx
  editor/page.tsx
  studio/
  api/admin/articles/
  api/auth/
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
  studio/
lib/
  articles-db.ts
  auth.ts
  content.ts
  supabase.ts
  utils.ts
scripts/
  seed-supabase-articles.mjs
supabase/
  schema.sql
public/
  icon.svg
docs/
  architecture.md
  runbook.md
```

## Environment Variables

Create the variables from `.env.example` locally and in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`

## Editing Content

Open `/studio/login`, sign in with the configured `ADMIN_EMAIL`, then use `/studio/articles/new` or `/studio/articles/[id]`. The editor saves drafts through `/api/admin/articles/*`; publishing updates Supabase and invalidates tagged Next.js caches.

`lib/content.ts` is kept as a migration fixture and type source. It is not mutated at runtime. Public reads come from Supabase when env vars are configured and fall back to the fixture only for local build safety before cutover.

Each article contains:

- slug
- title
- date
- readingTime
- tags
- excerpt
- highlight
- source metadata
- sections and callouts

Article routes are resolved by slug from Supabase through `app/content/[slug]/page.tsx`. `/articles` lists published articles only. The homepage and header link to the latest published article when one exists.

## Design Notes

Core design tokens are centralized in `app/globals.css`:

- `--neo-bg: #FFFDF5`
- `--neo-ink: #000000`
- `--neo-accent: #FF6B6B`
- `--neo-secondary: #FFD93D`
- `--neo-muted: #C4B5FD`

Reusable primitives live in `components/`. Prefer extending these components before adding one-off Tailwind blocks.

## Known Development Note

`npm run dev` uses `next dev --webpack`. The app uses a CSS font stack preferring Space Grotesk instead of `next/font/google`, so local builds do not require a live Google Fonts request.
