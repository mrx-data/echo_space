# Echo Space Runbook

## Local Setup

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification

Run before handoff:

```bash
npm run lint
npm run build
```

Manual smoke checks:

- `/` loads and shows the Echo Space hero with navigation links (关于, 文章, 阅读, 写作).
- `/articles` loads and shows the article list with featured hero card and article grid.
- `/editor` loads the article editor form with live preview panel.
- Clicking an article card navigates to `/content/{slug}` and shows the full article.
- `/content/echo-space` still renders the current featured article as a legacy URL.
- The "全部文章" link in the footer navigates to `/articles`.
- The "写作" button in the header navigates to `/editor`.
- Mobile width keeps CTA buttons and article text readable without overlap.

## Common Tasks

Add a new article (via editor):

```text
1. Navigate to /editor
2. Fill in title, slug, tags, excerpt, highlight, and sections
3. Click "保存文章"
4. Restart dev server (or rebuild) to see the new article at /content/{slug}
```

Add a new article (manual):

```text
Push a new article object into the `articles` array in lib/content.ts.
```

Change article content:

```text
lib/content.ts
```

Change visual tokens or global patterns:

```text
app/globals.css
```

Change shared UI:

```text
components/
```

Change route-level layout:

```text
app/page.tsx
app/articles/page.tsx
app/editor/page.tsx
app/content/[slug]/page.tsx
app/content/echo-space/page.tsx
```

## Troubleshooting

If `next dev` fails with a Turbopack Google font module resolution error, use the project script:

```bash
npm run dev
```

The script runs:

```bash
next dev --webpack
```

If `next build` warns that Next inferred the wrong workspace root, confirm `next.config.ts` still contains:

```ts
turbopack: {
  root: __dirname,
}
```

If `/favicon.ico` returns 404, confirm `app/layout.tsx` points to `/icon.svg` and `public/icon.svg` exists.

If the editor "保存文章" button fails, check the terminal running `npm run dev` for error output from the API route. Common cause: `lib/content.ts` has a syntax error from a previous save.

## Environment Variables

No environment variables are required in v1.
