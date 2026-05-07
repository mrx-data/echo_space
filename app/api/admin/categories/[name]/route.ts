import { NextResponse } from "next/server";
import { deleteCategory, normalizeCategoryName, updateCategory } from "@/lib/articles-db";
import { requireAdminApi } from "@/lib/auth";

type CategoryParams = {
  params: Promise<{ name: string }>;
};

export async function PATCH(request: Request, { params }: CategoryParams) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { name } = await params;
  const normalizedName = normalizeCategoryName(decodeURIComponent(name));
  if (!normalizedName) {
    return NextResponse.json({ error: "分类不存在" }, { status: 404 });
  }

  const input = await request.json().catch(() => ({}));
  const category = await updateCategory(normalizedName, input);
  if (!category) {
    return NextResponse.json({ error: "分类不存在" }, { status: 404 });
  }

  return NextResponse.json({ category });
}

export async function DELETE(_request: Request, { params }: CategoryParams) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { name } = await params;
  const normalizedName = normalizeCategoryName(decodeURIComponent(name));
  if (!normalizedName) {
    return NextResponse.json({ error: "分类不存在" }, { status: 404 });
  }

  const deleted = await deleteCategory(normalizedName).catch((error: Error) => {
    if (error.message.includes("已被文章使用")) {
      return "in-use" as const;
    }
    throw error;
  });

  if (deleted === "in-use") {
    return NextResponse.json({ error: "分类已被文章使用，不能删除" }, { status: 409 });
  }

  return NextResponse.json({ category: deleted });
}
