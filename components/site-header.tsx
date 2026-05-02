import Link from "next/link";
import { Menu, PenLine } from "lucide-react";
import { NeoButton } from "@/components/neo-button";
import { featuredArticle } from "@/lib/content";

export function SiteHeader() {
  const articleHref = `/content/${featuredArticle.slug}`;

  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-neo-bg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="-rotate-1 border-4 border-black bg-neo-accent px-4 py-2 text-xl font-black uppercase tracking-[0] shadow-[5px_5px_0_0_#000] transition duration-100 ease-linear hover:rotate-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-neo-bg"
          aria-label="Echo Space 首页"
        >
          Echo Space
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          <Link className="border-2 border-transparent px-3 py-2 text-sm font-black uppercase tracking-[0.16em] transition duration-100 hover:border-black hover:bg-neo-secondary" href="/#about">
            关于
          </Link>
          <Link className="border-2 border-transparent px-3 py-2 text-sm font-black uppercase tracking-[0.16em] transition duration-100 hover:border-black hover:bg-neo-muted" href="/articles">
            文章
          </Link>
          <NeoButton href={articleHref} variant="secondary" className="min-h-12 px-4 py-2" showArrow={false}>
            阅读
          </NeoButton>
          <Link
            href="/editor"
            className="inline-flex min-h-12 items-center gap-2 border-4 border-black bg-neo-accent px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000] transition duration-100 ease-linear hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <PenLine aria-hidden="true" className="h-4 w-4 stroke-[4]" />
            写作
          </Link>
        </div>
        <Link
          href="/articles"
          className="flex h-14 w-14 items-center justify-center border-4 border-black bg-white shadow-[4px_4px_0_0_#000] transition duration-100 ease-linear focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-neo-bg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none md:hidden"
          aria-label="打开内容页"
        >
          <Menu aria-hidden="true" className="h-7 w-7 stroke-[4]" />
        </Link>
      </nav>
      <div className="border-t-4 border-black bg-black px-4 py-2 text-center text-xs font-black uppercase tracking-[0.22em] text-white">
        <span className="inline-flex items-center gap-2">
          <PenLine aria-hidden="true" className="h-4 w-4 stroke-[4]" />
          个人笔记，醒目的边框，诚实的思考。
        </span>
      </div>
    </header>
  );
}
