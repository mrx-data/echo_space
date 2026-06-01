import { CalendarDays, Clock3, Quote } from "lucide-react";
import { MarkdownText } from "@/components/markdown-text";
import type { ArticleFontFamily, ArticleFontSize } from "@/lib/content";

type Section = {
  heading: string;
  body: string[];
  callout?: string;
};

type ArticlePreviewProps = {
  article: {
    title: string;
    excerpt: string;
    date: string;
    readingTime: string;
    tags: string[];
    contentMd?: string;
    coverImage?: string;
    sections: Section[];
    fontFamily?: ArticleFontFamily;
    fontSize?: ArticleFontSize;
  };
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

export function ArticlePreview({ article }: ArticlePreviewProps) {
  const fontClass = getFontClass(article.fontFamily);
  const sizeClass = getSizeClass(article.fontSize);

  return (
    <div className={`pointer-events-none select-none ${fontClass} ${sizeClass}`}>
      {/* Article header */}
      <header className="bg-surface-warm px-5 py-8">
        <div className="mb-3 inline-flex rounded-full bg-olive/10 px-3 py-1 text-[10px] font-medium text-olive">
          预览模式
        </div>
        <h1
          className="text-[28px] leading-tight text-ink sm:text-[36px]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          {article.title || "文章标题"}
        </h1>
        <p className="mt-4 text-[14px] leading-relaxed text-muted">
          {article.excerpt || "文章摘要会显示在这里"}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-faint">
          <span className="inline-flex items-center gap-1">
            <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
            {article.date || "2026-01-01"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
            {article.readingTime || "5 min read"}
          </span>
        </div>
      </header>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="border-y border-line bg-surface py-2">
          <div className="flex flex-wrap items-center gap-2 px-5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-olive/10 px-2.5 py-0.5 text-[10px] font-medium text-olive"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cover image preview */}
      {article.coverImage && (
        <div className="px-4 py-4">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[8px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.coverImage} alt="封面预览" className="h-48 w-full object-cover" />
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="bg-canvas px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[160px_1fr]">
          {/* Sidebar */}
          <aside>
            {article.tags.length > 0 && (
              <div className="rounded-[10px] border border-line bg-surface p-4">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-faint">标签</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      className="inline-flex items-center rounded-full bg-surface-warm px-2.5 py-0.5 text-[10px] font-medium text-muted"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Content: markdown or sections */}
          <div className="grid gap-6">
            {article.contentMd ? (
              <section className="rounded-[10px] border border-line bg-surface p-5">
                <MarkdownText content={article.contentMd} className="text-[13px] leading-relaxed" />
              </section>
            ) : article.sections.length === 0 ? (
              <div className="rounded-[10px] border border-dashed border-line bg-surface p-6 text-center">
                <p
                  className="text-[18px] text-ink"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  暂无章节内容
                </p>
                <p className="mt-2 text-[13px] text-muted">在左侧表单中添加章节后，预览会实时更新</p>
              </div>
            ) : (
              article.sections.map((section, index) => (
                <section className="rounded-[10px] border border-line bg-surface" key={index}>
                  <div className="border-b border-line bg-surface-warm p-4">
                    <p
                      className="text-[20px] leading-tight text-ink"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                    >
                      {section.heading || `章节 ${index + 1}`}
                    </p>
                  </div>
                  <div className="grid gap-3 p-4 sm:p-5">
                    {section.body.filter((p) => p.trim()).length === 0 ? (
                      <p className="text-[13px] italic text-faint">章节正文会显示在这里</p>
                    ) : (
                      section.body.filter((p) => p.trim()).map((paragraph, pi) => (
                        <MarkdownText
                          content={paragraph}
                          className="text-[13px] leading-relaxed"
                          key={pi}
                        />
                      ))
                    )}
                    {section.callout ? (
                      <blockquote className="mt-1 border-l-3 border-olive py-2 pl-4 text-[13px] italic text-muted">
                        <Quote aria-hidden="true" className="mb-1 h-4 w-4 text-olive" />
                        {section.callout}
                      </blockquote>
                    ) : null}
                  </div>
                </section>
              ))
            )}

            {/* Bottom CTA preview */}
            <section className="rounded-[10px] bg-surface-warm p-5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-olive">下一声回响</p>
              <h2
                className="mt-2 text-[22px] leading-tight text-ink"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                把方法变成自己的工作流。
              </h2>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
