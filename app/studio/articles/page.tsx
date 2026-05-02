import Link from "next/link";
import { CalendarDays, FileText, PenLine, Plus } from "lucide-react";
import { StudioHeader } from "@/components/studio/studio-shell";
import { listAdminArticles } from "@/lib/articles-db";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StudioArticlesPage() {
  await requireAdminPage();
  const articles = await listAdminArticles();

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
            </div>
            <Link
              href="/studio/articles/new"
              className="inline-flex min-h-14 items-center justify-center gap-2 border-4 border-black bg-neo-secondary px-6 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_0_#000]"
            >
              <Plus aria-hidden="true" className="h-5 w-5 stroke-[4]" />
              新建文章
            </Link>
          </div>

          <div className="grid gap-4">
            {articles.length === 0 ? (
              <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
                <FileText aria-hidden="true" className="mb-4 h-10 w-10 stroke-[4]" />
                <p className="text-2xl font-black">还没有文章。先从新建草稿开始。</p>
              </div>
            ) : (
              articles.map((article) => (
                <Link
                  href={`/studio/articles/${article.id}`}
                  key={article.id}
                  className="grid gap-4 border-4 border-black bg-white p-5 shadow-[7px_7px_0_0_#000] transition duration-100 hover:-translate-y-0.5 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
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
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 border-4 border-black bg-black px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-white">
                    <PenLine aria-hidden="true" className="h-4 w-4 stroke-[4]" />
                    编辑
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
