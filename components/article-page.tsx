import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, Quote, Sparkles } from "lucide-react";
import { MarkdownText } from "@/components/markdown-text";
import { NeoButton } from "@/components/neo-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  const hasContentMd = Boolean(article.contentMd?.trim());

  return (
    <>
      <SiteHeader />
      <main>
        <article>
          {/* Article Header */}
          <header className="bg-canvas px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <Link
                href="/articles"
                className="mb-8 inline-flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-ink"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                全部文章
              </Link>

              {/* Category + Date label */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-olive">
                  {article.tags[0] ?? "文章"} · {article.date}
                </span>
              </div>

              {/* Title */}
              <h1
                className="max-w-4xl text-[36px] leading-[1.15] text-ink sm:text-[48px] lg:text-[56px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                {article.title}
              </h1>

              {/* Excerpt */}
              <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-muted">
                {article.excerpt}
              </p>

              {/* Author info */}
              <div className="mt-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-olive/20 to-line" />
                <div>
                  <p className="text-[13px] font-medium text-ink">Echo</p>
                  <p className="text-[11px] text-faint">{article.readingTime}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Hero image area */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              {article.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="h-64 w-full rounded-[8px] object-cover sm:h-80"
                />
              ) : (
                <div className="h-64 rounded-[8px] bg-gradient-to-br from-surface-warm to-line sm:h-80" />
              )}
            </div>
          </div>

          {/* Article Body with TOC */}
          <div className={`px-4 py-14 sm:px-6 sm:py-16 lg:px-8 ${fontClass} ${sizeClass}`}>
            <div className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-[160px_1fr]">
              {/* TOC Sidebar */}
              <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
                <p className="mb-4 text-[10px] font-medium uppercase tracking-wider text-faint">
                  On this page
                </p>
                <div className="relative border-l border-line pl-4">
                  {article.sections.map((section, index) => (
                    <div className="relative mb-3" key={index}>
                      <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-line" />
                      <span className="text-[11px] text-faint leading-relaxed">
                        {section.heading}
                      </span>
                    </div>
                  ))}
                </div>
              </aside>

              {/* Content */}
              <div className="grid gap-8">
                {hasContentMd ? (
                  <section className="rounded-[10px] border border-line bg-surface p-6 sm:p-8">
                    <MarkdownText
                      content={article.contentMd!}
                      className="text-[14px] leading-[1.8]"
                    />
                  </section>
                ) : (
                  article.sections.map((section, index) => (
                    <section className="grid gap-5" key={section.heading}>
                      <h2
                        className="text-[18px] leading-tight text-ink"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                      >
                        {section.heading}
                      </h2>
                      {section.body.map((paragraph) => (
                        <MarkdownText
                          content={paragraph}
                          className="text-[14px] leading-[1.8]"
                          key={paragraph}
                        />
                      ))}
                      {section.callout ? (
                        <blockquote className="border-l-3 border-olive py-2 pl-4 text-[15px] italic leading-relaxed text-muted"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          <Quote aria-hidden="true" className="mb-1 h-4 w-4 text-olive" />
                          {section.callout}
                        </blockquote>
                      ) : null}
                    </section>
                  ))
                )}

                {/* Author Card */}
                <section className="rounded-[10px] border border-line bg-surface p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-olive/20 to-line" />
                    <div>
                      <p className="text-[15px] font-medium text-ink">Echo</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted">
                        写作者、工具实践者，记录 AI 工作流和个人思考。
                      </p>
                      <Link
                        href="/#about"
                        className="mt-2 inline-flex items-center gap-1 text-[12px] text-olive transition-colors hover:text-olive-dark"
                      >
                        更多关于我 →
                      </Link>
                    </div>
                  </div>
                </section>

                {/* CTA Section */}
                <section className="rounded-[10px] bg-surface-warm p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <Sparkles aria-hidden="true" className="h-4 w-4 text-olive" />
                    <span className="text-[11px] font-medium uppercase tracking-wider text-olive">
                      下一声回响
                    </span>
                  </div>
                  <h2
                    className="mt-3 text-[24px] leading-tight text-ink sm:text-[28px]"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                  >
                    把方法变成自己的工作流。
                  </h2>
                  <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
                    这篇文章已经被整理进 Echo Space。下一步可以拿一个真实研究对象跑一遍轻量档，再决定是否升级。
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <NeoButton href="/" variant="outline" className="rounded-full">
                      返回首页
                    </NeoButton>
                    <NeoButton href="/articles" className="rounded-full">
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
