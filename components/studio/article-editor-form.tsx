"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  Hash,
  Image as ImageIcon,
  Layers,
  Loader2,
  Plus,
  Quote,
  Rocket,
  Save,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import { ArticlePreview } from "@/components/article-preview";
import { MarkdownText } from "@/components/markdown-text";
import type { ArticleDraftInput, ArticleRow, CategoryRow } from "@/lib/articles-db";
import type { ArticleFontFamily, ArticleFontSize } from "@/lib/content";

type SectionForm = {
  heading: string;
  body: string[];
  callout: string;
};

type ArticleForm = {
  title: string;
  slug: string;
  date: string;
  readingTime: string;
  tags: string[];
  excerpt: string;
  highlight: string;
  fontFamily: ArticleFontFamily;
  fontSize: ArticleFontSize;
  sourceTitle: string;
  sourceAuthor: string;
  sourceUrl: string;
  contentMd: string;
  coverImage: string;
  sections: SectionForm[];
};

type ButtonAction = "save" | "publish" | "unpublish" | "archive" | "permanent-delete";

type ArticleEditorFormProps = {
  articleId?: string;
  status?: ArticleRow["status"];
  initial?: ArticleDraftInput;
  categories?: CategoryRow[];
};

const emptyForm: ArticleForm = {
  title: "",
  slug: "",
  date: new Date().toISOString().split("T")[0],
  readingTime: "5 min read",
  tags: [],
  excerpt: "",
  highlight: "",
  fontFamily: "sans",
  fontSize: "base",
  sourceTitle: "",
  sourceAuthor: "",
  sourceUrl: "",
  contentMd: "",
  coverImage: "",
  sections: [{ heading: "", body: [""], callout: "" }],
};

function slugify(title: string): string {
  const hasChinese = /[\u4e00-\u9fff]/.test(title);
  if (hasChinese) {
    // For Chinese titles, use date + short hash from title
    const date = new Date().toISOString().split("T")[0];
    let hash = 0;
    for (const char of title) {
      hash = (hash * 31 + char.charCodeAt(0)) & 0xffffff;
    }
    return `${date}-${hash.toString(36)}`;
  }
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formFromInitial(initial?: ArticleDraftInput): ArticleForm {
  if (!initial) return { ...emptyForm };

  return {
    title: initial.title ?? "",
    slug: initial.slug ?? "",
    date: initial.date ?? emptyForm.date,
    readingTime: initial.readingTime ?? emptyForm.readingTime,
    tags: initial.tags ?? [],
    excerpt: initial.excerpt ?? "",
    highlight: initial.highlight ?? "",
    fontFamily: initial.fontFamily ?? "sans",
    fontSize: initial.fontSize ?? "base",
    sourceTitle: initial.source?.title ?? "",
    sourceAuthor: initial.source?.author ?? "",
    sourceUrl: initial.source?.url ?? "",
    contentMd: initial.contentMd ?? "",
    coverImage: initial.coverImage ?? "",
    sections:
      initial.sections && initial.sections.length > 0
        ? initial.sections.map((section) => ({
            heading: section.heading,
            body: section.body.length > 0 ? section.body : [""],
            callout: section.callout ?? "",
          }))
        : [{ heading: "", body: [""], callout: "" }],
  };
}

export function ArticleEditorForm({ articleId, status = "draft", initial, categories = [] }: ArticleEditorFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentId, setCurrentId] = useState(articleId);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [form, setForm] = useState<ArticleForm>(() => {
    // Check for Obsidian import data from URL params
    const importKey = searchParams.get("importKey");
    if (importKey && typeof window !== "undefined") {
      const contentMd = sessionStorage.getItem(importKey) ?? "";
      sessionStorage.removeItem(importKey);

      const tagsParam = searchParams.get("tags");
      const tags = tagsParam ? tagsParam.split(",").map((t) => t.trim()).filter(Boolean) : [];

      return {
        ...emptyForm,
        title: searchParams.get("title") ?? "",
        slug: searchParams.get("title") ? slugify(searchParams.get("title") ?? "") : "",
        date: searchParams.get("date") ?? emptyForm.date,
        tags,
        excerpt: searchParams.get("excerpt") ?? "",
        sourceUrl: searchParams.get("sourceUrl") ?? "",
        sourceAuthor: searchParams.get("sourceAuthor") ?? "",
        coverImage: "",
        contentMd,
      };
    }
    return formFromInitial(initial);
  });
  const [activeAction, setActiveAction] = useState<ButtonAction | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [splitRatio, setSplitRatio] = useState(55);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Determine editing mode: markdown (imported) or sections (manual)
  const isMarkdownMode = form.contentMd.length > 0 || (!initial && searchParams.get("importKey") !== null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const ratio = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitRatio(Math.min(80, Math.max(25, ratio)));
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const tags = form.tags;
  const categoryOptions = [
    ...categories.map((category) => category.name),
    ...tags.filter((tag) => !categories.some((category) => category.name === tag)),
  ];

  const previewArticle = {
    title: form.title || "文章标题",
    excerpt: form.excerpt || "文章摘要会显示在这里",
    date: form.date,
    readingTime: form.readingTime,
    tags,
    fontFamily: form.fontFamily,
    fontSize: form.fontSize,
    contentMd: form.contentMd || undefined,
    coverImage: form.coverImage || undefined,
    sections: form.sections
      .filter((section) => section.heading || section.body.some((paragraph) => paragraph.trim()))
      .map((section) => ({
        heading: section.heading,
        body: section.body,
        callout: section.callout || undefined,
      })),
  };

  function buildPayload(): ArticleDraftInput {
    return {
      slug: form.slug,
      title: form.title,
      date: form.date,
      readingTime: form.readingTime,
      tags,
      excerpt: form.excerpt,
      highlight: form.highlight,
      fontFamily: form.fontFamily,
      fontSize: form.fontSize,
      source: {
        title: form.sourceTitle,
        author: form.sourceAuthor,
        url: form.sourceUrl,
      },
      contentMd: form.contentMd || undefined,
      coverImage: form.coverImage || undefined,
      sections: form.sections.map((section) => ({
        heading: section.heading,
        body: section.body,
        callout: section.callout || undefined,
      })),
    };
  }

  function toggleCategory(category: string) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(category)
        ? prev.tags.filter((tag) => tag !== category)
        : [...prev.tags, category],
    }));
  }

  async function saveDraft() {
    setActiveAction("save");
    setError("");
    setMessage("");

    try {
      const response = await fetch(currentId ? `/api/admin/articles/${currentId}` : "/api/admin/articles", {
        method: currentId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "保存失败");
      }

      setMessage("草稿已保存");
      setCurrentId(data.article.id);
      setCurrentStatus(data.article.status);
      if (!currentId) {
        router.replace(`/studio/articles/${data.article.id}`);
      }
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "保存失败");
    } finally {
      setActiveAction(null);
    }
  }

  async function mutate(action: "publish" | "unpublish" | "archive") {
    let id = currentId;

    // Always auto-save before any mutation to ensure latest content is persisted
    setActiveAction("save");
    try {
      const saveUrl = id ? `/api/admin/articles/${id}` : "/api/admin/articles";
      const saveMethod = id ? "PATCH" : "POST";
      const response = await fetch(saveUrl, {
        method: saveMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "保存失败");
      }
      setCurrentId(data.article.id);
      setCurrentStatus(data.article.status);
      id = data.article.id;
      if (!currentId) {
        router.replace(`/studio/articles/${data.article.id}`);
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "保存失败");
      setActiveAction(null);
      return;
    }

    setActiveAction(action);
    setError("");
    setMessage("");

    const url =
      action === "archive"
        ? `/api/admin/articles/${id}`
        : `/api/admin/articles/${id}/${action}`;

    try {
      const response = await fetch(url, { method: action === "archive" ? "DELETE" : "POST" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "操作失败");
      }

      setCurrentStatus(data.article.status);
      setMessage(action === "publish" ? "已发布" : action === "unpublish" ? "已取消发布" : "已归档");
      router.refresh();
      if (action === "archive") {
        router.push("/studio/articles");
      }
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "操作失败");
    } finally {
      setActiveAction(null);
    }
  }

  async function permanentDelete() {
    const id = currentId;
    if (!id) return;

    const confirmed = window.confirm("确定要永久删除这篇文章吗？此操作不可撤销。");
    if (!confirmed) return;

    setActiveAction("permanent-delete");
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/articles/${id}?permanent=true`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "删除失败");
      }

      setMessage("文章已永久删除");
      router.push("/studio/articles");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "删除失败");
    } finally {
      setActiveAction(null);
    }
  }

  function addSection() {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { heading: "", body: [""], callout: "" }],
    }));
  }

  function updateSection(index: number, field: keyof SectionForm, value: string | string[]) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section,
      ),
    }));
  }

  function switchToSectionsMode() {
    // Convert markdown to a single section for editing
    if (form.contentMd) {
      setForm((prev) => ({
        ...prev,
        contentMd: "",
        sections: [{ heading: prev.title || "", body: [prev.contentMd], callout: "" }],
      }));
    }
  }

  function switchToMarkdownMode() {
    // Convert sections to markdown
    if (form.sections.length > 0) {
      const md = form.sections
        .map((section) => {
          const heading = section.heading ? `## ${section.heading}\n\n` : "";
          const body = section.body.filter((p) => p.trim()).join("\n\n");
          const callout = section.callout ? `\n\n> ${section.callout}` : "";
          return `${heading}${body}${callout}`;
        })
        .filter((s) => s.trim())
        .join("\n\n");
      setForm((prev) => ({
        ...prev,
        contentMd: md,
        sections: [{ heading: "", body: [""], callout: "" }],
      }));
    }
  }

  const inputCls = "w-full rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] px-4 py-2.5 text-sm text-[#171713] placeholder:text-[#9a988f] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20";
  const labelCls = "text-xs font-medium uppercase tracking-wide text-[#64645c]";

  return (
    <div ref={containerRef} className="mx-auto flex max-w-7xl gap-0 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 pr-4" style={{ width: showPreview ? `${splitRatio}%` : "100%" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/studio/articles"
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#e8e4db] bg-white px-4 py-2 text-sm text-[#64645c] transition hover:border-[#171713] hover:text-[#171713]"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            返回列表
          </Link>
          <span className="rounded-full bg-[#596044]/10 px-3 py-1 text-xs font-medium text-[#596044]">
            {currentStatus}
          </span>
        </div>

        {(error || message) && (
          <div
            className={`rounded-[10px] border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-[#e8e4db] bg-[#f7f5f0] text-[#596044]"
            }`}
          >
            {error || message}
          </div>
        )}

        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#596044]/10 px-4 py-2 text-xs font-medium text-[#596044]">
          <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
          {currentId ? "编辑文章" : "新建文章"}
          {isMarkdownMode && (
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-[#596044]/20 px-2 py-0.5 text-[10px]">
              <FileText className="h-2.5 w-2.5" />
              MD模式
            </span>
          )}
        </div>

        {/* Basic info section */}
        <div className="editorial-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Hash aria-hidden="true" className="h-4 w-4 text-[#596044]" />
            <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-xl font-semibold text-[#596044]">基本信息</h2>
          </div>
          <div className="grid gap-4">
            <label className="grid gap-1.5">
              <span className={labelCls}>文章标题</span>
              <input
                type="text"
                value={form.title}
                onChange={(event) => {
                  const title = event.target.value;
                  setForm((prev) => ({
                    ...prev,
                    title,
                    slug: prev.slug === slugify(prev.title) || prev.slug === "" ? slugify(title) : prev.slug,
                  }));
                }}
                className={inputCls}
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>URL Slug</span>
              <input
                type="text"
                value={form.slug}
                onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                placeholder="article-url-slug"
                className={inputCls}
              />
              {form.slug ? <span className="text-xs text-[#9a988f]">/content/{form.slug}</span> : null}
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className={`inline-flex items-center gap-1 ${labelCls}`}>
                  <CalendarDays className="h-3 w-3" />
                  日期
                </span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                  className={inputCls}
                />
              </label>
              <label className="grid gap-1.5">
                <span className={`inline-flex items-center gap-1 ${labelCls}`}>
                  <Clock3 className="h-3 w-3" />
                  阅读时间
                </span>
                <input
                  type="text"
                  value={form.readingTime}
                  onChange={(event) => setForm((prev) => ({ ...prev, readingTime: event.target.value }))}
                  className={inputCls}
                />
              </label>
            </div>
            <div className="grid gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={labelCls}>分类</span>
                <Link href="/studio/categories" className="text-xs text-[#596044] hover:underline">
                  管理分类
                </Link>
              </div>
              {categoryOptions.length > 0 ? (
                <div className="flex flex-wrap gap-2 rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] p-4">
                  {categoryOptions.map((category) => {
                    const checked = tags.includes(category);
                    const isKnownCategory = categories.some((item) => item.name === category);
                    return (
                      <label
                        key={category}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          checked
                            ? "border-[#596044] bg-[#596044] text-white"
                            : "border-[#e8e4db] bg-white text-[#64645c] hover:border-[#596044]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(category)}
                          className="sr-only"
                        />
                        {category}
                        {!isKnownCategory ? <span className="text-[10px] opacity-60">历史</span> : null}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] p-4 text-sm text-[#9a988f]">
                  还没有分类。请先到分类管理页创建分类，再回到这里选择。
                </div>
              )}
            </div>
            <label className="grid gap-1.5">
              <span className={labelCls}>文章摘要</span>
              <textarea
                value={form.excerpt}
                onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>金句 / 亮点</span>
              <input
                type="text"
                value={form.highlight}
                onChange={(event) => setForm((prev) => ({ ...prev, highlight: event.target.value }))}
                className={inputCls}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className={labelCls}>正文字体</span>
                <select
                  value={form.fontFamily}
                  onChange={(event) => setForm((prev) => ({ ...prev, fontFamily: event.target.value as ArticleFontFamily }))}
                  className={inputCls}
                >
                  <option value="sans">黑体（Sans）</option>
                  <option value="serif">宋体（Serif）</option>
                  <option value="mono">等宽（Mono）</option>
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className={labelCls}>正文字号</span>
                <select
                  value={form.fontSize}
                  onChange={(event) => setForm((prev) => ({ ...prev, fontSize: event.target.value as ArticleFontSize }))}
                  className={inputCls}
                >
                  <option value="sm">小（14px）</option>
                  <option value="base">标准（16px）</option>
                  <option value="lg">大（18px）</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* Source info section */}
        <div className="editorial-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Layers aria-hidden="true" className="h-4 w-4 text-[#596044]" />
            <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-xl font-semibold text-[#596044]">来源信息</h2>
          </div>
          <div className="grid gap-4">
            <input
              type="text"
              value={form.sourceTitle}
              onChange={(event) => setForm((prev) => ({ ...prev, sourceTitle: event.target.value }))}
              placeholder="来源标题"
              className={inputCls}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                value={form.sourceAuthor}
                onChange={(event) => setForm((prev) => ({ ...prev, sourceAuthor: event.target.value }))}
                placeholder="作者"
                className={inputCls}
              />
              <input
                type="url"
                value={form.sourceUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, sourceUrl: event.target.value }))}
                placeholder="https://"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Cover image section */}
        <div className="editorial-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <ImageIcon aria-hidden="true" className="h-4 w-4 text-[#596044]" />
            <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-xl font-semibold text-[#596044]">封面图片</h2>
          </div>

          {/* Current cover preview */}
          {form.coverImage && (
            <div className="mb-4 overflow-hidden rounded-[10px] border border-[#e8e4db]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.coverImage} alt="封面预览" className="h-48 w-full object-cover" />
            </div>
          )}

          {/* Default covers */}
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#64645c]">默认封面</p>
          <div className="mb-4 grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, coverImage: `/covers/cover-${i}.svg` }))}
                className={`overflow-hidden rounded-[10px] border-2 transition ${
                  form.coverImage === `/covers/cover-${i}.svg`
                    ? "border-[#596044] ring-2 ring-[#596044]/20"
                    : "border-[#e8e4db] hover:border-[#b6b391]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/covers/cover-${i}.svg`} alt={`封面 ${i}`} className="h-16 w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Upload button */}
          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e8e4db] bg-white px-4 py-2 text-sm font-medium text-[#171713] transition hover:bg-[#f7f5f0]">
              <Upload className="h-4 w-4" />
              上传自定义封面
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("file", file);
                  try {
                    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                    const data = await res.json();
                    if (res.ok && data.url) {
                      setForm((prev) => ({ ...prev, coverImage: data.url }));
                    } else {
                      alert(data.error ?? "上传失败");
                    }
                  } catch {
                    alert("上传失败");
                  }
                  e.target.value = "";
                }}
              />
            </label>
            {form.coverImage && (
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, coverImage: "" }))}
                className="text-xs font-medium text-[#9a988f] hover:text-[#64645c]"
              >
                清除封面
              </button>
            )}
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={switchToMarkdownMode}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
              isMarkdownMode
                ? "border-[#596044] bg-[#596044] text-white"
                : "border-[#e8e4db] bg-white text-[#64645c] hover:border-[#596044]"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Markdown模式
          </button>
          <button
            type="button"
            onClick={switchToSectionsMode}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
              !isMarkdownMode
                ? "border-[#596044] bg-[#596044] text-white"
                : "border-[#e8e4db] bg-white text-[#64645c] hover:border-[#596044]"
            }`}
          >
            <Type className="h-3.5 w-3.5" />
            章节模式
          </button>
        </div>

        {/* Content editor: Markdown mode or Sections mode */}
        {isMarkdownMode ? (
          <div className="editorial-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <FileText aria-hidden="true" className="h-4 w-4 text-[#596044]" />
              <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-xl font-semibold text-[#596044]">Markdown 正文</h2>
            </div>
            <textarea
              value={form.contentMd}
              onChange={(event) => setForm((prev) => ({ ...prev, contentMd: event.target.value }))}
              placeholder={"在这里输入 Markdown 内容...\n\n支持：标题、列表、表格、代码块、引用、加粗、斜体等\n支持 Obsidian 语法：[[wikilink]]、> [!note] callout"}
              rows={24}
              className="min-h-[30rem] w-full resize-y rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] px-4 py-3 font-mono text-sm leading-relaxed text-[#171713] placeholder:text-[#9a988f] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
            />
            <p className="mt-2 text-xs text-[#9a988f]">
              支持 Obsidian 语法：[[wikilink]]、&gt; [!note]、&gt; [!warning] 等 callout
            </p>
          </div>
        ) : (
          <div className="editorial-card p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Type aria-hidden="true" className="h-4 w-4 text-[#596044]" />
                <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-xl font-semibold text-[#596044]">
                  章节 ({form.sections.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={addSection}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e4db] bg-white px-3 py-1.5 text-xs text-[#64645c] transition hover:border-[#596044] hover:text-[#596044]"
              >
                <Plus aria-hidden="true" className="h-3 w-3" />
                添加
              </button>
            </div>
            <div className="grid gap-5">
              {form.sections.map((section, index) => (
                <div className="rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] p-4" key={index}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#64645c]">章节 {index + 1}</span>
                    {form.sections.length > 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            sections: prev.sections.filter((_, sectionIndex) => sectionIndex !== index),
                          }))
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-[#e8e4db] bg-white px-2.5 py-1 text-[10px] text-[#9a988f] transition hover:border-red-300 hover:text-red-600"
                      >
                        <Trash2 aria-hidden="true" className="h-2.5 w-2.5" />
                        删除
                      </button>
                    ) : null}
                  </div>
                  <div className="grid gap-3">
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(event) => updateSection(index, "heading", event.target.value)}
                      placeholder="章节标题"
                      className="w-full rounded-[10px] border border-[#e8e4db] bg-white px-3 py-2 text-sm text-[#171713] placeholder:text-[#9a988f] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
                    />
                    {section.body.map((paragraph, paragraphIndex) => (
                      <div className="flex gap-2" key={paragraphIndex}>
                        <div className="flex-1">
                          <textarea
                            value={paragraph}
                            onChange={(event) => {
                              const nextBody = [...section.body];
                              nextBody[paragraphIndex] = event.target.value;
                              updateSection(index, "body", nextBody);
                            }}
                            placeholder={`段落 ${paragraphIndex + 1}（支持 Markdown）`}
                            rows={3}
                            className="min-h-[4.5rem] w-full resize-none rounded-[10px] border border-[#e8e4db] bg-white px-3 py-2 font-mono text-sm text-[#171713] placeholder:text-[#9a988f] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
                          />
                          {paragraphIndex === 0 && section.body.length === 1 && !paragraph && (
                            <p className="mt-1 text-[10px] text-[#9a988f]">
                              **粗体** *斜体* `代码` [链接](url) - 列表 &gt; 引用 ```代码块```
                            </p>
                          )}
                        </div>
                        {section.body.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => updateSection(index, "body", section.body.filter((_, bodyIndex) => bodyIndex !== paragraphIndex))}
                            className="flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-full border border-[#e8e4db] bg-white text-[#9a988f] transition hover:border-red-300 hover:text-red-600"
                            aria-label="删除段落"
                          >
                            <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => updateSection(index, "body", [...section.body, ""])}
                      className="inline-flex w-fit items-center gap-1 rounded-full border border-dashed border-[#e8e4db] px-3 py-1 text-xs text-[#9a988f] transition hover:border-[#596044] hover:text-[#596044]"
                    >
                      <Plus aria-hidden="true" className="h-3 w-3" />
                      添加段落
                    </button>
                    <label className="grid gap-1.5">
                      <span className={`inline-flex items-center gap-1 ${labelCls}`}>
                        <Quote className="h-3 w-3" />
                        引用
                      </span>
                      <input
                        type="text"
                        value={section.callout}
                        onChange={(event) => updateSection(index, "callout", event.target.value)}
                        className="w-full rounded-[10px] border border-[#e8e4db] bg-white px-3 py-2 text-sm text-[#171713] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={saveDraft}
            disabled={activeAction !== null}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#485035] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#596044] disabled:opacity-50"
          >
            {activeAction === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            保存草稿
          </button>
          <button
            type="button"
            onClick={() => mutate("publish")}
            disabled={activeAction !== null}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#596044] bg-[#596044] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#485035] disabled:opacity-50"
          >
            {activeAction === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            发布
          </button>
          <button
            type="button"
            onClick={() => mutate("unpublish")}
            disabled={activeAction !== null || currentStatus !== "published"}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e8e4db] bg-white px-5 py-3 text-sm text-[#64645c] transition hover:border-[#171713] hover:text-[#171713] disabled:opacity-40"
          >
            {activeAction === "unpublish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <EyeOff className="h-4 w-4" />}
            下线
          </button>
          <button
            type="button"
            onClick={() => mutate("archive")}
            disabled={activeAction !== null || !currentId}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e8e4db] bg-white px-5 py-3 text-sm text-[#9a988f] transition hover:border-[#171713] hover:text-[#171713] disabled:opacity-40"
          >
            {activeAction === "archive" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            归档
          </button>
        </div>

        {currentId && (
          <button
            type="button"
            onClick={permanentDelete}
            disabled={activeAction !== null}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-dashed border-[#e8e4db] bg-white px-4 py-2 text-xs text-[#9a988f] transition hover:border-red-300 hover:text-red-600 disabled:opacity-40"
          >
            {activeAction === "permanent-delete" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            永久删除
          </button>
        )}
      </div>

      {/* Drag handle */}
      {showPreview && (
        <div
          onMouseDown={handleDragStart}
          className="hidden w-3 shrink-0 cursor-col-resize items-center justify-center bg-[#f7f5f0] transition-colors hover:bg-[#e8e4db] lg:flex"
        >
          <div className="h-12 w-1 rounded-full bg-[#e8e4db]" />
        </div>
      )}

      {/* Preview panel */}
      {showPreview && (
        <div className="hidden lg:block" style={{ width: `${100 - splitRatio}%` }}>
          <div className="sticky top-28">
            <div className="mb-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreview((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e4db] bg-white px-3 py-1.5 text-xs text-[#64645c] transition hover:border-[#171713] hover:text-[#171713]"
              >
                <EyeOff aria-hidden="true" className="h-3 w-3" />
                隐藏预览
              </button>
              <span className="text-xs text-[#9a988f]">拖拽中间分隔条调整比例</span>
            </div>
            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto rounded-[10px] border border-[#e8e4db] bg-white shadow-[0_12px_30px_rgba(31,29,24,0.08)]">
              <ArticlePreview article={previewArticle} />
            </div>
          </div>
        </div>
      )}

      {/* Show preview button when hidden */}
      {!showPreview && (
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="fixed right-6 top-28 z-40 inline-flex items-center gap-1.5 rounded-full border border-[#e8e4db] bg-white px-3 py-1.5 text-xs text-[#64645c] shadow-[0_4px_12px_rgba(31,29,24,0.08)] transition hover:border-[#171713] hover:text-[#171713]"
        >
          <Eye aria-hidden="true" className="h-3 w-3" />
          显示预览
        </button>
      )}
    </div>
  );
}
