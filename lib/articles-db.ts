import { revalidateTag } from "next/cache";
import type { Article, ArticleSection } from "@/lib/content";
import { articles as fixtureArticles } from "@/lib/content";
import { isSupabaseConfigured, supabaseRestFetch } from "@/lib/supabase";

export { isSupabaseConfigured } from "@/lib/supabase";

export type ArticleStatus = "draft" | "published" | "archived";

export type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  highlight: string;
  reading_time: string;
  date: string;
  status: ArticleStatus;
  tags: string[];
  source_title: string | null;
  source_author: string | null;
  source_url: string | null;
  sections: ArticleSection[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  author_user_id: string | null;
};

export type ArticleDraftInput = {
  slug?: string;
  title?: string;
  excerpt?: string;
  highlight?: string;
  readingTime?: string;
  date?: string;
  tags?: string[];
  source?: {
    title?: string;
    author?: string;
    url?: string;
  };
  sections?: ArticleSection[];
};

const articleSelect =
  "id,slug,title,excerpt,highlight,reading_time,date,status,tags,source_title,source_author,source_url,sections,created_at,updated_at,published_at,author_user_id";

export const ARTICLES_TAG = "articles";

export function articleTag(slug: string) {
  return `article:${slug}`;
}

export function rowToArticle(row: ArticleRow): Article {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    readingTime: row.reading_time,
    tags: row.tags ?? [],
    excerpt: row.excerpt,
    highlight: row.highlight,
    source: {
      title: row.source_title ?? "",
      author: row.source_author ?? "",
      url: row.source_url ?? "",
    },
    sections: row.sections ?? [],
  };
}

export function rowToDraftInput(row: ArticleRow): Required<ArticleDraftInput> {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    highlight: row.highlight,
    readingTime: row.reading_time,
    date: row.date,
    tags: row.tags ?? [],
    source: {
      title: row.source_title ?? "",
      author: row.source_author ?? "",
      url: row.source_url ?? "",
    },
    sections: row.sections ?? [],
  };
}

export function sanitizeArticleInput(input: ArticleDraftInput) {
  return {
    slug: input.slug?.trim() ?? "",
    title: input.title?.trim() ?? "",
    excerpt: input.excerpt?.trim() ?? "",
    highlight: input.highlight?.trim() ?? "",
    reading_time: input.readingTime?.trim() || "5 min read",
    date: input.date?.trim() || new Date().toISOString().split("T")[0],
    tags: (input.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
    source_title: input.source?.title?.trim() || null,
    source_author: input.source?.author?.trim() || null,
    source_url: input.source?.url?.trim() || null,
    sections: sanitizeSections(input.sections ?? []),
  };
}

export function sanitizeSections(sections: ArticleSection[]): ArticleSection[] {
  return sections
    .map((section) => ({
      heading: section.heading?.trim() ?? "",
      body: (section.body ?? []).map((paragraph) => paragraph.trim()).filter(Boolean),
      callout: section.callout?.trim() || undefined,
    }))
    .filter((section) => section.heading || section.body.length > 0);
}

export function validatePublishInput(input: ArticleDraftInput): string[] {
  const sanitized = sanitizeArticleInput(input);
  const errors: string[] = [];

  if (!sanitized.slug) errors.push("slug");
  if (!sanitized.title) errors.push("title");
  if (!sanitized.excerpt) errors.push("excerpt");
  if (!sanitized.highlight) errors.push("highlight");
  if (!sanitized.sections.some((section) => section.heading && section.body.length > 0)) {
    errors.push("sections");
  }

  return errors;
}

export async function getPublishedArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured()) {
    return fixtureArticles;
  }

  const rows = await supabaseRestFetch<ArticleRow[]>(
    `articles?select=${articleSelect}&status=eq.published&order=published_at.desc.nullslast,date.desc`,
    { tags: [ARTICLES_TAG] },
  );
  return rows.map(rowToArticle);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  if (!isSupabaseConfigured()) {
    return fixtureArticles[0] ?? null;
  }

  const rows = await supabaseRestFetch<ArticleRow[]>(
    `articles?select=${articleSelect}&status=eq.published&order=published_at.desc.nullslast,date.desc&limit=1`,
    { tags: [ARTICLES_TAG] },
  );
  return rows[0] ? rowToArticle(rows[0]) : null;
}

export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  if (!isSupabaseConfigured()) {
    return fixtureArticles.find((article) => article.slug === slug) ?? null;
  }

  const rows = await supabaseRestFetch<ArticleRow[]>(
    `articles?select=${articleSelect}&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
    { tags: [ARTICLES_TAG, articleTag(slug)] },
  );
  return rows[0] ? rowToArticle(rows[0]) : null;
}

export async function listAdminArticles(): Promise<ArticleRow[]> {
  return supabaseRestFetch<ArticleRow[]>(
    `articles?select=${articleSelect}&order=updated_at.desc`,
    { noStore: true },
  );
}

export async function getAdminArticle(id: string): Promise<ArticleRow | null> {
  const rows = await supabaseRestFetch<ArticleRow[]>(
    `articles?select=${articleSelect}&id=eq.${encodeURIComponent(id)}&limit=1`,
    { noStore: true },
  );
  return rows[0] ?? null;
}

export async function createDraftArticle(input: ArticleDraftInput, authorUserId?: string | null) {
  const sanitized = sanitizeArticleInput(input);
  const rows = await supabaseRestFetch<ArticleRow[]>("articles?select=*", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      ...sanitized,
      status: "draft",
      author_user_id: authorUserId ?? null,
    }),
    noStore: true,
  });
  invalidateArticleCaches(rows[0]?.slug);
  return rows[0];
}

export async function updateDraftArticle(id: string, input: ArticleDraftInput) {
  const existing = await getAdminArticle(id);
  if (!existing) return null;

  const sanitized = sanitizeArticleInput(input);
  const rows = await supabaseRestFetch<ArticleRow[]>(
    `articles?id=eq.${encodeURIComponent(id)}&select=*`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(sanitized),
      noStore: true,
    },
  );
  invalidateArticleCaches(rows[0]?.slug, existing.slug);
  return rows[0] ?? null;
}

export async function publishArticle(id: string) {
  const existing = await getAdminArticle(id);
  if (!existing) return null;

  const validationErrors = validatePublishInput({
    slug: existing.slug,
    title: existing.title,
    excerpt: existing.excerpt,
    highlight: existing.highlight,
    readingTime: existing.reading_time,
    date: existing.date,
    tags: existing.tags,
    source: {
      title: existing.source_title ?? "",
      author: existing.source_author ?? "",
      url: existing.source_url ?? "",
    },
    sections: existing.sections,
  });

  if (validationErrors.length > 0) {
    throw new Error(`发布缺少必填字段：${validationErrors.join(", ")}`);
  }

  const rows = await supabaseRestFetch<ArticleRow[]>(
    `articles?id=eq.${encodeURIComponent(id)}&select=*`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "published", published_at: new Date().toISOString() }),
      noStore: true,
    },
  );
  invalidateArticleCaches(rows[0]?.slug, existing.slug);
  return rows[0] ?? null;
}

export async function unpublishArticle(id: string) {
  const existing = await getAdminArticle(id);
  if (!existing) return null;

  const rows = await supabaseRestFetch<ArticleRow[]>(
    `articles?id=eq.${encodeURIComponent(id)}&select=*`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "draft" }),
      noStore: true,
    },
  );
  invalidateArticleCaches(rows[0]?.slug, existing.slug);
  return rows[0] ?? null;
}

export async function archiveArticle(id: string) {
  const existing = await getAdminArticle(id);
  if (!existing) return null;

  const rows = await supabaseRestFetch<ArticleRow[]>(
    `articles?id=eq.${encodeURIComponent(id)}&select=*`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "archived" }),
      noStore: true,
    },
  );
  invalidateArticleCaches(rows[0]?.slug, existing.slug);
  return rows[0] ?? null;
}

export function invalidateArticleCaches(slug?: string, previousSlug?: string) {
  revalidateTag(ARTICLES_TAG, "max");
  if (slug) revalidateTag(articleTag(slug), "max");
  if (previousSlug && previousSlug !== slug) revalidateTag(articleTag(previousSlug), "max");
}
