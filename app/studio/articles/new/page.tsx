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
      <main className="min-h-screen bg-neo-bg">
        <ArticleEditorForm categories={categories} />
      </main>
    </>
  );
}
