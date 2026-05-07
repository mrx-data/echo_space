"use client";

import { useState } from "react";
import { Hash, Loader2, Plus, Save, Trash2 } from "lucide-react";
import type { CategoryRow } from "@/lib/articles-db";

type CategoryManagerProps = {
  initialCategories: CategoryRow[];
  initialUsageCounts: Record<string, number>;
};

type CategoryForm = {
  name: string;
  description: string;
  sortOrder: string;
};

const emptyForm: CategoryForm = {
  name: "",
  description: "",
  sortOrder: "0",
};

export function CategoryManager({ initialCategories, initialUsageCounts }: CategoryManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [usageCounts, setUsageCounts] = useState(initialUsageCounts);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Record<string, CategoryForm>>(() =>
    Object.fromEntries(
      initialCategories.map((category) => [
        category.name,
        {
          name: category.name,
          description: category.description ?? "",
          sortOrder: String(category.sort_order ?? 0),
        },
      ]),
    ),
  );
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function refreshCategories() {
    const response = await fetch("/api/admin/categories");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "刷新分类失败");
    }

    setCategories(data.categories);
    setUsageCounts(data.usageCounts ?? {});
    setEditing(
      Object.fromEntries(
        data.categories.map((category: CategoryRow) => [
          category.name,
          {
            name: category.name,
            description: category.description ?? "",
            sortOrder: String(category.sort_order ?? 0),
          },
        ]),
      ),
    );
  }

  async function createCategory() {
    setActiveAction("create");
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          sortOrder: Number(form.sortOrder || 0),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "创建分类失败");
      }

      setForm(emptyForm);
      setMessage("分类已创建");
      await refreshCategories();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "创建分类失败");
    } finally {
      setActiveAction(null);
    }
  }

  async function updateCategory(name: string) {
    setActiveAction(`save:${name}`);
    setError("");
    setMessage("");

    const next = editing[name];
    try {
      const response = await fetch(`/api/admin/categories/${encodeURIComponent(name)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: next.description,
          sortOrder: Number(next.sortOrder || 0),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "保存分类失败");
      }

      setMessage("分类已保存");
      await refreshCategories();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "保存分类失败");
    } finally {
      setActiveAction(null);
    }
  }

  async function deleteCategory(name: string) {
    const confirmed = window.confirm(`确定删除分类「${name}」吗？`);
    if (!confirmed) return;

    setActiveAction(`delete:${name}`);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/categories/${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "删除分类失败");
      }

      setMessage("分类已删除");
      await refreshCategories();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "删除分类失败");
    } finally {
      setActiveAction(null);
    }
  }

  return (
    <div className="grid gap-8">
      {(error || message) && (
        <div className={`border-4 border-black px-4 py-3 text-sm font-black ${error ? "bg-neo-accent" : "bg-neo-secondary"}`}>
          {error || message}
        </div>
      )}

      <section className="border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000]">
        <div className="mb-4 flex items-center gap-2">
          <Plus aria-hidden="true" className="h-5 w-5 stroke-[4]" />
          <h2 className="text-lg font-black uppercase tracking-[0.14em]">新建分类</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr_0.4fr_auto] md:items-end">
          <label className="grid gap-1">
            <span className="text-sm font-black uppercase tracking-[0.14em]">分类名称</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-black uppercase tracking-[0.14em]">描述</span>
            <input
              type="text"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-black uppercase tracking-[0.14em]">排序</span>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
              className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
            />
          </label>
          <button
            type="button"
            onClick={createCategory}
            disabled={activeAction === "create"}
            className="inline-flex min-h-14 items-center justify-center gap-2 border-4 border-black bg-neo-secondary px-5 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000] disabled:opacity-60"
          >
            {activeAction === "create" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin stroke-[4]" /> : <Plus aria-hidden="true" className="h-4 w-4 stroke-[4]" />}
            创建
          </button>
        </div>
        <p className="mt-3 text-xs font-bold opacity-60">分类名称不能为空，也不能包含逗号。v1 不支持重命名分类名称。</p>
      </section>

      <section className="grid gap-4">
        {categories.length === 0 ? (
          <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
            <Hash aria-hidden="true" className="mb-4 h-10 w-10 stroke-[4]" />
            <p className="text-2xl font-black">还没有分类。先创建一个分类，再回到文章编辑器选择。</p>
          </div>
        ) : (
          categories.map((category) => {
            const usageCount = usageCounts[category.name] ?? 0;
            const edit = editing[category.name] ?? {
              name: category.name,
              description: category.description ?? "",
              sortOrder: String(category.sort_order ?? 0),
            };
            return (
              <div
                key={category.name}
                className="grid gap-4 border-4 border-black bg-white p-5 shadow-[7px_7px_0_0_#000] lg:grid-cols-[0.6fr_1fr_0.25fr_auto] lg:items-end"
              >
                <div>
                  <span className="mb-2 inline-flex border-4 border-black bg-neo-muted px-3 py-1 text-xs font-black uppercase tracking-[0.14em]">
                    {usageCount} 篇
                  </span>
                  <h3 className="text-2xl font-black leading-tight">{category.name}</h3>
                </div>
                <label className="grid gap-1">
                  <span className="text-xs font-black uppercase tracking-[0.14em]">描述</span>
                  <input
                    type="text"
                    value={edit.description}
                    onChange={(event) =>
                      setEditing((prev) => ({
                        ...prev,
                        [category.name]: { ...edit, description: event.target.value },
                      }))
                    }
                    className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs font-black uppercase tracking-[0.14em]">排序</span>
                  <input
                    type="number"
                    value={edit.sortOrder}
                    onChange={(event) =>
                      setEditing((prev) => ({
                        ...prev,
                        [category.name]: { ...edit, sortOrder: event.target.value },
                      }))
                    }
                    className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-neo-secondary"
                  />
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateCategory(category.name)}
                    disabled={activeAction === `save:${category.name}`}
                    className="inline-flex items-center gap-2 border-4 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[4px_4px_0_0_#000] disabled:opacity-60"
                  >
                    {activeAction === `save:${category.name}` ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin stroke-[4]" /> : <Save aria-hidden="true" className="h-4 w-4 stroke-[4]" />}
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category.name)}
                    disabled={usageCount > 0 || activeAction === `delete:${category.name}`}
                    className="inline-flex items-center gap-2 border-4 border-black bg-neo-accent px-4 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[4px_4px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {activeAction === `delete:${category.name}` ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin stroke-[4]" /> : <Trash2 aria-hidden="true" className="h-4 w-4 stroke-[4]" />}
                    删除
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
