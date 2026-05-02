"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Hash,
  Layers,
  Loader2,
  Plus,
  Quote,
  Save,
  Trash2,
  Type,
} from "lucide-react";
import { ArticlePreview } from "@/components/article-preview";

type Section = {
  heading: string;
  body: string[];
  callout: string;
};

type ArticleForm = {
  title: string;
  slug: string;
  date: string;
  readingTime: string;
  tags: string;
  excerpt: string;
  highlight: string;
  sourceTitle: string;
  sourceAuthor: string;
  sourceUrl: string;
  sections: Section[];
};

const defaultForm: ArticleForm = {
  title: "",
  slug: "",
  date: new Date().toISOString().split("T")[0],
  readingTime: "5 min read",
  tags: "",
  excerpt: "",
  highlight: "",
  sourceTitle: "",
  sourceAuthor: "",
  sourceUrl: "",
  sections: [{ heading: "", body: [""], callout: "" }],
};

/** Convert a title to a URL-friendly slug (basic Latin conversion) */
function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[\u4e00-\u9fff]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function EditorPage() {
  const [form, setForm] = useState<ArticleForm>({ ...defaultForm });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const previewArticle = {
    title: form.title || "文章标题",
    excerpt: form.excerpt || "文章摘要会显示在这里",
    date: form.date,
    readingTime: form.readingTime,
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    sections: form.sections
      .filter((s) => s.heading)
      .map((s) => ({
        heading: s.heading,
        body: s.body,
        callout: s.callout || undefined,
      })),
  };

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      slug: form.slug,
      title: form.title,
      date: form.date,
      readingTime: form.readingTime,
      tags,
      excerpt: form.excerpt,
      highlight: form.highlight,
      source: {
        title: form.sourceTitle,
        author: form.sourceAuthor,
        url: form.sourceUrl,
      },
      sections: form.sections
        .filter((s) => s.heading)
        .map((s) => ({
          heading: s.heading,
          body: s.body.filter((p) => p.trim()),
          callout: s.callout || undefined,
        })),
    };

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error || "保存失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setSaving(false);
    }
  }

  function addSection() {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { heading: "", body: [""], callout: "" }],
    }));
  }

  function removeSection(index: number) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  }

  function updateSection(index: number, field: keyof Section, value: string | string[]) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  }

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-4 border-black bg-neo-bg">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="-rotate-1 border-4 border-black bg-neo-accent px-4 py-2 text-xl font-black uppercase tracking-[0] shadow-[5px_5px_0_0_#000] transition duration-100 ease-linear hover:rotate-0"
            aria-label="Echo Space 首页"
          >
            Echo Space
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              className="border-2 border-transparent px-3 py-2 text-sm font-black uppercase tracking-[0.16em] transition duration-100 hover:border-black hover:bg-neo-secondary"
              href="/"
            >
              首页
            </Link>
            <Link
              className="border-2 border-transparent px-3 py-2 text-sm font-black uppercase tracking-[0.16em] transition duration-100 hover:border-black hover:bg-neo-muted"
              href="/articles"
            >
              文章
            </Link>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex min-h-12 items-center gap-2 border-4 border-black px-5 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000] transition duration-100 ease-linear active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              saved
                ? "bg-green-400 text-black"
                : "bg-neo-secondary text-black hover:-translate-y-0.5"
            } disabled:opacity-60`}
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin stroke-[4]" />
            ) : saved ? (
              <Check className="h-5 w-5 stroke-[4]" />
            ) : (
              <Save className="h-5 w-5 stroke-[4]" />
            )}
            {saving ? "保存中…" : saved ? "已保存" : "保存文章"}
          </button>
        </nav>
        <div className="border-t-4 border-black bg-black px-4 py-2 text-center text-xs font-black uppercase tracking-[0.22em] text-white">
          <span className="inline-flex items-center gap-2">
            <FileText aria-hidden="true" className="h-4 w-4 stroke-[4]" />
            文章编辑器 · 左侧编写 · 右侧预览
          </span>
        </div>
      </header>

      <main className="min-h-screen bg-neo-bg">
        {/* Error banner */}
        {error && (
          <div className="border-b-4 border-black bg-neo-accent px-4 py-3 text-center text-sm font-black">
            {error}
          </div>
        )}

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          {/* === LEFT: FORM === */}
          <div className="grid gap-6">
            {/* Back button */}
            <Link
              href="/articles"
              className="inline-flex w-fit items-center gap-2 border-4 border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000] transition duration-100 ease-linear active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <ArrowLeft aria-hidden="true" className="h-5 w-5 stroke-[4]" />
              返回文章列表
            </Link>

            {/* Title badge */}
            <div className="inline-flex w-fit rotate-[-2deg] items-center gap-2 border-4 border-black bg-neo-secondary px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_0_#000]">
              <BookOpen aria-hidden="true" className="h-4 w-4 stroke-[4]" />
              新建文章
            </div>

            {/* Basic info section */}
            <div className="border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000]">
              <div className="mb-4 flex items-center gap-2">
                <Hash aria-hidden="true" className="h-5 w-5 stroke-[4]" />
                <h2 className="text-lg font-black uppercase tracking-[0.14em]">基本信息</h2>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="mb-1 block text-sm font-black uppercase tracking-[0.14em]">
                    文章标题 <span className="text-neo-accent">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        title,
                        slug: prev.slug === slugify(prev.title) || prev.slug === "" ? slugify(title) : prev.slug,
                      }));
                    }}
                    placeholder="输入文章标题"
                    className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-black uppercase tracking-[0.14em]">
                    URL Slug <span className="text-neo-accent">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="article-url-slug"
                    className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                  />
                  {form.slug && (
                    <p className="mt-1 text-xs font-bold opacity-50">
                      文章地址: /content/{form.slug}
                    </p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 flex items-center gap-1 text-sm font-black uppercase tracking-[0.14em]">
                      <CalendarDays className="h-4 w-4 stroke-[4]" />
                      发布日期
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                      className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 flex items-center gap-1 text-sm font-black uppercase tracking-[0.14em]">
                      <Clock3 className="h-4 w-4 stroke-[4]" />
                      阅读时间
                    </label>
                    <input
                      type="text"
                      value={form.readingTime}
                      onChange={(e) => setForm((prev) => ({ ...prev, readingTime: e.target.value }))}
                      placeholder="5 min read"
                      className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-black uppercase tracking-[0.14em]">
                    标签 <span className="font-bold opacity-50">(逗号分隔)</span>
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="AI, 深度研究, 知识工作流"
                    className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-black uppercase tracking-[0.14em]">
                    文章摘要 <span className="text-neo-accent">*</span>
                  </label>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="一句话概括文章核心内容"
                    rows={3}
                    className="w-full resize-none border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-black uppercase tracking-[0.14em]">
                    金句 / 亮点 <span className="text-neo-accent">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.highlight}
                    onChange={(e) => setForm((prev) => ({ ...prev, highlight: e.target.value }))}
                    placeholder="一句值得被记住的话"
                    className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                  />
                </div>
              </div>
            </div>

            {/* Source info */}
            <div className="border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000]">
              <div className="mb-4 flex items-center gap-2">
                <Layers aria-hidden="true" className="h-5 w-5 stroke-[4]" />
                <h2 className="text-lg font-black uppercase tracking-[0.14em]">来源信息</h2>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="mb-1 block text-sm font-black uppercase tracking-[0.14em]">
                    来源标题
                  </label>
                  <input
                    type="text"
                    value={form.sourceTitle}
                    onChange={(e) => setForm((prev) => ({ ...prev, sourceTitle: e.target.value }))}
                    placeholder="原文或参考来源标题"
                    className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-black uppercase tracking-[0.14em]">
                      作者
                    </label>
                    <input
                      type="text"
                      value={form.sourceAuthor}
                      onChange={(e) => setForm((prev) => ({ ...prev, sourceAuthor: e.target.value }))}
                      placeholder="作者名"
                      className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-black uppercase tracking-[0.14em]">
                      来源 URL
                    </label>
                    <input
                      type="url"
                      value={form.sourceUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, sourceUrl: e.target.value }))}
                      placeholder="https://"
                      className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sections editor */}
            <div className="border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type aria-hidden="true" className="h-5 w-5 stroke-[4]" />
                  <h2 className="text-lg font-black uppercase tracking-[0.14em]">
                    文章章节 ({form.sections.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addSection}
                  className="inline-flex items-center gap-2 border-4 border-black bg-neo-secondary px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[4px_4px_0_0_#000] transition duration-100 ease-linear active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  <Plus aria-hidden="true" className="h-4 w-4 stroke-[4]" />
                  添加章节
                </button>
              </div>
              <div className="grid gap-5">
                {form.sections.map((section, index) => (
                  <div className="border-4 border-black bg-neo-bg p-4" key={index}>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center border-4 border-black bg-neo-secondary text-sm font-black shadow-[3px_3px_0_0_#000]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-black uppercase tracking-[0.14em]">
                          章节 {index + 1}
                        </span>
                      </div>
                      {form.sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          className="inline-flex items-center gap-1 border-4 border-black bg-neo-accent px-3 py-1 text-xs font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_0_#000] transition duration-100 ease-linear active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        >
                          <Trash2 aria-hidden="true" className="h-3 w-3 stroke-[4]" />
                          删除
                        </button>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-black uppercase tracking-[0.14em]">
                          章节标题
                        </label>
                        <input
                          type="text"
                          value={section.heading}
                          onChange={(e) => updateSection(index, "heading", e.target.value)}
                          placeholder="输入章节标题"
                          className="w-full border-4 border-black bg-white px-3 py-2 text-sm font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-black uppercase tracking-[0.14em]">
                          章节正文
                        </label>
                        <div className="grid gap-2">
                          {section.body.map((paragraph, pi) => (
                            <div className="flex gap-2" key={pi}>
                              <textarea
                                value={paragraph}
                                onChange={(e) => {
                                  const newBody = [...section.body];
                                  newBody[pi] = e.target.value;
                                  updateSection(index, "body", newBody);
                                }}
                                placeholder={`段落 ${pi + 1}`}
                                rows={2}
                                className="min-h-[3rem] w-full resize-none border-4 border-black bg-white px-3 py-2 text-sm font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                              />
                              {section.body.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newBody = section.body.filter((_, i) => i !== pi);
                                    updateSection(index, "body", newBody);
                                  }}
                                  className="flex h-10 w-10 shrink-0 items-center justify-center border-4 border-black bg-neo-accent shadow-[3px_3px_0_0_#000] transition duration-100 ease-linear active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                                >
                                  <Trash2 aria-hidden="true" className="h-4 w-4 stroke-[4]" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => updateSection(index, "body", [...section.body, ""])}
                            className="inline-flex w-fit items-center gap-1 border-4 border-dashed border-black px-3 py-1 text-xs font-black uppercase tracking-[0.14em] transition duration-100 hover:border-solid hover:bg-neo-secondary"
                          >
                            <Plus aria-hidden="true" className="h-3 w-3 stroke-[4]" />
                            添加段落
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 flex items-center gap-1 text-xs font-black uppercase tracking-[0.14em]">
                          <Quote className="h-3 w-3 stroke-[4]" />
                          引用 (可选)
                        </label>
                        <input
                          type="text"
                          value={section.callout}
                          onChange={(e) => updateSection(index, "callout", e.target.value)}
                          placeholder="一句值得强调的话"
                          className="w-full border-4 border-black bg-white px-3 py-2 text-sm font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save button at bottom */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={`inline-flex min-h-14 flex-1 items-center justify-center gap-2 border-4 border-black px-6 py-3 text-base font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_0_#000] transition duration-100 ease-linear active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
                  saved
                    ? "bg-green-400 text-black"
                    : "bg-neo-secondary text-black hover:-translate-y-0.5"
                } disabled:opacity-60`}
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin stroke-[4]" />
                ) : saved ? (
                  <Check className="h-5 w-5 stroke-[4]" />
                ) : (
                  <Save className="h-5 w-5 stroke-[4]" />
                )}
                {saving ? "保存中…" : saved ? "已保存 ✓" : "保存文章"}
              </button>
            </div>
          </div>

          {/* === RIGHT: LIVE PREVIEW === */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="mb-3 inline-flex items-center gap-2 border-4 border-black bg-neo-muted px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_0_#000]">
                实时预览
              </div>
              <div className="max-h-[calc(100vh-10rem)] overflow-y-auto border-4 border-black bg-white shadow-[12px_12px_0_0_#000]">
                <ArticlePreview article={previewArticle} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
