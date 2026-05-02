import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getFeaturedArticle } from "@/lib/articles-db";

export const metadata: Metadata = {
  title: "Echo Space",
  description: "Legacy article URL for Echo Space.",
};

export default async function EchoSpaceArticlePage() {
  const featuredArticle = await getFeaturedArticle();

  if (!featuredArticle) {
    notFound();
  }

  redirect(`/content/${featuredArticle.slug}`);
}
