import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-8 lg:px-8">
        <div>
          <Link href="/" className="block">
            <span
              className="text-[15px] leading-tight text-ink"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Echo Space
            </span>
          </Link>
          <p className="mt-2 max-w-md text-[12px] leading-relaxed text-faint">
            一个用于写作、观察与整理内心回声的个人知识库。
          </p>
        </div>
        <p className="text-[12px] text-faint">
          © {year} Echo Space. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
