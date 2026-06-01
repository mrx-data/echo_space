"use client";

import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const confirmed = window.confirm("确定要永久删除这篇文章吗？此操作不可撤销。");
    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/articles/${articleId}?permanent=true`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "删除失败");
      }
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "删除失败");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#e8e4db] bg-white px-3 py-1.5 text-xs text-[#9a988f] transition hover:border-red-300 hover:text-red-600 disabled:opacity-50"
    >
      {deleting ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Trash2 className="h-3 w-3" />
      )}
      删除
    </button>
  );
}
