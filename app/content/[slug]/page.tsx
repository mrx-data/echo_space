import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { articles as fixtureArticles } from "@/lib/content";
import { getPublishedArticleBySlug, isSupabaseConfigured } from "@/lib/articles-db";

type ArticleRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  if (isSupabaseConfigured()) {
    return [];
  }

  return fixtureArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article not found",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticleSlugPage({ params }: ArticleRouteProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} />;
}
