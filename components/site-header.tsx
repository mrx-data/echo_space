import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex flex-col" aria-label="Echo Space 首页">
          <span
            className="text-[17px] leading-tight text-ink"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Echo Space
          </span>
          <span className="text-[10px] text-faint">
            个人知识库
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-[13px] font-bold text-ink transition-colors hover:text-olive"
          >
            首页
          </Link>
          <Link
            href="/articles"
            className="relative text-[13px] text-muted transition-colors hover:text-ink"
          >
            文章
          </Link>
          <Link
            href="/#about"
            className="text-[13px] text-muted transition-colors hover:text-ink"
          >
            关于
          </Link>
        </div>

        {/* Right CTA */}
        <Link
          href="mailto:2921108474@qq.com"
          className="inline-flex h-[34px] w-[136px] items-center justify-center rounded-full bg-olive-dark text-[13px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Let&apos;s connect
        </Link>
      </nav>
    </header>
  );
}
