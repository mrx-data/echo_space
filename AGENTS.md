# Echo Space Agent Notes

## Project Snapshot

Echo Space is a small personal website in `/Users/echo/Documents/echo_space`.

- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, lucide-react, Supabase Postgres/Auth.
- Public routes: `/`, `/articles`, `/articles?tag=<category>`, `/content/[slug]`, `/content/echo-space`.
- Admin routes: `/studio`, `/studio/login`, `/studio/auth/callback`, `/studio/articles`, `/studio/articles?tag=<category>&q=<title>`, `/studio/articles/new`, `/studio/articles/[id]`, `/studio/categories`.
- Compatibility routes: `/editor` redirects to `/studio/articles/new`; `/api/articles` returns 410 and no longer writes files.
- Admin APIs: `/api/admin/articles`, `/api/admin/articles/[id]`, `/api/admin/articles/[id]/publish`, `/api/admin/articles/[id]/unpublish`, `/api/admin/categories`, `/api/admin/categories/[name]`, `/api/admin/upload`.
- Auth APIs: `/api/auth/login`, `/api/auth/magic-link`, `/api/auth/session`, `/api/auth/logout`.
- Runtime content source: Supabase `articles` and `categories` tables. `lib/content.ts` remains only for types, fixtures, and local fallback when env vars are missing.
- Design system: editorial personal-portfolio style with cream canvas, olive accents, warm-gray lines, soft shadows, rounded 10px cards, Cormorant Garamond display type, and Inter body type.

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
- `app/layout.tsx` declares `/icon.svg`; fonts are imported in `app/globals.css` with CSS `@import` for Cormorant Garamond and Inter.
- `app/globals.css` owns editorial design tokens, dot-grid/card utilities, Markdown rendering styles, article font classes, and the global `a` rule inside `@layer base` so Tailwind utility classes like `text-white` are not overridden.
- `supabase/schema.sql` defines the `articles` and `categories` tables plus `updated_at` triggers. Article columns include `content_md`, `cover_image`, `font_family`, and `font_size`; older environments may need `supabase/migrations/002_add_font_columns.sql`.
- `scripts/seed-supabase-articles.mjs` upserts the current `lib/content.ts` fixture articles into Supabase and upserts fixture tags as categories.
- `lib/supabase.ts` contains direct Supabase REST/Auth helpers; no Supabase SDK dependency is installed.
- `lib/articles-db.ts` maps Supabase rows to the article render shape, supports fallback selects for older schemas missing newer article columns, validates drafts/publish requests, manages category CRUD, revalidates `articles`, `categories`, `article:{slug}`, and `category:{name}` tags after mutations, and exports `permanentlyDeleteArticle()` for hard deletion.
- `lib/auth.ts` reads Supabase sessions from HttpOnly cookies and exposes `requireAdminPage()` and `requireAdminApi()`.
- Public pages only query `published` articles. Draft, publish, unpublish, archive, and permanent-delete actions go through server-side admin APIs using the service role key.
- The Studio editor client component lives at `components/studio/article-editor-form.tsx`. It uses per-button action tracking (`activeAction` string) so only the clicked button shows a spinner. The preview panel is collapsible via a `showPreview` toggle and resizable with a split handle. Article categories are selected from backend-managed categories and stored in `articles.tags`.
- The editor supports Markdown body mode (`content_md`), structured section mode (`sections`), predefined covers from `public/covers/`, custom cover uploads through `/api/admin/upload`, and article font controls stored in `font_family` / `font_size`.
- `app/api/admin/upload/route.ts` requires admin auth, accepts image files only, enforces a 5MB limit, writes to `public/uploads/`, and returns a `/uploads/...` URL. This local filesystem path is fine for local/dev; production persistence depends on deployment filesystem behavior.
- `components/studio/category-manager.tsx` powers `/studio/categories` for creating categories, editing descriptions/sort order, and deleting unused categories.
- `components/studio/delete-article-button.tsx` is a standalone client component used on the article list page for permanent delete with `window.confirm` confirmation.
- `app/editor/page.tsx` is only a redirect.

## Editing Guidelines

- Keep public copy in Chinese unless the user asks otherwise.
- Keep the first viewport personal-brand-forward and preserve the current editorial portfolio tone.
- Prefer existing primitives (`NeoButton`, `NeoCard`, `SiteHeader`, `SiteFooter`, plus legacy `StickerBadge` and `MarqueeStrip` where they still fit) over one-off UI.
- Preserve the current editorial constraints: cream canvas, olive accents, thin warm-gray borders, soft but restrained shadows, rounded 10px cards, serif display typography, and no loud gradient hero.
- When adding pages, update `README.md`, `docs/architecture.md`, and `docs/runbook.md`.
- When changing data shape, update `supabase/schema.sql`, `lib/articles-db.ts`, seed behavior, and the docs together.

## Verified State

On 2026-06-09:

- Documentation and agent memory were reconciled against current code.
- Current UI is editorial personal-portfolio style, not the earlier Neo-brutalist style.
- Current header links are 首页, 文章, 关于, and a mail CTA; Studio remains available directly at `/studio/*` behind admin auth.
- Studio editor supports Markdown body mode, cover image selection/upload, article font controls, collapsible/resizable preview, category multi-select, publish/unpublish/archive, and permanent delete.
- `app/api/admin/upload/route.ts` exists for authenticated image uploads to `public/uploads/`.

On 2026-05-07:

- Latest pushed commit on `main`: `7ea1168 Add category management and admin filters`.
- `npm run lint` passed.
- `npm run build` passed after allowing Turbopack/PostCSS to bind a local process port outside the sandbox.
- Homepage changed from an atmosphere-first page to a clearer personal work index with backend-managed category links, curated work cards, latest article entry, GitHub, and email contact.
- Category system implemented in code: `categories` schema, `/studio/categories`, `/api/admin/categories`, `/api/admin/categories/[name]`, editor category multi-select, and seed upsert from fixture tags.
- Public category filtering works at `/articles?tag=<category>`.
- Admin article filtering works at `/studio/articles?tag=<category>&q=<title>`.
- Database follow-up: apply updated `supabase/schema.sql` and run `npm run seed:articles` in any Supabase environment that does not yet have `categories`.

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
