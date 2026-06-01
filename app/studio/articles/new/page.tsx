import { Suspense } from "react";
import type { Metadata } from "next";
import { ArticleEditorForm } from "@/components/studio/article-editor-form";
import { StudioHeader } from "@/components/studio/studio-shell";
import { getCategories } from "@/lib/articles-db";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "新建文章",
};

export default async function NewStudioArticlePage() {
  await requireAdminPage();
  const categories = await getCategories();

  return (
    <>
      <StudioHeader />
      <main className="min-h-screen bg-[#fbfaf7]">
        <Suspense fallback={<div className="p-8 text-center text-sm text-[#64645c]">加载中...</div>}>
          <ArticleEditorForm categories={categories} />
        </Suspense>
      </main>
    </>
  );
}
