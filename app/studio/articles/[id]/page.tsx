import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleEditorForm } from "@/components/studio/article-editor-form";
import { StudioHeader } from "@/components/studio/studio-shell";
import { getAdminArticle, getCategories, rowToDraftInput } from "@/lib/articles-db";
import { requireAdminPage } from "@/lib/auth";

type StudioArticlePageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "编辑文章",
};

export default async function StudioArticlePage({ params }: StudioArticlePageProps) {
  await requireAdminPage();
  const { id } = await params;
  const [article, categories] = await Promise.all([getAdminArticle(id), getCategories()]);

  if (!article) {
    notFound();
  }

  return (
    <>
      <StudioHeader />
      <main className="min-h-screen bg-neo-bg">
        <ArticleEditorForm
          articleId={article.id}
          status={article.status}
          initial={rowToDraftInput(article)}
          categories={categories}
        />
      </main>
    </>
  );
}
