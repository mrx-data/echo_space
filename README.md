# Echo Space

Echo Space is a small personal website built with Next.js App Router, TypeScript, Tailwind CSS v4, lucide-react, and a Supabase-backed article CMS. Public copy is Chinese and the visual system stays loud Neo-brutalist: cream paper background, pure black borders, hard offset shadows, saturated red/yellow/violet blocks, sticker-like rotations, and heavy typography.

## Routes

- `/` — homepage with the main brand signal, site positioning, topic tags, and featured article entry.
- `/articles` — article list page showing all published articles with Neo-brutalist card grid.
- `/studio` — redirects to the admin article list.
- `/studio/login` — admin login with email + password (magic link fallback).
- `/studio/articles` — admin article list, including drafts, published, and archived records. Each row has an edit link and a permanent delete button with confirmation.
- `/studio/articles/new` — draft editor with collapsible live preview.
- `/studio/articles/[id]` — edit, publish, unpublish, archive, or permanently delete an article.
- `/editor` — compatibility redirect to `/studio/articles/new`.
- `/content/[slug]` — published article detail page resolved from Supabase by slug.
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

Restart `npm run dev` after changing `.env.local`; Next.js reads these values when the dev server starts.

## Supabase Setup

1. Open the Supabase SQL editor for the project.
2. Run `supabase/schema.sql` to create the `articles` table and `updated_at` trigger.
3. Add the four environment variables above to `.env.local`.
4. Run `npm run seed:articles` once to import fixture articles from `lib/content.ts`.
5. Confirm `/articles` and `/content/{slug}` load published rows from Supabase.

## Deploying To Vercel

Connect the GitHub repository to a Vercel project, then add the same environment variables in Vercel before redeploying. Code deploys update the Next.js app only; article data is stored durably in Supabase, so a Vercel deployment does not erase drafts or published articles.

After deployment, the configured admin can continue creating and publishing articles through `/studio`. Other visitors can only read published content through public pages.

## Editing Content

Open `/studio/login`, sign in with the configured `ADMIN_EMAIL` and password, then use `/studio/articles/new` or `/studio/articles/[id]`. The editor saves drafts through `/api/admin/articles/*`; publishing updates Supabase and invalidates tagged Next.js caches.

Magic link login is also available as a fallback option on the login page.

`lib/content.ts` is kept as a migration fixture and type source. It is not mutated at runtime. Public reads come from Supabase when env vars are configured and fall back to the fixture only for local build safety when env vars are missing.

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
