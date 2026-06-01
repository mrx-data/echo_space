import { revalidateTag } from "next/cache";
import type { Article, ArticleFontFamily, ArticleFontSize, ArticleSection } from "@/lib/content";
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
  content_md: string | null;
  cover_image: string | null;
  sections: ArticleSection[];
  font_family: ArticleFontFamily | null;
  font_size: ArticleFontSize | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  author_user_id: string | null;
};

export type CategoryRow = {
  name: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CategoryInput = {
  name?: string;
  description?: string;
  sortOrder?: number;
};

export type ArticleDraftInput = {
  slug?: string;
  title?: string;
  excerpt?: string;
  highlight?: string;
  readingTime?: string;
  date?: string;
  tags?: string[];
  fontFamily?: ArticleFontFamily;
  fontSize?: ArticleFontSize;
  source?: {
    title?: string;
    author?: string;
    url?: string;
  };
  contentMd?: string;
  coverImage?: string;
  sections?: ArticleSection[];
};

const articleSelectFull =
  "id,slug,title,excerpt,highlight,reading_time,date,status,tags,source_title,source_author,source_url,content_md,cover_image,sections,font_family,font_size,created_at,updated_at,published_at,author_user_id";

const articleSelectLegacy =
  "id,slug,title,excerpt,highlight,reading_time,date,status,tags,source_title,source_author,source_url,sections,created_at,updated_at,published_at,author_user_id";

const articleSelectNoContentMd =
  "id,slug,title,excerpt,highlight,reading_time,date,status,tags,source_title,source_author,source_url,cover_image,sections,font_family,font_size,created_at,updated_at,published_at,author_user_id";

const articleSelectNoCoverImage =
  "id,slug,title,excerpt,highlight,reading_time,date,status,tags,source_title,source_author,source_url,content_md,sections,font_family,font_size,created_at,updated_at,published_at,author_user_id";

async function fetchArticles<T>(query: string, options?: { tags?: string[]; noStore?: boolean }): Promise<T> {
  try {
    return await supabaseRestFetch<T>(query, options);
  } catch (error) {
    if (error instanceof Error && error.message.includes("font_family")) {
      const fallbackQuery = query.replace(articleSelectFull, articleSelectLegacy);
      if (fallbackQuery !== query) {
        return await supabaseRestFetch<T>(fallbackQuery, options);
      }
    }
    if (error instanceof Error && error.message.includes("content_md")) {
      const fallbackQuery = query.replace(articleSelectFull, articleSelectNoContentMd);
      if (fallbackQuery !== query) {
        return await supabaseRestFetch<T>(fallbackQuery, options);
      }
    }
    if (error instanceof Error && error.message.includes("cover_image")) {
      const fallbackQuery = query.replace(articleSelectFull, articleSelectNoCoverImage);
      if (fallbackQuery !== query) {
        return await supabaseRestFetch<T>(fallbackQuery, options);
      }
    }
    throw error;
  }
}

function getArticleSelect(): string {
  return articleSelectFull;
}

export const ARTICLES_TAG = "articles";
export const CATEGORIES_TAG = "categories";

export function articleTag(slug: string) {
  return `article:${slug}`;
}

function categoryTag(name: string) {
  return `category:${name}`;
}

function isMissingCategoryTableError(error: unknown) {
  return error instanceof Error && (error.message.includes("categories") || error.message.includes("PGRST205"));
}

function encodeArrayContainsValue(value: string) {
  return encodeURIComponent(value);
}

export function normalizeCategoryName(name?: string) {
  return (name ?? "").trim();
}

export function sanitizeCategoryInput(input: CategoryInput) {
  const name = normalizeCategoryName(input.name);
  const description = input.description?.trim() ?? "";
  const sortOrder = Number.isFinite(input.sortOrder) ? Number(input.sortOrder) : 0;
  const errors: string[] = [];

  if (!name) errors.push("name");
  if (name.includes(",")) errors.push("name_comma");

  return {
    name,
    description,
    sort_order: sortOrder,
    errors,
  };
}

export function getFixtureCategories(): CategoryRow[] {
  const names = new Set<string>();
  for (const article of fixtureArticles) {
    for (const tag of article.tags) {
      const name = normalizeCategoryName(tag);
      if (name) names.add(name);
    }
  }

  return Array.from(names).map((name, index) => ({
    name,
    description: "",
    sort_order: index,
    created_at: "",
    updated_at: "",
  }));
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
    fontFamily: row.font_family ?? undefined,
    fontSize: row.font_size ?? undefined,
    source: {
      title: row.source_title ?? "",
      author: row.source_author ?? "",
      url: row.source_url ?? "",
    },
    contentMd: row.content_md ?? undefined,
    coverImage: row.cover_image ?? undefined,
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
    fontFamily: row.font_family ?? "sans",
    fontSize: row.font_size ?? "base",
    source: {
      title: row.source_title ?? "",
      author: row.source_author ?? "",
      url: row.source_url ?? "",
    },
    contentMd: row.content_md ?? "",
    coverImage: row.cover_image ?? "",
    sections: row.sections ?? [],
  };
}

export function sanitizeArticleInput(input: ArticleDraftInput) {
  const validFamilies: ArticleFontFamily[] = ["sans", "serif", "mono"];
  const validSizes: ArticleFontSize[] = ["sm", "base", "lg"];

  return {
    slug: input.slug?.trim() ?? "",
    title: input.title?.trim() ?? "",
    excerpt: input.excerpt?.trim() ?? "",
    highlight: input.highlight?.trim() ?? "",
    reading_time: input.readingTime?.trim() || "5 min read",
    date: input.date?.trim() || new Date().toISOString().split("T")[0],
    tags: (input.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
    font_family: input.fontFamily && validFamilies.includes(input.fontFamily) ? input.fontFamily : null,
    font_size: input.fontSize && validSizes.includes(input.fontSize) ? input.fontSize : null,
    source_title: input.source?.title?.trim() || null,
    source_author: input.source?.author?.trim() || null,
    source_url: input.source?.url?.trim() || null,
    content_md: input.contentMd?.trim() || null,
    cover_image: input.coverImage?.trim() || null,
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
  if (!sanitized.excerpt && !sanitized.content_md) errors.push("excerpt");
  if (!sanitized.highlight && !sanitized.content_md) errors.push("highlight");
  if (!sanitized.content_md && !sanitized.sections.some((section) => section.heading && section.body.length > 0)) {
    errors.push("sections");
  }

  return errors;
}

export async function getPublishedArticles(categoryName?: string): Promise<Article[]> {
  const category = normalizeCategoryName(categoryName);

  if (!isSupabaseConfigured()) {
    return category ? fixtureArticles.filter((article) => article.tags.includes(category)) : fixtureArticles;
  }

  const categoryFilter = category ? `&tags=cs.{${encodeArrayContainsValue(category)}}` : "";
  const rows = await fetchArticles<ArticleRow[]>(
    `articles?select=${getArticleSelect()}&status=eq.published${categoryFilter}&order=published_at.desc.nullslast,date.desc`,
    { tags: category ? [ARTICLES_TAG, categoryTag(category)] : [ARTICLES_TAG] },
  );
  return rows.map(rowToArticle);
}

export async function getCategories(): Promise<CategoryRow[]> {
  if (!isSupabaseConfigured()) {
    return getFixtureCategories();
  }

  try {
    return await supabaseRestFetch<CategoryRow[]>(
      "categories?select=name,description,sort_order,created_at,updated_at&order=sort_order.asc,name.asc",
      { tags: [CATEGORIES_TAG] },
    );
  } catch (error) {
    if (isMissingCategoryTableError(error)) {
      return getFixtureCategories();
    }
    throw error;
  }
}

export async function getCategoryUsageCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  const articles = isSupabaseConfigured()
    ? await listAdminArticles().catch((error) => {
        if (isMissingCategoryTableError(error)) return [] as ArticleRow[];
        throw error;
      })
    : fixtureArticles.map((article) => ({ tags: article.tags }) as ArticleRow);

  for (const article of articles) {
    for (const tag of article.tags ?? []) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }
  return counts;
}

export async function createCategory(input: CategoryInput) {
  const sanitized = sanitizeCategoryInput(input);
  if (sanitized.errors.length > 0) {
    throw new Error(`分类字段无效：${sanitized.errors.join(", ")}`);
  }

  const rows = await supabaseRestFetch<CategoryRow[]>("categories?select=name,description,sort_order,created_at,updated_at", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      name: sanitized.name,
      description: sanitized.description,
      sort_order: sanitized.sort_order,
    }),
    noStore: true,
  });
  invalidateCategoryCaches(sanitized.name);
  return rows[0];
}

export async function updateCategory(name: string, input: Omit<CategoryInput, "name">) {
  const normalizedName = normalizeCategoryName(name);
  const sortOrder = Number.isFinite(input.sortOrder) ? Number(input.sortOrder) : 0;
  const rows = await supabaseRestFetch<CategoryRow[]>(
    `categories?name=eq.${encodeURIComponent(normalizedName)}&select=name,description,sort_order,created_at,updated_at`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        description: input.description?.trim() ?? "",
        sort_order: sortOrder,
      }),
      noStore: true,
    },
  );
  invalidateCategoryCaches(normalizedName);
  return rows[0] ?? null;
}

export async function deleteCategory(name: string) {
  const normalizedName = normalizeCategoryName(name);
  const usageCounts = await getCategoryUsageCounts();
  if ((usageCounts[normalizedName] ?? 0) > 0) {
    throw new Error("分类已被文章使用，不能删除");
  }

  await supabaseRestFetch<null>(
    `categories?name=eq.${encodeURIComponent(normalizedName)}`,
    {
      method: "DELETE",
      noStore: true,
    },
  );
  invalidateCategoryCaches(normalizedName);
  return { name: normalizedName };
}

export async function getFeaturedArticle(): Promise<Article | null> {
  if (!isSupabaseConfigured()) {
    return fixtureArticles[0] ?? null;
  }

  const rows = await fetchArticles<ArticleRow[]>(
    `articles?select=${getArticleSelect()}&status=eq.published&order=published_at.desc.nullslast,date.desc&limit=1`,
    { tags: [ARTICLES_TAG] },
  );
  return rows[0] ? rowToArticle(rows[0]) : null;
}

export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  if (!isSupabaseConfigured()) {
    return fixtureArticles.find((article) => article.slug === slug) ?? null;
  }

  const rows = await fetchArticles<ArticleRow[]>(
    `articles?select=${getArticleSelect()}&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
    { tags: [ARTICLES_TAG, articleTag(slug)] },
  );
  return rows[0] ? rowToArticle(rows[0]) : null;
}

export async function listAdminArticles(): Promise<ArticleRow[]> {
  return fetchArticles<ArticleRow[]>(
    `articles?select=${getArticleSelect()}&order=updated_at.desc`,
    { noStore: true },
  );
}

export async function getAdminArticle(id: string): Promise<ArticleRow | null> {
  const rows = await fetchArticles<ArticleRow[]>(
    `articles?select=${getArticleSelect()}&id=eq.${encodeURIComponent(id)}&limit=1`,
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
    contentMd: existing.content_md ?? undefined,
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

export async function permanentlyDeleteArticle(id: string) {
  const existing = await getAdminArticle(id);
  if (!existing) return null;

  await supabaseRestFetch<null>(
    `articles?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      noStore: true,
    },
  );
  invalidateArticleCaches(existing.slug);
  return existing;
}

export function invalidateArticleCaches(slug?: string, previousSlug?: string) {
  revalidateTag(ARTICLES_TAG, "max");
  if (slug) revalidateTag(articleTag(slug), "max");
  if (previousSlug && previousSlug !== slug) revalidateTag(articleTag(previousSlug), "max");
}

export function invalidateCategoryCaches(name?: string) {
  revalidateTag(CATEGORIES_TAG, "max");
  revalidateTag(ARTICLES_TAG, "max");
  if (name) revalidateTag(categoryTag(name), "max");
}
