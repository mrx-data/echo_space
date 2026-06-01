"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PenLine, Upload } from "lucide-react";
import { useRef } from "react";
import { LogoutButton } from "@/components/studio/logout-button";

// gray-matter is a CommonJS module; we use a dynamic import fallback
async function parseFrontmatter(raw: string) {
  const matter = (await import("gray-matter")).default;
  return matter(raw);
}

export function StudioHeader() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const raw = await file.text();
    const { data, content } = await parseFrontmatter(raw);

    // Build URL search params from frontmatter
    const params = new URLSearchParams();
    if (data.title) params.set("title", String(data.title));
    if (data.source || data.url) params.set("sourceUrl", String(data.source ?? data.url));
    if (data.author) params.set("sourceAuthor", String(data.author));
    if (data.created) params.set("date", String(data.created));
    if (Array.isArray(data.tags) && data.tags.length > 0) {
      params.set("tags", data.tags.join(","));
    }
    if (data.excerpt) params.set("excerpt", String(data.excerpt));
    if (data.status === "processed" || data.status === "draft") {
      // useful context but not directly mapped
    }

    // Store markdown content in sessionStorage (URL params have size limits)
    const importKey = `obsidian-import-${Date.now()}`;
    sessionStorage.setItem(importKey, content.trim());
    params.set("importKey", importKey);

    router.push(`/studio/articles/new?${params.toString()}`);

    // Reset the file input so the same file can be re-selected
    event.target.value = "";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e4db] bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/studio/articles"
          className="font-['Cormorant_Garamond',Georgia,serif] text-2xl font-semibold tracking-tight text-[#596044]"
        >
          Echo Studio
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/articles"
            className="hidden px-3 py-1.5 text-sm text-[#64645c] transition hover:text-[#171713] hover:underline sm:inline-flex"
          >
            公共文章
          </Link>
          <Link
            href="/studio/categories"
            className="hidden px-3 py-1.5 text-sm text-[#64645c] transition hover:text-[#171713] hover:underline sm:inline-flex"
          >
            分类
          </Link>
          {/* Hidden file input for MD import */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,markdown"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#485035] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#596044]"
          >
            <Upload aria-hidden="true" className="h-3.5 w-3.5" />
            导入MD
          </button>
          <Link
            href="/studio/articles/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#485035] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#596044]"
          >
            <PenLine aria-hidden="true" className="h-3.5 w-3.5" />
            新建
          </Link>
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
