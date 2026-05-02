import type { Metadata } from "next";
import { ArticlePage } from "@/components/article-page";
import { featuredArticle } from "@/lib/content";

export const metadata: Metadata = {
  title: featuredArticle.title,
  description: featuredArticle.excerpt,
};

export default function EchoSpaceArticlePage() {
  return <ArticlePage article={featuredArticle} />;
}
