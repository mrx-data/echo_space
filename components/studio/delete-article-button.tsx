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
      className="inline-flex w-fit items-center gap-2 border-4 border-black bg-neo-accent px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[4px_4px_0_0_#000] disabled:opacity-60"
    >
      {deleting ? (
        <Loader2 className="h-4 w-4 animate-spin stroke-[4]" />
      ) : (
        <Trash2 className="h-4 w-4 stroke-[4]" />
      )}
      删除
    </button>
  );
}
