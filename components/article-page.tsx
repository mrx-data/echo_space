import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, Quote, Sparkles, Star } from "lucide-react";
import { MarqueeStrip } from "@/components/marquee-strip";
import { MarkdownText } from "@/components/markdown-text";
import { NeoButton } from "@/components/neo-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickerBadge } from "@/components/sticker-badge";
import type { Article, ArticleFontFamily, ArticleFontSize } from "@/lib/content";

type ArticlePageProps = {
  article: Article;
};

function getFontClass(family?: ArticleFontFamily): string {
  switch (family) {
    case "serif": return "article-font-serif";
    case "mono": return "article-font-mono";
    default: return "article-font-sans";
  }
}

function getSizeClass(size?: ArticleFontSize): string {
  switch (size) {
    case "sm": return "article-text-sm";
    case "lg": return "article-text-lg";
    default: return "article-text-base";
  }
}

export function ArticlePage({ article }: ArticlePageProps) {
  const fontClass = getFontClass(article.fontFamily);
  const sizeClass = getSizeClass(article.fontSize);

  return (
    <>
      <SiteHeader />
      <main>
        <article>
          <header className="neo-noise border-b-4 border-black bg-neo-secondary px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <Link
                href="/articles"
                className="mb-8 inline-flex min-h-12 items-center gap-2 border-4 border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000] transition duration-100 ease-linear focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-neo-secondary active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <ArrowLeft aria-hidden="true" className="h-5 w-5 stroke-[4]" />
                全部文章
              </Link>
              <StickerBadge tone="accent" className="mb-6 rotate-[-2deg]">
                文章 / Echo 002
              </StickerBadge>
              <h1 className="max-w-5xl text-5xl font-black uppercase leading-none tracking-[0] sm:text-7xl lg:text-8xl">
                {article.title}
              </h1>
              <p className="mt-6 max-w-4xl border-4 border-black bg-white p-5 text-xl font-bold leading-snug shadow-[8px_8px_0_0_#000] sm:text-2xl">
                {article.excerpt}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 border-4 border-black bg-black px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-white">
                  <CalendarDays aria-hidden="true" className="h-5 w-5 stroke-[4]" />
                  {article.date}
                </span>
                <span className="inline-flex items-center gap-2 border-4 border-black bg-neo-muted px-4 py-2 text-sm font-black uppercase tracking-[0.14em]">
                  <Clock3 aria-hidden="true" className="h-5 w-5 stroke-[4]" />
                  {article.readingTime}
                </span>
              </div>
            </div>
          </header>

          <MarqueeStrip items={article.tags} tone="black" />

          <div className={`bg-neo-bg px-4 py-14 sm:px-6 sm:py-16 lg:px-8 ${fontClass} ${sizeClass}`}>
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[220px_1fr]">
              <aside className="lg:sticky lg:top-32 lg:self-start">
                <div className="border-4 border-black bg-white p-5 shadow-[7px_7px_0_0_#000]">
                  <p className="mb-4 text-sm font-black uppercase tracking-[0.18em]">标签</p>
                  <div className="flex flex-wrap gap-3">
                    {article.tags.map((tag, index) => (
                      <Link href={`/articles?tag=${encodeURIComponent(tag)}`} key={tag}>
                        <StickerBadge tone={index % 2 === 0 ? "secondary" : "muted"}>
                          {tag}
                        </StickerBadge>
                      </Link>
                    ))}
                  </div>
                </div>

              </aside>

              <div className="grid gap-8">
                {article.sections.map((section, index) => (
                  <section className="border-4 border-black bg-white shadow-[9px_9px_0_0_#000]" key={section.heading}>
                    <div className={index % 2 === 0 ? "border-b-4 border-black bg-neo-muted p-5" : "border-b-4 border-black bg-neo-accent p-5"}>
                      <div className="mb-3 flex items-center gap-3">
                        <span className="grid h-12 w-12 place-items-center border-4 border-black bg-white text-xl font-black shadow-[4px_4px_0_0_#000]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Star aria-hidden="true" className="h-8 w-8 fill-black stroke-[4]" />
                      </div>
                      <h2 className="text-3xl font-black uppercase leading-none tracking-[0] sm:text-5xl">
                        {section.heading}
                      </h2>
                    </div>
                    <div className="grid gap-5 p-6 sm:p-8">
                      {section.body.map((paragraph) => (
                        <MarkdownText
                          content={paragraph}
                          className="text-xl font-bold leading-relaxed"
                          key={paragraph}
                        />
                      ))}
                      {section.callout ? (
                        <blockquote className="mt-2 rotate-[-1deg] border-4 border-black bg-neo-secondary p-5 text-2xl font-black leading-snug shadow-[7px_7px_0_0_#000]">
                          <Quote aria-hidden="true" className="mb-3 h-8 w-8 fill-black stroke-[4]" />
                          {section.callout}
                        </blockquote>
                      ) : null}
                    </div>
                  </section>
                ))}

                <section className="border-4 border-black bg-black p-6 text-white shadow-[9px_9px_0_0_#000] sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <Sparkles aria-hidden="true" className="h-9 w-9 fill-white stroke-[4]" />
                    <span className="text-sm font-black uppercase tracking-[0.18em]">下一声回响</span>
                  </div>
                  <h2 className="text-4xl font-black uppercase leading-none tracking-[0] sm:text-6xl">
                    把方法变成自己的工作流。
                  </h2>
                  <p className="mt-5 max-w-3xl text-xl font-bold leading-snug">
                    这篇文章已经被整理进 Echo Space。下一步可以拿一个真实研究对象跑一遍轻量档，再决定是否升级成标准档或深度档。
                  </p>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <NeoButton href="/" variant="secondary">
                      返回首页
                    </NeoButton>
                    <NeoButton href="/articles" variant="white">
                      全部文章
                    </NeoButton>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
