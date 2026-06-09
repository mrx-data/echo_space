# Echo Space Architecture

## Summary

Echo Space is a personal site built with the Next.js App Router and a Supabase-backed article CMS. Next.js is the BFF layer: public pages and admin mutations go through Server Components or Route Handlers, and the browser never writes directly to Supabase tables.

## Runtime Model

- Browser requests hit Next.js first.
- Server Components and Route Handlers query Supabase.
- The browser never writes directly to the `articles` or `categories` tables.
- Vercel hosts the app runtime; Supabase owns durable content and auth state.
- Public pages: `/`, `/articles`, `/articles?tag=<category>`, `/content/[slug]`, `/content/echo-space`. The homepage is an editorial personal work index backed by backend-managed category links, static image assets, contact links, and the latest published article query where needed.
- Admin pages: `/studio`, `/studio/login`, `/studio/articles`, `/studio/articles?tag=<category>&q=<title>`, `/studio/articles/new`, `/studio/articles/[id]`, `/studio/categories`.
- Compatibility route: `/editor` redirects to `/studio/articles/new`.
- Admin APIs: `/api/admin/articles/*`, `/api/admin/categories/*`, `/api/admin/upload`.
- Auth APIs: `/api/auth/login`, `/api/auth/magic-link`, `/api/auth/session`, `/api/auth/logout`.
- All public content reads are server-side. Admin writes use server-side Supabase service credentials.
- If Supabase env vars are missing, public pages fall back to `lib/content.ts` fixtures so local build verification remains possible.

## Content Model

Supabase owns runtime article and category data in the tables defined in `supabase/schema.sql`.

Article fields:

- `id uuid primary key`
- `slug text unique not null`
- `title`, `excerpt`, `highlight`, `reading_time`, `date`
- `status` checked against `draft`, `published`, `archived`
- `tags text[]`
- `source_title`, `source_author`, `source_url`
- `content_md` for Markdown-mode article bodies
- `cover_image` for uploaded or predefined cover URLs
- `sections jsonb`, shaped as `{ heading, body[], callout? }[]`
- `font_family` checked against `sans`, `serif`, `mono`
- `font_size` checked against `sm`, `base`, `lg`
- timestamps and `author_user_id`

Category fields:

- `name text primary key`
- `description text`
- `sort_order integer`
- timestamps

`articles.tags` stores selected category names so existing article render shapes remain compatible. `lib/articles-db.ts` maps Supabase rows to the existing article render shape, supports fallback selects for older Supabase schemas that are missing newer article columns, and exposes category CRUD helpers. `lib/content.ts` remains as fixtures for migration and build fallback.

## Auth And Admin Guard

Supabase Auth supports password login (primary) and email magic link (fallback). `ADMIN_EMAIL` gates access to the single configured admin account.

- `/api/auth/login` authenticates with email + password via Supabase password grant.
- `/api/auth/magic-link` sends the OTP email only for `ADMIN_EMAIL`.
- `/studio/auth/callback` reads Supabase tokens from the URL hash and posts them to `/api/auth/session`.
- `/api/auth/session` verifies the Supabase user and sets HttpOnly cookies.
- `requireAdminPage()` protects Studio pages.
- `requireAdminApi()` protects `/api/admin/*`.

## Studio

The Studio editor is a client component that:

1. Renders metadata, source fields, backend-managed category multi-selects, and dynamic section editing.
2. Supports structured section editing and Markdown-mode body editing through `content_md`.
3. Supports predefined SVG covers from `public/covers/` and custom image upload through `POST /api/admin/upload`, which validates image MIME type, enforces a 5MB limit, writes to `public/uploads/`, and returns a `/uploads/...` URL for `cover_image`.
4. Stores article font controls in `font_family` and `font_size`; renderers map those values to `.article-font-*` and `.article-text-*` classes.
5. Shows a collapsible, draggable live preview panel using `ArticlePreview`; the toggle button lets the user show or hide the preview.
6. Saves drafts through `POST /api/admin/articles` or `PATCH /api/admin/articles/[id]`.
7. Publishes, unpublishes, and archives through explicit admin endpoints.
8. Permanently deletes articles through `DELETE /api/admin/articles/[id]?permanent=true` with a browser confirmation dialog. The list page (`/studio/articles`) also has a per-row delete button using `DeleteArticleButton`.

`/studio/articles` is the admin article index. It uses `listAdminArticles()` and filters in the Server Component by category (`tag`) and title keyword (`q`) so drafts, published, and archived records can be searched without adding extra Supabase query paths.

`/studio/categories` manages category names, descriptions, and sort order. Category names cannot be renamed in v1; create a new category and switch articles over when renaming is needed. Deleting a category is rejected while any article still references it in `articles.tags`.

`/api/articles` no longer mutates files; it returns a 410 compatibility error.

## Caching

Public list reads are tagged with `articles`; filtered reads also use `category:{name}`. Public category reads are tagged with `categories`. Public detail reads are tagged with `articles` and `article:{slug}`. Article mutations invalidate article tags; category mutations invalidate category and article list tags.

## Deployment Model

GitHub is the source repository and Vercel is the deployment target for the Next.js app. Supabase remains external durable infrastructure, so deploying a new Vercel build does not reset article data.

Vercel must have the same runtime variables as local development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`

The `SUPABASE_SERVICE_ROLE_KEY` is only used from server-side Route Handlers and must not be exposed to browser code.

## Cutover State

As of 2026-05-02, the Supabase project had the `articles` table from `supabase/schema.sql`, and the one-time seed imported the fixture articles `horizontal-vertical-ai-research` and `hermes-weixin`. The current schema also includes `categories`, `content_md`, `cover_image`, `font_family`, and `font_size`; rerun the SQL, apply relevant files in `supabase/migrations/` to older environments, and run the seed script to upsert fixture tags as categories.

## UI System

The design system is centralized in `app/globals.css` and component primitives in `components/`. The current UI is editorial and portfolio-like, with cream surfaces, olive accents, thin warm-gray borders, soft shadows, rounded 10px cards, and serif display typography.

Core tokens:

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

Core reusable components:

- `NeoButton` — link-styled rounded button with olive, outline, ghost, and white variants.
- `NeoCard` — bordered editorial card with soft shadow.
- `StickerBadge` — legacy rotated label tag.
- `MarqueeStrip` — legacy scrolling ticker strip.
- `SiteHeader` — sticky top nav with Echo Space logo, 首页/文章/关于 links, and mail CTA.
- `SiteFooter` — bottom section with "全部文章" link.
- `ArticleList` — featured hero card + grid of article cards.
- `ArticlePage` — full article detail view.
- `ArticlePreview` — preview-only article render for the editor.

## Routing

```text
/                    app/page.tsx                  (static)
/articles            app/articles/page.tsx         (static, supports ?tag=)
/editor              app/editor/page.tsx                         (redirect)
/studio              app/studio/page.tsx                         (redirect)
/studio/login        app/studio/login/page.tsx                   (public login)
/studio/articles     app/studio/articles/page.tsx                (admin, supports ?tag=&q=)
/studio/articles/new app/studio/articles/new/page.tsx            (admin)
/studio/articles/[id] app/studio/articles/[id]/page.tsx          (admin)
/studio/categories   app/studio/categories/page.tsx              (admin)
/api/admin/articles  app/api/admin/articles/route.ts             (admin API)
/api/admin/categories app/api/admin/categories/route.ts           (admin API)
/api/admin/categories/[name] app/api/admin/categories/[name]/route.ts (admin API)
/api/admin/upload    app/api/admin/upload/route.ts               (admin image upload API)
/api/auth/*          app/api/auth/*                              (auth API: login, magic-link, session, logout)
/studio/auth/callback app/studio/auth/callback/page.tsx          (magic-link callback)
/api/articles        app/api/articles/route.ts                   (410 compatibility)
/content/[slug]      app/content/[slug]/page.tsx                 (published content)
/content/echo-space  app/content/echo-space/page.tsx             (legacy redirect)
```

## Build And Font Behavior

`app/globals.css` imports Cormorant Garamond and Inter from Google Fonts via CSS `@import`, then exposes them as `--font-display` and `--font-body`. The project does not use `next/font/google`.

`npm run dev` uses webpack dev mode.

`next.config.ts` sets `turbopack.root = __dirname` to keep Next from selecting an upper-level `/Users/echo/package-lock.json` as the workspace root.
