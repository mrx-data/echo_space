import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleList } from "@/components/article-list";
import { MarqueeStrip } from "@/components/marquee-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
        <section className="bg-canvas px-6 py-12 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* BLOG label */}
            <span className="mb-3 inline-block text-[11px] font-medium uppercase tracking-wider text-olive">
              Blog
            </span>
            <h1
              className="max-w-4xl text-[36px] leading-[1.15] text-ink sm:text-[48px] lg:text-[56px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {selectedTag ? selectedTag : "所有文章"}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
              {selectedTag
                ? `包含「${selectedTag}」分类的文章。`
                : "所有已经整理进 Echo Space 的文章、笔记与研究。"}
              {articles.length > 0 ? `共 ${articles.length} 篇。` : "暂时还没有文章。"}
            </p>
            {selectedTag && (
              <Link
                href="/articles"
                className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-olive transition-colors hover:text-olive-dark"
              >
                查看全部文章
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            )}
          </div>
        </section>

        {/* Category tags */}
        {categoryNames.length > 0 && (
          <MarqueeStrip items={categoryNames} tone="olive" />
        )}

        {/* Active tag filter */}
        {selectedTag && (
          <div className="bg-canvas px-6 py-3 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <span className="inline-flex items-center rounded-full bg-olive/10 px-3 py-1 text-[11px] font-medium text-olive">
                {selectedTag}
              </span>
            </div>
          </div>
        )}

        {/* Article list */}
        <section className="bg-canvas px-6 py-14 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {articles.length > 0 ? (
              <ArticleList articles={articles} />
            ) : (
              <div className="rounded-[10px] border border-line bg-surface p-8 text-center">
                <p
                  className="text-[22px] text-ink"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  {selectedTag
                    ? `「${selectedTag}」分类下还没有已发布文章。`
                    : "还没有已发布文章。"}
                </p>
                <Link
                  href="/articles"
                  className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-olive transition-colors hover:text-olive-dark"
                >
                  查看全部文章
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-line bg-surface-warm px-6 py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-center">
            <div>
              <span className="mb-3 inline-block text-[11px] font-medium uppercase tracking-wider text-olive">
                继续探索
              </span>
              <h2
                className="text-[28px] leading-tight text-ink sm:text-[36px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                回到首页
              </h2>
            </div>
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-olive-dark px-5 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
              >
                返回首页
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
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
