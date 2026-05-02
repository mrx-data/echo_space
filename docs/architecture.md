# Echo Space Architecture

## Summary

Echo Space is a personal site built with the Next.js App Router. It has a client-side article editor with live preview, a static article list, and statically prerendered article detail pages. The only API route is `POST /api/articles`, which appends new articles to the content source file.

## Runtime Model

- Static pages: `/`, `/articles`, `/content/[slug]`, `/content/echo-space`.
- Client component: `/editor` (interactive form, `"use client"`).
- API route: `POST /api/articles` — appends a new article object to `lib/content.ts`.
- All page components except the editor are Server Components.
- The site is statically prerendered by `next build`.

## Content Model

`lib/content.ts` exports the editable content surface:

- `articles: Article[]` — the full list of published articles.
- `featuredArticle` — backward-compatible alias for `articles[0]`.
- `getArticleBySlug(slug)` — look up any article by slug.
- `topicTags` — homepage topic chips.

Each `Article` has: `slug`, `title`, `date`, `readingTime`, `tags`, `excerpt`, `highlight`, `source` (title, author, url), and `sections` (heading, body[], callout?).

Article routes are generated from the `articles` array via `generateStaticParams()` in `app/content/[slug]/page.tsx`. The `ArticlePage` component accepts an `article` prop.

## Editor

The `/editor` page is a `"use client"` component that:

1. Renders a form for article metadata (title, slug, date, readingTime, tags, excerpt, highlight, source) and dynamic sections (heading, body paragraphs, callout).
2. Shows a live preview panel (desktop) using the `ArticlePreview` component, which mirrors the site's Neo-brutalist style.
3. On save, sends `POST /api/articles` which appends the article to `lib/content.ts` via Node.js `fs`.

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
/editor              app/editor/page.tsx           (client)
/api/articles        app/api/articles/route.ts     (dynamic, POST)
/content/[slug]      app/content/[slug]/page.tsx   (static, SSG)
/content/echo-space  app/content/echo-space/page.tsx (static)
```

## Build And Font Behavior

`app/layout.tsx` uses `next/font/google` to load Space Grotesk. `npm run build` works with Next 16 production build.

`npm run dev` uses webpack dev mode because local verification on 2026-05-02 showed Turbopack dev mode failing to resolve the internal Google font module in this workspace.

`next.config.ts` sets `turbopack.root = __dirname` to keep Next from selecting an upper-level `/Users/echo/package-lock.json` as the workspace root.
