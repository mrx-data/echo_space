import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import type { Article } from "@/lib/content";

type ArticleListProps = {
  articles: Article[];
};

export function ArticleList({ articles }: ArticleListProps) {
  const [featured, ...rest] = articles;

  return (
    <div className="grid gap-10">
      {/* Featured article — hero card */}
      {featured && (
        <Link
          href={`/content/${featured.slug}`}
          className="group grid overflow-hidden rounded-[10px] border border-line bg-surface shadow-[0_12px_30px_rgba(31,29,24,0.08)] transition-shadow duration-200 hover:shadow-[0_20px_45px_rgba(31,29,24,0.12)] md:grid-cols-[1fr_1.15fr]"
        >
          {/* Left: cover image or color panel */}
          <div className="relative min-h-64">
            {featured.coverImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={featured.coverImage} alt={featured.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="flex h-full min-h-64 flex-col justify-between bg-surface-warm p-7">
                <div className="flex flex-wrap gap-2">
                  {featured.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-olive/10 px-3 py-1 text-[11px] font-medium text-olive"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {featured.highlight && (
                  <div className="mt-4">
                    <p
                      className="text-[22px] leading-snug text-ink"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                    >
                      &ldquo;{featured.highlight}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: content */}
          <div className="flex flex-col justify-between border-t border-line p-7 sm:p-10 md:border-t-0 md:border-l">
            <div>
              <div className="mb-4 flex flex-wrap gap-3 text-[11px] text-faint">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                  {featured.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                  {featured.readingTime}
                </span>
              </div>
              <h3
                className="text-[28px] leading-tight text-ink sm:text-[32px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                {featured.title}
              </h3>
              <p className="mt-4 text-[14px] leading-relaxed text-muted line-clamp-3">
                {featured.excerpt}
              </p>
            </div>
            <div className="mt-6 inline-flex w-fit items-center gap-2 text-[13px] font-medium text-olive transition-colors group-hover:text-olive-dark">
              阅读文章
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </div>
          </div>
        </Link>
      )}

      {/* Article grid */}
      {rest.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <Link
              href={`/content/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-[10px] border border-line bg-surface shadow-[0_12px_30px_rgba(31,29,24,0.08)] transition-shadow duration-200 hover:shadow-[0_20px_45px_rgba(31,29,24,0.12)]"
              key={article.slug}
            >
              {/* Thumbnail */}
              {article.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={article.coverImage} alt={article.title} className="h-52 w-full object-cover" />
              ) : (
                <div className="h-52 bg-gradient-to-br from-surface-warm to-line" />
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex flex-wrap gap-2">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-olive/10 px-2.5 py-0.5 text-[10px] font-medium text-olive"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3
                  className="text-[20px] leading-tight text-ink"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  {article.title}
                </h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-faint">
                  <span>{article.date}</span>
                  <span className="inline-flex items-center gap-1 text-olive transition-colors group-hover:text-olive-dark">
                    阅读
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
