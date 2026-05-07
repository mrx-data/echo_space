import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Layers } from "lucide-react";
import { ArticleList } from "@/components/article-list";
import { MarqueeStrip } from "@/components/marquee-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickerBadge } from "@/components/sticker-badge";
import { getCategories, getPublishedArticles } from "@/lib/articles-db";

export const metadata: Metadata = {
  title: "全部文章",
  description: "Echo Space 中所有已发布的文章、笔记与研究。",
};

type ArticlesPageProps = {
  searchParams?: Promise<{ tag?: string | string[] }>;
};

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const selectedTag = Array.isArray(params?.tag) ? params?.tag[0] : params?.tag;
  const [articles, categories] = await Promise.all([getPublishedArticles(selectedTag), getCategories()]);
  const categoryNames = categories.map((category) => category.name);

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero header */}
        <section className="neo-noise border-b-4 border-black bg-neo-bg px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center border-4 border-black bg-neo-secondary shadow-[6px_6px_0_0_#000]">
                <BookOpen aria-hidden="true" className="h-9 w-9 stroke-[4]" />
              </div>
              <div className="flex h-16 w-16 items-center justify-center rotate-6 border-4 border-black bg-neo-accent shadow-[6px_6px_0_0_#000]">
                <Layers aria-hidden="true" className="h-9 w-9 stroke-[4]" />
              </div>
            </div>
            <StickerBadge tone="muted" className="mb-6 w-fit rotate-[-2deg]">
              {selectedTag ? "分类文章" : "全部文章"}
            </StickerBadge>
            <h1 className="max-w-5xl text-6xl font-black uppercase leading-none tracking-[0] sm:text-8xl lg:text-9xl">
              <span className="block">{selectedTag ? selectedTag : "全部"}</span>
              <span className="neo-outline-text block">文章</span>
            </h1>
            <p className="mt-6 max-w-3xl border-l-8 border-black bg-white px-5 py-4 text-xl font-bold leading-snug shadow-[6px_6px_0_0_#000] sm:text-2xl">
              {selectedTag ? `包含「${selectedTag}」分类的文章。` : "所有已经整理进 Echo Space 的文章、笔记与研究。"}
              {articles.length > 0 ? `共 ${articles.length} 篇。` : "暂时还没有文章。"}
            </p>
            {selectedTag ? (
              <Link
                href="/articles"
                className="mt-6 inline-flex min-h-12 items-center gap-2 border-4 border-black bg-neo-secondary px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000]"
              >
                查看全部文章
                <BookOpen aria-hidden="true" className="h-5 w-5 stroke-[4]" />
              </Link>
            ) : null}
          </div>
        </section>

        {categoryNames.length > 0 ? <MarqueeStrip items={categoryNames} /> : null}

        {/* Article list */}
        <section className="bg-neo-bg px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {articles.length > 0 ? (
              <ArticleList articles={articles} />
            ) : (
              <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
                <BookOpen aria-hidden="true" className="mb-4 h-10 w-10 stroke-[4]" />
                <p className="text-2xl font-black">
                  {selectedTag ? `「${selectedTag}」分类下还没有已发布文章。` : "还没有已发布文章。"}
                </p>
                <Link
                  href="/articles"
                  className="mt-6 inline-flex min-h-12 items-center gap-2 border-4 border-black bg-neo-secondary px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000]"
                >
                  查看全部文章
                  <BookOpen aria-hidden="true" className="h-5 w-5 stroke-[4]" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t-4 border-black bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-center">
            <div>
              <StickerBadge tone="accent" className="mb-5 rotate-2">
                继续探索
              </StickerBadge>
              <h2 className="neo-text-shadow text-5xl font-black uppercase leading-none tracking-[0] sm:text-7xl">
                回到首页。
              </h2>
            </div>
            <div className="grid gap-4">
              <Link
                href="/"
                className="inline-flex min-h-14 items-center justify-between border-4 border-black bg-neo-secondary px-6 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_0_#000] transition duration-100 ease-linear active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                返回首页
                <BookOpen aria-hidden="true" className="h-5 w-5 stroke-[4]" />
              </Link>
              <p className="text-lg font-black leading-tight opacity-70">
                页面先小而完整，后续再长出更多房间。
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
