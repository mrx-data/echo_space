# Echo Space Agent Notes

## Project Snapshot

Echo Space is a small personal website in `/Users/echo/Documents/echo_space`.

- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, lucide-react, Supabase Postgres/Auth.
- Public routes: `/`, `/articles`, `/content/[slug]`, `/content/echo-space`.
- Admin routes: `/studio`, `/studio/login`, `/studio/articles`, `/studio/articles/new`, `/studio/articles/[id]`.
- Compatibility routes: `/editor` redirects to `/studio/articles/new`; `/api/articles` returns 410 and no longer writes files.
- Admin APIs: `/api/admin/articles`, `/api/admin/articles/[id]`, `/api/admin/articles/[id]/publish`, `/api/admin/articles/[id]/unpublish`.
- Auth APIs: `/api/auth/login`, `/api/auth/magic-link`, `/api/auth/session`, `/api/auth/logout`.
- Runtime content source: Supabase `articles` table. `lib/content.ts` remains only for types, fixtures, `topicTags`, and local fallback when env vars are missing.
- Design system: Neo-brutalism with hard black borders, hard offset shadows, cream canvas, red/yellow/violet accents, sticker rotations, and a CSS font stack preferring Space Grotesk.

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Seed articles: `npm run seed:articles`

Use `npm run dev`, not raw `next dev`, because the script pins dev mode to webpack.

## Environment Variables

Configure these locally in `.env.local` and in Vercel. Never commit real secret values.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`

## Important Implementation Details

- `package.json` sets `dev` to `next dev --webpack`.
- `next.config.ts` sets `turbopack.root` to `__dirname` so Next does not infer `/Users/echo` as the workspace root because of an upper-level lockfile.
- `app/layout.tsx` declares `/icon.svg`; fonts are handled through the CSS font stack in `app/globals.css`.
- `app/globals.css` owns design tokens, texture utilities, custom animations, text outline styling, and reduced-motion behavior. All global `a` rules are inside `@layer base` so Tailwind utility classes like `text-white` are not overridden.
- `supabase/schema.sql` defines the `articles` table and `updated_at` trigger.
- `scripts/seed-supabase-articles.mjs` upserts the current `lib/content.ts` fixture articles into Supabase.
- `lib/supabase.ts` contains direct Supabase REST/Auth helpers; no Supabase SDK dependency is installed.
- `lib/articles-db.ts` maps Supabase rows to the article render shape, validates drafts/publish requests, revalidates `articles` plus `article:{slug}` tags after mutations, and exports `permanentlyDeleteArticle()` for hard deletion.
- `lib/auth.ts` reads Supabase sessions from HttpOnly cookies and exposes `requireAdminPage()` and `requireAdminApi()`.
- Public pages only query `published` articles. Draft, publish, unpublish, archive, and permanent-delete actions go through server-side admin APIs using the service role key.
- The Studio editor client component lives at `components/studio/article-editor-form.tsx`. It uses per-button action tracking (`activeAction` string) so only the clicked button shows a spinner. The preview panel is collapsible via a `showPreview` toggle.
- `components/studio/delete-article-button.tsx` is a standalone client component used on the article list page for permanent delete with `window.confirm` confirmation.
- `app/editor/page.tsx` is only a redirect.

## Editing Guidelines

- Keep public copy in Chinese unless the user asks otherwise.
- Keep the first viewport brand-forward: "Echo Space" must remain visually dominant on the homepage.
- Prefer existing primitives (`NeoButton`, `NeoCard`, `StickerBadge`, `MarqueeStrip`, `SiteHeader`, `SiteFooter`) over one-off UI.
- Preserve the Neo-brutalist constraints: no gray palettes, no soft shadows, no blur effects, no mid-radius rounded cards, and no gradient hero.
- When adding pages, update `README.md`, `docs/architecture.md`, and `docs/runbook.md`.
- When changing data shape, update `supabase/schema.sql`, `lib/articles-db.ts`, seed behavior, and the docs together.

## Verified State

On 2026-05-02:

- `npm run lint` passed.
- `npm run build` passed.
- Supabase project `otdvtttsatrrkxvjdjmw` has the `articles` table created from `supabase/schema.sql`.
- `npm run seed:articles` imported 2 fixture articles into Supabase.
- REST verification returned published rows for `horizontal-vertical-ai-research` and `hermes-weixin`.
- Routes verified during the Supabase cutover: `/`, `/articles`, `/editor`, `/studio/login`, `/studio/articles`, `/content/horizontal-vertical-ai-research`, `/content/echo-space`, `/api/articles`.
- Login changed from magic-link-only to password-primary + magic-link-fallback.
- Supabase admin user has password set for email+password login.
- Vercel environment variables configured for production deployment.
- Permanent delete feature verified: `permanentlyDeleteArticle()`, `DELETE ?permanent=true`, editor and list delete buttons with confirmation.
- Editor preview toggle verified: collapsible preview panel with 显示/隐藏 button.
- CSS `@layer base` fix verified: `text-white` on `a` elements renders correctly.
