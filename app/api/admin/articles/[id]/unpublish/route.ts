import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { unpublishArticle } from "@/lib/articles-db";

type ArticleParams = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: ArticleParams) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const article = await unpublishArticle(id);
  if (!article) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json({ article });
}
