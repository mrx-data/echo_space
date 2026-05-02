import { NextResponse } from "next/server";
import { archiveArticle, getAdminArticle, updateDraftArticle } from "@/lib/articles-db";
import { requireAdminApi } from "@/lib/auth";

type ArticleParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: ArticleParams) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const article = await getAdminArticle(id);
  if (!article) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json({ article });
}

export async function PATCH(request: Request, { params }: ArticleParams) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const input = await request.json().catch(() => ({}));
  const article = await updateDraftArticle(id, input).catch((error: Error) => {
    if (error.message.includes("duplicate key")) {
      return "duplicate" as const;
    }
    throw error;
  });

  if (article === "duplicate") {
    return NextResponse.json({ error: "这个 slug 已经存在" }, { status: 409 });
  }
  if (!article) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json({ article });
}

export async function DELETE(_request: Request, { params }: ArticleParams) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const article = await archiveArticle(id);
  if (!article) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json({ article });
}
