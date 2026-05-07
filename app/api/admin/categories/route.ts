import { NextResponse } from "next/server";
import { createCategory, getCategories, getCategoryUsageCounts, sanitizeCategoryInput } from "@/lib/articles-db";
import { requireAdminApi } from "@/lib/auth";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const [categories, usageCounts] = await Promise.all([getCategories(), getCategoryUsageCounts()]);
  return NextResponse.json({ categories, usageCounts });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const input = await request.json().catch(() => ({}));
  const sanitized = sanitizeCategoryInput(input);
  if (sanitized.errors.length > 0) {
    return NextResponse.json({ error: "分类名称不能为空，且不能包含逗号" }, { status: 400 });
  }

  const category = await createCategory(input).catch((error: Error) => {
    if (error.message.includes("duplicate key")) {
      return "duplicate" as const;
    }
    throw error;
  });

  if (category === "duplicate") {
    return NextResponse.json({ error: "这个分类已经存在" }, { status: 409 });
  }

  return NextResponse.json({ category }, { status: 201 });
}
