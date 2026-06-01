import Link from "next/link";
import { CalendarDays, FileText, PenLine, Plus, Search, X } from "lucide-react";
import { StudioHeader } from "@/components/studio/studio-shell";
import { DeleteArticleButton } from "@/components/studio/delete-article-button";
import { getCategories, listAdminArticles } from "@/lib/articles-db";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

type StudioArticlesPageProps = {
  searchParams?: Promise<{ tag?: string | string[]; q?: string | string[] }>;
};

export default async function StudioArticlesPage({ searchParams }: StudioArticlesPageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const selectedTag = Array.isArray(params?.tag) ? params?.tag[0] : params?.tag;
  const query = Array.isArray(params?.q) ? params?.q[0] : params?.q;
  const normalizedTag = selectedTag?.trim() ?? "";
  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const [articles, categories] = await Promise.all([listAdminArticles(), getCategories()]);
  const filteredArticles = articles.filter((article) => {
    const matchesTag = normalizedTag ? article.tags.includes(normalizedTag) : true;
    const matchesQuery = normalizedQuery ? article.title.toLowerCase().includes(normalizedQuery) : true;
    return matchesTag && matchesQuery;
  });
  const hasFilters = Boolean(normalizedTag || normalizedQuery);

  const statusStyles: Record<string, string> = {
    draft: "bg-[#f7f5f0] text-[#64645c]",
    published: "bg-[#596044]/10 text-[#596044]",
    archived: "bg-[#f7f5f0] text-[#9a988f]",
  };

  return (
    <>
      <StudioHeader />
      <main className="min-h-screen bg-[#fbfaf7] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="mb-2 text-xs font-medium uppercase tracking-widest text-[#596044]">
                ARTICLES
              </span>
              <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-4xl font-semibold text-[#171713] sm:text-5xl">
                所有文章
              </h1>
              <p className="mt-2 text-sm text-[#64645c]">
                {hasFilters ? `筛选结果 ${filteredArticles.length} / ${articles.length} 篇` : `共 ${articles.length} 篇文章`}
              </p>
            </div>
            <Link
              href="/studio/articles/new"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#485035] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#596044]"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              新建文章
            </Link>
          </div>

          <form
            action="/studio/articles"
            className="editorial-card grid gap-4 p-5 md:grid-cols-[0.8fr_1fr_auto_auto] md:items-end"
          >
            <label className="grid gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-[#64645c]">分类筛选</span>
              <select
                name="tag"
                defaultValue={normalizedTag}
                className="h-10 w-full rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] px-4 py-2 text-sm text-[#171713] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
              >
                <option value="">全部分类</option>
                {categories.map((category) => (
                  <option value={category.name} key={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-[#64645c]">标题搜索</span>
              <input
                type="search"
                name="q"
                defaultValue={query ?? ""}
                placeholder="输入标题关键词"
                className="h-10 w-full rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] px-4 py-2 text-sm text-[#171713] placeholder:text-[#9a988f] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#485035] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#596044]"
            >
              <Search aria-hidden="true" className="h-4 w-4" />
              筛选
            </button>
            <Link
              href="/studio/articles"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#e8e4db] bg-white px-5 py-2.5 text-sm text-[#64645c] transition hover:border-[#171713] hover:text-[#171713]"
            >
              <X aria-hidden="true" className="h-4 w-4" />
              清除
            </Link>
          </form>

          <div className="grid gap-4">
            {filteredArticles.length === 0 ? (
              <div className="editorial-card p-8 text-center">
                <FileText aria-hidden="true" className="mx-auto mb-4 h-10 w-10 text-[#9a988f]" />
                <p className="text-lg text-[#64645c]">
                  {hasFilters ? "没有匹配文章。可以清除筛选或换个关键词。" : "还没有文章。先从新建草稿开始。"}
                </p>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="editorial-card grid gap-4 p-5 transition hover:-translate-y-0.5 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <Link href={`/studio/articles/${article.id}`} className="block">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusStyles[article.status] ?? statusStyles.draft
                        }`}
                      >
                        {article.status}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-[#9a988f]">
                        <CalendarDays aria-hidden="true" className="h-3 w-3" />
                        {new Date(article.updated_at).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                    <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-xl font-semibold text-[#171713] leading-snug">
                      {article.title || "未命名草稿"}
                    </h2>
                    <p className="mt-1 text-xs text-[#9a988f]">/content/{article.slug}</p>
                    {article.tags.length > 0 ? (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {article.tags.map((tag) => (
                          <span
                            className="rounded-full bg-[#f7f5f0] px-2.5 py-0.5 text-xs text-[#64645c]"
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/studio/articles/${article.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#485035] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#596044]"
                    >
                      <PenLine aria-hidden="true" className="h-3 w-3" />
                      编辑
                    </Link>
                    <DeleteArticleButton articleId={article.id} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
