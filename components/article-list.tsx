import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, MessageSquareText } from "lucide-react";
import { StickerBadge } from "@/components/sticker-badge";
import type { Article } from "@/lib/content";

type ArticleListProps = {
  articles: Article[];
};

const cardTones = [
  { bg: "bg-neo-muted", badge: "accent" as const },
  { bg: "bg-neo-accent", badge: "secondary" as const },
  { bg: "bg-neo-secondary", badge: "muted" as const },
];

export function ArticleList({ articles }: ArticleListProps) {
  const [featured, ...rest] = articles;

  return (
    <div className="grid gap-10">
      {/* Featured article — hero card */}
      {featured && (
        <Link
          href={`/content/${featured.slug}`}
          className="group grid overflow-hidden border-4 border-black bg-white shadow-[12px_12px_0_0_#000] transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[16px_16px_0_0_#000] md:grid-cols-[1fr_1.15fr]"
        >
          {/* Left: color panel */}
          <div className="neo-halftone min-h-64 border-b-4 border-black bg-neo-accent p-7 md:border-b-0 md:border-r-4">
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="flex flex-wrap gap-3">
                {featured.tags.slice(0, 3).map((tag) => (
                  <StickerBadge tone="white" key={tag}>
                    {tag}
                  </StickerBadge>
                ))}
              </div>
              <div className="rotate-[-2deg] border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000]">
                <MessageSquareText aria-hidden="true" className="mb-3 h-9 w-9 stroke-[4]" />
                <p className="text-xl font-black leading-tight">&ldquo;{featured.highlight}&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div className="flex flex-col justify-between p-7 sm:p-10">
            <div>
              <div className="mb-4 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.14em]">
                <span className="inline-flex items-center gap-2 border-4 border-black bg-neo-secondary px-3 py-2">
                  <CalendarDays aria-hidden="true" className="h-4 w-4 stroke-[4]" />
                  {featured.date}
                </span>
                <span className="inline-flex items-center gap-2 border-4 border-black bg-neo-muted px-3 py-2">
                  <Clock3 aria-hidden="true" className="h-4 w-4 stroke-[4]" />
                  {featured.readingTime}
                </span>
              </div>
              <h3 className="text-3xl font-black leading-none tracking-[0] sm:text-4xl lg:text-5xl">
                {featured.title}
              </h3>
              <p className="mt-4 text-lg font-bold leading-snug">{featured.excerpt}</p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 border-4 border-black bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[5px_5px_0_0_#000] transition duration-100 group-hover:-translate-y-0.5">
              进入文章
              <ArrowUpRight aria-hidden="true" className="h-5 w-5 stroke-[4]" />
            </div>
          </div>
        </Link>
      )}

      {/* Article grid */}
      {rest.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article, index) => {
            const tone = cardTones[index % cardTones.length];
            return (
              <Link
                href={`/content/${article.slug}`}
                className="group flex flex-col border-4 border-black bg-white shadow-[8px_8px_0_0_#000] transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]"
                key={article.slug}
              >
                <div className={`${tone.bg} border-b-4 border-black p-5`}>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {article.tags.slice(0, 2).map((tag) => (
                      <StickerBadge tone={tone.badge} key={tag} className="text-[10px] px-3 py-1">
                        {tag}
                      </StickerBadge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.14em]">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays aria-hidden="true" className="h-4 w-4 stroke-[4]" />
                      {article.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 aria-hidden="true" className="h-4 w-4 stroke-[4]" />
                      {article.readingTime}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-2xl font-black leading-tight tracking-[0]">
                    {article.title}
                  </h3>
                  <p className="mt-3 flex-1 text-base font-bold leading-snug line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 border-4 border-black bg-neo-bg px-4 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-[4px_4px_0_0_#000] transition duration-100 group-hover:-translate-y-0.5">
                    阅读全文
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 stroke-[4]" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
