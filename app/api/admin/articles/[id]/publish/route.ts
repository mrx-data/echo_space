import { NextResponse } from "next/server";
import { publishArticle } from "@/lib/articles-db";
import { requireAdminApi } from "@/lib/auth";

type ArticleParams = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: ArticleParams) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const article = await publishArticle(id);
    if (!article) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }
    return NextResponse.json({ article });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "发布失败" },
      { status: 400 },
    );
  }
}
