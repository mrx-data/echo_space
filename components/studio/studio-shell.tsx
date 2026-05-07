import Link from "next/link";
import { PenLine } from "lucide-react";
import { LogoutButton } from "@/components/studio/logout-button";

export function StudioHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-neo-bg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/studio/articles"
          className="-rotate-1 border-4 border-black bg-neo-accent px-4 py-2 text-xl font-black uppercase tracking-[0] shadow-[5px_5px_0_0_#000]"
        >
          Echo Studio
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/articles"
            className="hidden border-2 border-transparent px-3 py-2 text-sm font-black uppercase tracking-[0.16em] transition duration-100 hover:border-black hover:bg-neo-muted sm:inline-flex"
          >
            公共文章
          </Link>
          <Link
            href="/studio/categories"
            className="hidden border-2 border-transparent px-3 py-2 text-sm font-black uppercase tracking-[0.16em] transition duration-100 hover:border-black hover:bg-neo-secondary sm:inline-flex"
          >
            分类
          </Link>
          <Link
            href="/studio/articles/new"
            className="inline-flex min-h-12 items-center gap-2 border-4 border-black bg-neo-secondary px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000]"
          >
            <PenLine aria-hidden="true" className="h-4 w-4 stroke-[4]" />
            新建
          </Link>
          <LogoutButton />
        </div>
      </nav>
      <div className="border-t-4 border-black bg-black px-4 py-2 text-center text-xs font-black uppercase tracking-[0.22em] text-white">
        单人内容工作台 · Draft / Publish / Archive
      </div>
    </header>
  );
}
