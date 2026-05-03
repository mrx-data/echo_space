import { CalendarDays, Clock3, Quote, Star } from "lucide-react";
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
      <header className="neo-noise border-b-4 border-black bg-neo-secondary px-5 py-8">
        <div className="mb-3 inline-flex border-4 border-black bg-neo-accent px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] shadow-[3px_3px_0_0_#000]">
          预览模式
        </div>
        <h1 className="text-3xl font-black uppercase leading-none tracking-[0] sm:text-4xl lg:text-5xl">
          {article.title || "文章标题"}
        </h1>
        <p className="mt-4 border-4 border-black bg-white p-3 text-sm font-bold leading-snug shadow-[5px_5px_0_0_#000]">
          {article.excerpt || "文章摘要会显示在这里"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 border-4 border-black bg-black px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white">
            <CalendarDays aria-hidden="true" className="h-3 w-3 stroke-[4]" />
            {article.date || "2026-01-01"}
          </span>
          <span className="inline-flex items-center gap-1 border-4 border-black bg-neo-muted px-3 py-1 text-xs font-black uppercase tracking-[0.14em]">
            <Clock3 aria-hidden="true" className="h-3 w-3 stroke-[4]" />
            {article.readingTime || "5 min read"}
          </span>
        </div>
      </header>

      {/* Tags marquee */}
      {article.tags.length > 0 && (
        <div className="overflow-hidden border-y-4 border-black bg-black py-2 text-white">
          <div className="flex w-max items-center gap-4 whitespace-nowrap px-4 text-xs font-black uppercase tracking-[0.16em]">
            {[...article.tags, ...article.tags, ...article.tags].map((tag, i) => (
              <span className="flex items-center gap-4" key={`${tag}-${i}`}>
                {tag}
                <Star aria-hidden="true" className="h-4 w-4 fill-current stroke-[4]" />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="bg-neo-bg px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[160px_1fr]">
          {/* Sidebar */}
          <aside>
            {article.tags.length > 0 && (
              <div className="border-4 border-black bg-white p-3 shadow-[5px_5px_0_0_#000]">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em]">标签</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      className={`inline-flex border-4 border-black px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] shadow-[3px_3px_0_0_#000] transition duration-200 ease-out ${
                        index % 2 === 0 ? "bg-neo-secondary" : "bg-neo-muted"
                      }`}
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Sections */}
          <div className="grid gap-6">
            {article.sections.length === 0 ? (
              <div className="border-4 border-dashed border-black bg-white p-6 text-center">
                <p className="text-lg font-black">暂无章节内容</p>
                <p className="mt-2 text-sm font-bold">在左侧表单中添加章节后，预览会实时更新</p>
              </div>
            ) : (
              article.sections.map((section, index) => (
                <section className="border-4 border-black bg-white shadow-[7px_7px_0_0_#000]" key={index}>
                  <div className={index % 2 === 0 ? "border-b-4 border-black bg-neo-muted p-4" : "border-b-4 border-black bg-neo-accent p-4"}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center border-4 border-black bg-white text-sm font-black shadow-[3px_3px_0_0_#000]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Star aria-hidden="true" className="h-5 w-5 fill-black stroke-[4]" />
                    </div>
                    <h2 className="text-xl font-black uppercase leading-none tracking-[0] sm:text-2xl">
                      {section.heading || `章节 ${index + 1}`}
                    </h2>
                  </div>
                  <div className="grid gap-3 p-4 sm:p-5">
                    {section.body.filter((p) => p.trim()).length === 0 ? (
                      <p className="text-sm font-bold italic opacity-50">章节正文会显示在这里</p>
                    ) : (
                      section.body.filter((p) => p.trim()).map((paragraph, pi) => (
                        <MarkdownText
                          content={paragraph}
                          className="text-sm font-bold leading-relaxed"
                          key={pi}
                        />
                      ))
                    )}
                    {section.callout ? (
                      <blockquote className="mt-1 rotate-[-1deg] border-4 border-black bg-neo-secondary p-3 text-sm font-black leading-snug shadow-[5px_5px_0_0_#000]">
                        <Quote aria-hidden="true" className="mb-2 h-5 w-5 fill-black stroke-[4]" />
                        {section.callout}
                      </blockquote>
                    ) : null}
                  </div>
                </section>
              ))
            )}

            {/* Bottom CTA preview */}
            <section className="border-4 border-black bg-black p-4 text-white shadow-[7px_7px_0_0_#000] sm:p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em]">下一声回响</p>
              <h2 className="mt-2 text-2xl font-black uppercase leading-none tracking-[0] sm:text-3xl">
                把方法变成自己的工作流。
              </h2>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
