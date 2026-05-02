import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Layers } from "lucide-react";
import { ArticleList } from "@/components/article-list";
import { MarqueeStrip } from "@/components/marquee-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickerBadge } from "@/components/sticker-badge";
import { articles, topicTags } from "@/lib/content";

export const metadata: Metadata = {
  title: "全部文章",
  description: "Echo Space 中所有已发布的文章、笔记与研究。",
};

export default function ArticlesPage() {
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
              全部文章
            </StickerBadge>
            <h1 className="max-w-5xl text-6xl font-black uppercase leading-none tracking-[0] sm:text-8xl lg:text-9xl">
              <span className="block">全部</span>
              <span className="neo-outline-text block">文章</span>
            </h1>
            <p className="mt-6 max-w-3xl border-l-8 border-black bg-white px-5 py-4 text-xl font-bold leading-snug shadow-[6px_6px_0_0_#000] sm:text-2xl">
              所有已经整理进 Echo Space 的文章、笔记与研究。
              {articles.length > 1 ? `共 ${articles.length} 篇。` : "从这里开始阅读。"}
            </p>
          </div>
        </section>

        <MarqueeStrip items={topicTags} />

        {/* Article list */}
        <section className="bg-neo-bg px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <ArticleList articles={articles} />
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
