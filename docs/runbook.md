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

If `.env.local` changes, stop and restart `npm run dev`.

## Environment

Required locally and in Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_EMAIL
```

Do not commit `.env.local` or copy secret values into docs.

## Verification

Run before handoff:

```bash
npm run lint
npm run build
```

Manual smoke checks:

- `/` loads and shows the Echo Space hero with navigation links (关于, 文章, 阅读, 写作).
- `/articles` loads and shows the article list with featured hero card and article grid.
- `/editor` redirects to `/studio/articles/new`.
- `/studio/login` accepts admin email + password login. Magic link is also available as fallback.
- A non-admin email is rejected by `/api/auth/login` and `/api/auth/magic-link`.
- `/studio/articles` requires auth and lists drafts, published articles, and archived records.
- `/studio/articles/new` saves a draft through `/api/admin/articles`.
- `/studio/articles/[id]` edits slug, source info, tags, and sections.
- Publishing makes the article visible on `/`, `/articles`, and `/content/[slug]`.
- Unpublishing removes the article from public pages.
- Archiving removes the article from public pages and keeps it in Studio as `archived`.
- Clicking an article card navigates to `/content/{slug}` and shows the full article.
- `/content/echo-space` redirects to the current featured article.
- The "全部文章" link in the footer navigates to `/articles`.
- The "写作" button in the header navigates to `/studio/articles/new`.
- Mobile width keeps CTA buttons and article text readable without overlap.

## Common Tasks

Create the Supabase table:

```bash
# Run supabase/schema.sql in the Supabase SQL editor.
```

Configure env vars:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_EMAIL
```

Seed existing file content:

```bash
npm run seed:articles
```

Deploy through Vercel:

```text
1. Push committed changes to GitHub.
2. Connect or refresh the GitHub repository in Vercel.
3. Add the required environment variables in Vercel.
4. Redeploy the project.
5. Smoke check /, /articles, /studio/login, and one /content/{slug} route.
```

Article data is stored in Supabase. A Vercel redeploy changes app code but does not delete drafts, archived records, or published articles.

Add a new article:

```text
1. Navigate to /studio/login
2. Log in with ADMIN_EMAIL and password
3. Open /studio/articles/new
4. Save draft
5. Publish when required fields are complete
```

Change article content:

```text
Use /studio/articles/[id].
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
app/studio/
app/content/[slug]/page.tsx
app/content/echo-space/page.tsx
```

## Troubleshooting

Use the project script for local development:

```bash
npm run dev
```

The script runs webpack dev mode:

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

If Studio login fails, confirm the Supabase user exists, the email equals `ADMIN_EMAIL`, and the password is correct. For magic link fallback, confirm Supabase Auth allows email OTP login and the Redirect URLs whitelist includes the production domain.

If public pages show fixture content after cutover, confirm `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are all present in the runtime environment.

If publish fails, check the article has `slug`, `title`, `excerpt`, `highlight`, and at least one section with heading and body.

If a changed slug still serves stale content, confirm mutation routes are calling `revalidateTag` and that the old slug was saved before the patch.

## Known State

On 2026-05-02:

- Supabase project `otdvtttsatrrkxvjdjmw` had `supabase/schema.sql` applied.
- `npm run seed:articles` imported 2 fixture articles.
- `npm run lint` passed.
- `npm run build` passed.
- Login changed from magic-link-only to password-primary + magic-link-fallback.
- Supabase admin user has password set for email+password login.
- Vercel environment variables configured for production deployment.
