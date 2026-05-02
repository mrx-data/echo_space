# Echo Space Architecture

## Summary

Echo Space is a personal site built with the Next.js App Router and a Supabase-backed article CMS. Next.js is the BFF layer: public pages and admin mutations go through Server Components or Route Handlers, and the browser never writes directly to Supabase tables.

## Runtime Model

- Public pages: `/`, `/articles`, `/content/[slug]`, `/content/echo-space`.
- Admin pages: `/studio`, `/studio/login`, `/studio/articles`, `/studio/articles/new`, `/studio/articles/[id]`.
- Compatibility route: `/editor` redirects to `/studio/articles/new`.
- Admin APIs: `/api/admin/articles/*`.
- Auth APIs: `/api/auth/magic-link`, `/api/auth/session`, `/api/auth/logout`.
- All public content reads are server-side. Admin writes use server-side Supabase service credentials.
- If Supabase env vars are missing, public pages fall back to `lib/content.ts` fixtures so local build verification remains possible before cutover.

## Content Model

Supabase owns runtime article data in the `articles` table defined in `supabase/schema.sql`.

Main fields:

- `id uuid primary key`
- `slug text unique not null`
- `title`, `excerpt`, `highlight`, `reading_time`, `date`
- `status` checked against `draft`, `published`, `archived`
- `tags text[]`
- `source_title`, `source_author`, `source_url`
- `sections jsonb`, shaped as `{ heading, body[], callout? }[]`
- timestamps and `author_user_id`

`lib/articles-db.ts` maps Supabase rows to the existing article render shape. `lib/content.ts` remains as fixtures for migration and build fallback, plus `topicTags`.

## Auth And Admin Guard

Supabase Auth sends an email magic link. `ADMIN_EMAIL` gates access to the single configured admin account.

- `/api/auth/magic-link` sends the OTP email only for `ADMIN_EMAIL`.
- `/studio/auth/callback` reads Supabase tokens from the URL hash and posts them to `/api/auth/session`.
- `/api/auth/session` verifies the Supabase user and sets HttpOnly cookies.
- `requireAdminPage()` protects Studio pages.
- `requireAdminApi()` protects `/api/admin/*`.

## Studio

The Studio editor is a client component that:

1. Renders metadata, source fields, tags, and dynamic section editing.
2. Shows a live preview panel using `ArticlePreview`.
3. Saves drafts through `POST /api/admin/articles` or `PATCH /api/admin/articles/[id]`.
4. Publishes, unpublishes, and archives through explicit admin endpoints.

`/api/articles` no longer mutates files; it returns a 410 compatibility error.

## Caching

Public list reads are tagged with `articles`. Public detail reads are tagged with `articles` and `article:{slug}`. After create, update, publish, unpublish, or archive, the admin mutation invalidates `articles`, the current slug tag, and the old slug tag when a slug changes.

## UI System

The design system is centralized in `app/globals.css` and component primitives in `components/`.

Core tokens:

- `--neo-bg: #FFFDF5`
- `--neo-ink: #000000`
- `--neo-accent: #FF6B6B`
- `--neo-secondary: #FFD93D`
- `--neo-muted: #C4B5FD`

Core reusable components:

- `NeoButton` — link-styled button with variants (accent, secondary, white, black).
- `NeoCard` — bordered card with hard shadow.
- `StickerBadge` — rotated label tag.
- `MarqueeStrip` — scrolling ticker strip.
- `SiteHeader` — sticky top nav with logo, navigation links, and editor CTA.
- `SiteFooter` — bottom section with "全部文章" link.
- `ArticleList` — featured hero card + grid of article cards.
- `ArticlePage` — full article detail view.
- `ArticlePreview` — preview-only article render for the editor.

## Routing

```text
/                    app/page.tsx                  (static)
/articles            app/articles/page.tsx         (static)
/editor              app/editor/page.tsx                         (redirect)
/studio              app/studio/page.tsx                         (redirect)
/studio/login        app/studio/login/page.tsx                   (public login)
/studio/articles     app/studio/articles/page.tsx                (admin)
/studio/articles/new app/studio/articles/new/page.tsx            (admin)
/studio/articles/[id] app/studio/articles/[id]/page.tsx          (admin)
/api/admin/articles  app/api/admin/articles/route.ts             (admin API)
/api/auth/*          app/api/auth/*                              (auth API)
/api/articles        app/api/articles/route.ts                   (410 compatibility)
/content/[slug]      app/content/[slug]/page.tsx                 (published content)
/content/echo-space  app/content/echo-space/page.tsx             (legacy redirect)
```

## Build And Font Behavior

`app/globals.css` defines a CSS font stack that prefers Space Grotesk and falls back to system sans fonts. The project avoids `next/font/google` so `npm run build` does not need network access to Google Fonts.

`npm run dev` uses webpack dev mode.

`next.config.ts` sets `turbopack.root = __dirname` to keep Next from selecting an upper-level `/Users/echo/package-lock.json` as the workspace root.
