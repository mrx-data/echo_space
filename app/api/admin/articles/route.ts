import { NextResponse } from "next/server";
import { createDraftArticle, listAdminArticles, sanitizeArticleInput } from "@/lib/articles-db";
import { requireAdminApi } from "@/lib/auth";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const articles = await listAdminArticles();
  return NextResponse.json({ articles });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const input = await request.json().catch(() => ({}));
  const sanitized = sanitizeArticleInput(input);

  const article = await createDraftArticle(
    {
      ...input,
      slug: sanitized.slug || `draft-${crypto.randomUUID()}`,
    },
    auth.user.id,
  ).catch((error: Error) => {
    if (error.message.includes("duplicate key")) {
      return "duplicate" as const;
    }
    throw error;
  });

  if (article === "duplicate") {
    return NextResponse.json({ error: "这个 slug 已经存在" }, { status: 409 });
  }

  return NextResponse.json({ article }, { status: 201 });
}
