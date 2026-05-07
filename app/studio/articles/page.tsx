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

  return (
    <>
      <StudioHeader />
      <main className="min-h-screen bg-neo-bg px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="mb-4 inline-flex border-4 border-black bg-neo-muted px-4 py-2 text-sm font-black uppercase tracking-[0.16em] shadow-[4px_4px_0_0_#000]">
                内容库
              </span>
              <h1 className="text-6xl font-black uppercase leading-none tracking-[0] sm:text-8xl">
                Articles
              </h1>
              <p className="mt-3 text-lg font-bold leading-snug">
                {hasFilters ? `筛选结果 ${filteredArticles.length} / ${articles.length} 篇` : `共 ${articles.length} 篇文章`}
              </p>
            </div>
            <Link
              href="/studio/articles/new"
              className="inline-flex min-h-14 items-center justify-center gap-2 border-4 border-black bg-neo-secondary px-6 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_0_#000]"
            >
              <Plus aria-hidden="true" className="h-5 w-5 stroke-[4]" />
              新建文章
            </Link>
          </div>

          <form
            action="/studio/articles"
            className="grid gap-4 border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000] md:grid-cols-[0.8fr_1fr_auto_auto] md:items-end"
          >
            <label className="grid gap-1">
              <span className="text-sm font-black uppercase tracking-[0.14em]">分类筛选</span>
              <select
                name="tag"
                defaultValue={normalizedTag}
                className="h-14 w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
              >
                <option value="">全部分类</option>
                {categories.map((category) => (
                  <option value={category.name} key={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-black uppercase tracking-[0.14em]">标题搜索</span>
              <input
                type="search"
                name="q"
                defaultValue={query ?? ""}
                placeholder="输入标题关键词"
                className="h-14 w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-14 items-center justify-center gap-2 border-4 border-black bg-neo-secondary px-5 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000]"
            >
              <Search aria-hidden="true" className="h-5 w-5 stroke-[4]" />
              筛选
            </button>
            <Link
              href="/studio/articles"
              className="inline-flex min-h-14 items-center justify-center gap-2 border-4 border-black bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000]"
            >
              <X aria-hidden="true" className="h-5 w-5 stroke-[4]" />
              清除
            </Link>
          </form>

          <div className="grid gap-4">
            {filteredArticles.length === 0 ? (
              <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
                <FileText aria-hidden="true" className="mb-4 h-10 w-10 stroke-[4]" />
                <p className="text-2xl font-black">
                  {hasFilters ? "没有匹配文章。可以清除筛选或换个关键词。" : "还没有文章。先从新建草稿开始。"}
                </p>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="grid gap-4 border-4 border-black bg-white p-5 shadow-[7px_7px_0_0_#000] transition duration-100 hover:-translate-y-0.5 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <Link href={`/studio/articles/${article.id}`} className="block">
                    <div className="mb-3 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.14em]">
                      <span className="border-4 border-black bg-neo-secondary px-3 py-1">
                        {article.status}
                      </span>
                      <span className="inline-flex items-center gap-1 border-4 border-black bg-neo-muted px-3 py-1">
                        <CalendarDays aria-hidden="true" className="h-4 w-4 stroke-[4]" />
                        {new Date(article.updated_at).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black leading-tight">{article.title || "未命名草稿"}</h2>
                    <p className="mt-2 text-sm font-bold opacity-70">/content/{article.slug}</p>
                    {article.tags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <span
                            className="border-4 border-black bg-neo-bg px-3 py-1 text-xs font-black uppercase tracking-[0.12em]"
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/studio/articles/${article.id}`}
                      className="inline-flex w-fit items-center gap-2 border-4 border-black bg-black px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[4px_4px_0_0_#000]"
                    >
                      <PenLine aria-hidden="true" className="h-4 w-4 stroke-[4]" />
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
