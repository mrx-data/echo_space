# Echo Space

Echo Space is a small personal website built with Next.js App Router, TypeScript, Tailwind CSS v4, lucide-react, and a Supabase-backed article CMS. Public copy is Chinese. The current visual system is an editorial personal-portfolio style: cream canvas, olive accents, thin warm-gray lines, soft card shadows, rounded 10px cards, Cormorant Garamond display type, and Inter body type.

## Routes

- `/` — homepage with the main brand signal, backend-managed category links, curated work entry points, featured article entry, and contact links.
- `/articles` — article list page showing all published articles with an editorial card grid. `/articles?tag={category}` filters by category.
- `/studio` — redirects to the admin article list.
- `/studio/login` — admin login with email + password (magic link fallback).
- `/studio/articles` — admin article list, including drafts, published, and archived records, with category filtering and title search. `/studio/articles?tag={category}&q={title}` combines both filters. Each row has an edit link and a permanent delete button with confirmation.
- `/studio/articles/new` — draft editor with collapsible live preview.
- `/studio/articles/[id]` — edit, publish, unpublish, archive, or permanently delete an article.
- `/studio/categories` — admin category manager used by article category multi-selects.
- `/studio/auth/callback` — magic-link callback page that stores Supabase tokens in HttpOnly cookies.
- `/editor` — compatibility redirect to `/studio/articles/new`.
- `/content/[slug]` — published article detail page resolved from Supabase by slug.
- `/content/echo-space` — legacy URL that redirects to the current featured article.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4 via `@tailwindcss/postcss`
- CSS variables for Cormorant Garamond display type and Inter body type
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
  api/admin/categories/
  api/admin/upload/route.ts
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
  migrations/
public/
  covers/
  images/
  icon.svg
docs/
  architecture.md
  runbook.md
```

## Environment Variables

Create these variables locally in `.env.local` and in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`

Restart `npm run dev` after changing `.env.local`; Next.js reads these values when the dev server starts.

## Supabase Setup

1. Open the Supabase SQL editor for the project.
2. Run `supabase/schema.sql` to create the `articles` and `categories` tables plus `updated_at` triggers.
3. Add the four environment variables above to `.env.local`.
4. Run `npm run seed:articles` once to import fixture articles and upsert their tags as categories.
5. Confirm `/articles` and `/content/{slug}` load published rows from Supabase.

Existing environments that already have older article schemas may also need the migration files in `supabase/migrations/`, for example `002_add_font_columns.sql` for `font_family` and `font_size`.

## Deploying To Vercel

Connect the GitHub repository to a Vercel project, then add the same environment variables in Vercel before redeploying. Code deploys update the Next.js app only; article data is stored durably in Supabase, so a Vercel deployment does not erase drafts or published articles.

After deployment, the configured admin can continue creating and publishing articles through `/studio`. Other visitors can only read published content through public pages.

The public header currently links to 首页, 文章, 关于, and a mail CTA. Studio routes remain accessible directly and require admin login through `/studio/login`.

## Editing Content

Open `/studio/login`, sign in with the configured `ADMIN_EMAIL` and password, then create categories in `/studio/categories` before using `/studio/articles/new` or `/studio/articles/[id]`. The editor saves drafts through `/api/admin/articles/*`; publishing updates Supabase and invalidates tagged Next.js caches.

Magic link login is also available as a fallback option on the login page.

`lib/content.ts` is kept as a migration fixture and type source. It is not mutated at runtime. Public reads come from Supabase when env vars are configured and fall back to the fixture only for local build safety when env vars are missing.

The Studio editor supports both structured section editing and Markdown body editing. Cover images can be selected from `public/covers/cover-*.svg` or uploaded through `POST /api/admin/upload`, which stores image files under `public/uploads/` and writes the returned URL to `articles.cover_image`.

Each article contains:

- slug
- title
- date
- readingTime
- tags (backend-managed category names stored in `articles.tags`)
- excerpt
- highlight
- source metadata
- contentMd / `content_md` for Markdown-mode articles
- coverImage / `cover_image`
- fontFamily / `font_family` (`sans`, `serif`, `mono`)
- fontSize / `font_size` (`sm`, `base`, `lg`)
- sections and callouts

Article routes are resolved by slug from Supabase through `app/content/[slug]/page.tsx`. `/articles` lists published articles only, and `/articles?tag={category}` filters to published articles containing that category. The homepage and header link to the latest published article when one exists.

## Design Notes

Core design tokens are centralized in `app/globals.css`:

- `--canvas: #fbfaf7`
- `--surface: #ffffff`
- `--surface-warm: #f7f5f0`
- `--ink: #171713`
- `--muted: #64645c`
- `--faint: #9a988f`
- `--line: #e8e4db`
- `--olive: #596044`
- `--olive-dark: #485035`
- `--font-display: "Cormorant Garamond", Georgia, serif`
- `--font-body: "Inter", "Avenir Next", "Helvetica Neue", Arial, sans-serif`

Reusable primitives live in `components/`. Prefer extending these components before adding one-off Tailwind blocks.

## Known Development Note

`npm run dev` uses `next dev --webpack`. `app/globals.css` imports Cormorant Garamond and Inter from Google Fonts with CSS `@import`; the project does not use `next/font/google`.
