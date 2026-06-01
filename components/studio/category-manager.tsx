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

      <section className="editorial-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Plus aria-hidden="true" className="h-4 w-4 text-[#596044]" />
          <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-xl font-semibold text-[#596044]">
            新建分类
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr_0.4fr_auto] md:items-end">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#64645c]">分类名称</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] px-4 py-2.5 text-sm text-[#171713] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#64645c]">描述</span>
            <input
              type="text"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="w-full rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] px-4 py-2.5 text-sm text-[#171713] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#64645c]">排序</span>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
              className="w-full rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] px-4 py-2.5 text-sm text-[#171713] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
            />
          </label>
          <button
            type="button"
            onClick={createCategory}
            disabled={activeAction === "create"}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#485035] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#596044] disabled:opacity-50"
          >
            {activeAction === "create" ? (
              <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            创建
          </button>
        </div>
        <p className="mt-3 text-xs text-[#9a988f]">
          分类名称不能为空，也不能包含逗号。v1 不支持重命名分类名称。
        </p>
      </section>

      <section className="grid gap-4">
        {categories.length === 0 ? (
          <div className="editorial-card p-8 text-center">
            <Hash aria-hidden="true" className="mx-auto mb-4 h-10 w-10 text-[#9a988f]" />
            <p className="text-lg text-[#64645c]">
              还没有分类。先创建一个分类，再回到文章编辑器选择。
            </p>
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
                className="editorial-card grid gap-4 p-5 lg:grid-cols-[0.6fr_1fr_0.25fr_auto] lg:items-end"
              >
                <div>
                  <span className="mb-2 inline-flex rounded-full bg-[#f7f5f0] px-2.5 py-0.5 text-xs text-[#64645c]">
                    {usageCount} 篇
                  </span>
                  <h3 className="font-['Cormorant_Garamond',Georgia,serif] text-xl font-semibold text-[#171713]">
                    {category.name}
                  </h3>
                </div>
                <label className="grid gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-[#64645c]">描述</span>
                  <input
                    type="text"
                    value={edit.description}
                    onChange={(event) =>
                      setEditing((prev) => ({
                        ...prev,
                        [category.name]: { ...edit, description: event.target.value },
                      }))
                    }
                    className="w-full rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] px-4 py-2.5 text-sm text-[#171713] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-[#64645c]">排序</span>
                  <input
                    type="number"
                    value={edit.sortOrder}
                    onChange={(event) =>
                      setEditing((prev) => ({
                        ...prev,
                        [category.name]: { ...edit, sortOrder: event.target.value },
                      }))
                    }
                    className="w-full rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] px-4 py-2.5 text-sm text-[#171713] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateCategory(category.name)}
                    disabled={activeAction === `save:${category.name}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#485035] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#596044] disabled:opacity-50"
                  >
                    {activeAction === `save:${category.name}` ? (
                      <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category.name)}
                    disabled={usageCount > 0 || activeAction === `delete:${category.name}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e4db] bg-white px-4 py-2 text-sm text-[#9a988f] transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {activeAction === `delete:${category.name}` ? (
                      <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
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
