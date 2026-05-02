import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t-4 border-black bg-neo-secondary">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <div className="mb-4 inline-flex border-4 border-black bg-white px-4 py-2 text-2xl font-black uppercase shadow-[5px_5px_0_0_#000]">
            Echo Space
          </div>
          <p className="max-w-2xl text-lg font-bold leading-snug">
            一个把想法摊开、翻面、重新贴回墙上的个人空间。先保存回声，再判断它是否值得变成方向。
          </p>
        </div>
        <div className="flex flex-col items-start justify-end gap-3 md:items-end">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 border-4 border-black bg-neo-accent px-5 py-3 text-sm font-black uppercase tracking-[0.16em] shadow-[5px_5px_0_0_#000] transition duration-100 ease-linear active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            全部文章
            <ArrowUpRight aria-hidden="true" className="h-5 w-5 stroke-[4]" />
          </Link>
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em]">
            <Sparkles aria-hidden="true" className="h-5 w-5 fill-black stroke-[4]" />
            为最初的回声而建
          </p>
        </div>
      </div>
    </footer>
  );
}
