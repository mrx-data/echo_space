"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  Eye,
  EyeOff,
  Hash,
  Layers,
  Loader2,
  Plus,
  Quote,
  Rocket,
  Save,
  Trash2,
  Type,
} from "lucide-react";
import { ArticlePreview } from "@/components/article-preview";
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
  sections: [{ heading: "", body: [""], callout: "" }],
};

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[\u4e00-\u9fff]+/g, "-")
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
  const [currentId, setCurrentId] = useState(articleId);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [form, setForm] = useState<ArticleForm>(() => formFromInitial(initial));
  const [activeAction, setActiveAction] = useState<ButtonAction | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [splitRatio, setSplitRatio] = useState(55);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

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
    const id = currentId;
    if (!id) {
      await saveDraft();
      setError("请先保存草稿，再执行发布操作");
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

  return (
    <div ref={containerRef} className="mx-auto flex max-w-7xl gap-0 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 pr-4" style={{ width: showPreview ? `${splitRatio}%` : "100%" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/studio/articles"
            className="inline-flex w-fit items-center gap-2 border-4 border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000]"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5 stroke-[4]" />
            返回列表
          </Link>
          <span className="border-4 border-black bg-neo-muted px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[4px_4px_0_0_#000]">
            {currentStatus}
          </span>
        </div>

        {(error || message) && (
          <div className={`border-4 border-black px-4 py-3 text-sm font-black ${error ? "bg-neo-accent" : "bg-neo-secondary"}`}>
            {error || message}
          </div>
        )}

        <div className="inline-flex w-fit rotate-[-2deg] items-center gap-2 border-4 border-black bg-neo-secondary px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_0_#000]">
          <BookOpen aria-hidden="true" className="h-4 w-4 stroke-[4]" />
          {currentId ? "编辑文章" : "新建文章"}
        </div>

        <div className="border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000]">
          <div className="mb-4 flex items-center gap-2">
            <Hash aria-hidden="true" className="h-5 w-5 stroke-[4]" />
            <h2 className="text-lg font-black uppercase tracking-[0.14em]">基本信息</h2>
          </div>
          <div className="grid gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-black uppercase tracking-[0.14em]">文章标题</span>
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
                className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-black uppercase tracking-[0.14em]">URL Slug</span>
              <input
                type="text"
                value={form.slug}
                onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                placeholder="article-url-slug"
                className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
              />
              {form.slug ? <span className="text-xs font-bold opacity-60">/content/{form.slug}</span> : null}
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="inline-flex items-center gap-1 text-sm font-black uppercase tracking-[0.14em]">
                  <CalendarDays className="h-4 w-4 stroke-[4]" />
                  日期
                </span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                  className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                />
              </label>
              <label className="grid gap-1">
                <span className="inline-flex items-center gap-1 text-sm font-black uppercase tracking-[0.14em]">
                  <Clock3 className="h-4 w-4 stroke-[4]" />
                  阅读时间
                </span>
                <input
                  type="text"
                  value={form.readingTime}
                  onChange={(event) => setForm((prev) => ({ ...prev, readingTime: event.target.value }))}
                  className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                />
              </label>
            </div>
            <div className="grid gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-black uppercase tracking-[0.14em]">分类</span>
                <Link href="/studio/categories" className="text-xs font-black uppercase tracking-[0.14em] underline decoration-4 underline-offset-4">
                  管理分类
                </Link>
              </div>
              {categoryOptions.length > 0 ? (
                <div className="flex flex-wrap gap-3 border-4 border-black bg-neo-bg p-4">
                  {categoryOptions.map((category) => {
                    const checked = tags.includes(category);
                    const isKnownCategory = categories.some((item) => item.name === category);
                    return (
                      <label
                        key={category}
                        className={`inline-flex cursor-pointer items-center gap-2 border-4 border-black px-4 py-2 text-sm font-black uppercase tracking-[0.12em] shadow-[4px_4px_0_0_#000] ${
                          checked ? "bg-neo-secondary" : "bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(category)}
                          className="h-4 w-4 accent-black"
                        />
                        {category}
                        {!isKnownCategory ? <span className="text-[10px] opacity-60">历史</span> : null}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="border-4 border-black bg-neo-bg p-4 text-sm font-bold">
                  还没有分类。请先到分类管理页创建分类，再回到这里选择。
                </div>
              )}
            </div>
            <label className="grid gap-1">
              <span className="text-sm font-black uppercase tracking-[0.14em]">文章摘要</span>
              <textarea
                value={form.excerpt}
                onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                rows={3}
                className="w-full resize-none border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-black uppercase tracking-[0.14em]">金句 / 亮点</span>
              <input
                type="text"
                value={form.highlight}
                onChange={(event) => setForm((prev) => ({ ...prev, highlight: event.target.value }))}
                className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm font-black uppercase tracking-[0.14em]">正文字体</span>
                <select
                  value={form.fontFamily}
                  onChange={(event) => setForm((prev) => ({ ...prev, fontFamily: event.target.value as ArticleFontFamily }))}
                  className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                >
                  <option value="sans">黑体（Sans）</option>
                  <option value="serif">宋体（Serif）</option>
                  <option value="mono">等宽（Mono）</option>
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-black uppercase tracking-[0.14em]">正文字号</span>
                <select
                  value={form.fontSize}
                  onChange={(event) => setForm((prev) => ({ ...prev, fontSize: event.target.value as ArticleFontSize }))}
                  className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                >
                  <option value="sm">小（14px）</option>
                  <option value="base">标准（16px）</option>
                  <option value="lg">大（18px）</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000]">
          <div className="mb-4 flex items-center gap-2">
            <Layers aria-hidden="true" className="h-5 w-5 stroke-[4]" />
            <h2 className="text-lg font-black uppercase tracking-[0.14em]">来源信息</h2>
          </div>
          <div className="grid gap-4">
            <input
              type="text"
              value={form.sourceTitle}
              onChange={(event) => setForm((prev) => ({ ...prev, sourceTitle: event.target.value }))}
              placeholder="来源标题"
              className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                value={form.sourceAuthor}
                onChange={(event) => setForm((prev) => ({ ...prev, sourceAuthor: event.target.value }))}
                placeholder="作者"
                className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
              />
              <input
                type="url"
                value={form.sourceUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, sourceUrl: event.target.value }))}
                placeholder="https://"
                className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
              />
            </div>
          </div>
        </div>

        <div className="border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Type aria-hidden="true" className="h-5 w-5 stroke-[4]" />
              <h2 className="text-lg font-black uppercase tracking-[0.14em]">章节 ({form.sections.length})</h2>
            </div>
            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center gap-2 border-4 border-black bg-neo-secondary px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[4px_4px_0_0_#000]"
            >
              <Plus aria-hidden="true" className="h-4 w-4 stroke-[4]" />
              添加
            </button>
          </div>
          <div className="grid gap-5">
            {form.sections.map((section, index) => (
              <div className="border-4 border-black bg-neo-bg p-4" key={index}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-black uppercase tracking-[0.14em]">章节 {index + 1}</span>
                  {form.sections.length > 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          sections: prev.sections.filter((_, sectionIndex) => sectionIndex !== index),
                        }))
                      }
                      className="inline-flex items-center gap-1 border-4 border-black bg-neo-accent px-3 py-1 text-xs font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_0_#000]"
                    >
                      <Trash2 aria-hidden="true" className="h-3 w-3 stroke-[4]" />
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
                    className="w-full border-4 border-black bg-white px-3 py-2 text-sm font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
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
                          className="min-h-[4.5rem] w-full resize-none border-4 border-black bg-white px-3 py-2 font-mono text-sm font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                        />
                        {paragraphIndex === 0 && section.body.length === 1 && !paragraph && (
                          <p className="mt-1 text-[10px] font-bold opacity-40">
                            **粗体** *斜体* `代码` [链接](url) - 列表 &gt; 引用 ```代码块```
                          </p>
                        )}
                      </div>
                      {section.body.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => updateSection(index, "body", section.body.filter((_, bodyIndex) => bodyIndex !== paragraphIndex))}
                          className="flex h-10 w-10 shrink-0 items-center justify-center border-4 border-black bg-neo-accent shadow-[3px_3px_0_0_#000]"
                          aria-label="删除段落"
                        >
                          <Trash2 aria-hidden="true" className="h-4 w-4 stroke-[4]" />
                        </button>
                      ) : null}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateSection(index, "body", [...section.body, ""])}
                    className="inline-flex w-fit items-center gap-1 border-4 border-dashed border-black px-3 py-1 text-xs font-black uppercase tracking-[0.14em] hover:border-solid hover:bg-neo-secondary"
                  >
                    <Plus aria-hidden="true" className="h-3 w-3 stroke-[4]" />
                    添加段落
                  </button>
                  <label className="grid gap-1">
                    <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.14em]">
                      <Quote className="h-3 w-3 stroke-[4]" />
                      引用
                    </span>
                    <input
                      type="text"
                      value={section.callout}
                      onChange={(event) => updateSection(index, "callout", event.target.value)}
                      className="w-full border-4 border-black bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={saveDraft}
            disabled={activeAction !== null}
            className="inline-flex min-h-14 items-center justify-center gap-2 border-4 border-black bg-neo-secondary px-5 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_0_#000] disabled:opacity-60"
          >
            {activeAction === "save" ? <Loader2 className="h-5 w-5 animate-spin stroke-[4]" /> : <Save className="h-5 w-5 stroke-[4]" />}
            保存草稿
          </button>
          <button
            type="button"
            onClick={() => mutate("publish")}
            disabled={activeAction !== null}
            className="inline-flex min-h-14 items-center justify-center gap-2 border-4 border-black bg-neo-accent px-5 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_0_#000] disabled:opacity-60"
          >
            {activeAction === "publish" ? <Loader2 className="h-5 w-5 animate-spin stroke-[4]" /> : <Rocket className="h-5 w-5 stroke-[4]" />}
            发布
          </button>
          <button
            type="button"
            onClick={() => mutate("unpublish")}
            disabled={activeAction !== null || currentStatus !== "published"}
            className="inline-flex min-h-14 items-center justify-center gap-2 border-4 border-black bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_0_#000] disabled:opacity-50"
          >
            {activeAction === "unpublish" ? <Loader2 className="h-5 w-5 animate-spin stroke-[4]" /> : <EyeOff className="h-5 w-5 stroke-[4]" />}
            下线
          </button>
          <button
            type="button"
            onClick={() => mutate("archive")}
            disabled={activeAction !== null || !currentId}
            className="inline-flex min-h-14 items-center justify-center gap-2 border-4 border-black bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[6px_6px_0_0_#000] disabled:opacity-50"
          >
            {activeAction === "archive" ? <Loader2 className="h-5 w-5 animate-spin stroke-[4]" /> : <Trash2 className="h-5 w-5 stroke-[4]" />}
            归档
          </button>
        </div>

        {currentId && (
          <button
            type="button"
            onClick={permanentDelete}
            disabled={activeAction !== null}
            className="inline-flex w-fit items-center gap-2 border-4 border-dashed border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-600 opacity-70 hover:border-red-600 hover:bg-red-50 hover:opacity-100 disabled:opacity-40"
          >
            {activeAction === "permanent-delete" ? <Loader2 className="h-4 w-4 animate-spin stroke-[4]" /> : <Trash2 className="h-4 w-4 stroke-[4]" />}
            永久删除
          </button>
        )}
      </div>

      {/* Drag handle */}
      {showPreview && (
        <div
          onMouseDown={handleDragStart}
          className="hidden w-3 shrink-0 cursor-col-resize items-center justify-center bg-neo-bg transition-colors hover:bg-neo-secondary lg:flex"
        >
          <div className="h-12 w-1 rounded-full border-2 border-black bg-black" />
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
                className="inline-flex items-center gap-2 border-4 border-black bg-neo-muted px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_0_#000] transition duration-100 hover:-translate-y-0.5"
              >
                <EyeOff aria-hidden="true" className="h-4 w-4 stroke-[4]" />
                隐藏预览
              </button>
              <span className="text-xs font-bold opacity-40">拖拽中间分隔条调整比例</span>
            </div>
            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto border-4 border-black bg-white shadow-[12px_12px_0_0_#000]">
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
          className="fixed right-6 top-28 z-40 inline-flex items-center gap-2 border-4 border-black bg-neo-muted px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_0_#000] transition duration-100 hover:-translate-y-0.5"
        >
          <Eye aria-hidden="true" className="h-4 w-4 stroke-[4]" />
          显示预览
        </button>
      )}
    </div>
  );
}
