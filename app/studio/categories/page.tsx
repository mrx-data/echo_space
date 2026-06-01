import type { Metadata } from "next";
import { CategoryManager } from "@/components/studio/category-manager";
import { StudioHeader } from "@/components/studio/studio-shell";
import { getCategories, getCategoryUsageCounts } from "@/lib/articles-db";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "分类管理",
};

export default async function StudioCategoriesPage() {
  await requireAdminPage();
  const [categories, usageCounts] = await Promise.all([getCategories(), getCategoryUsageCounts()]);

  return (
    <>
      <StudioHeader />
      <main className="min-h-screen bg-[#fbfaf7] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8">
          <div>
            <span className="mb-2 text-xs font-medium uppercase tracking-widest text-[#596044]">
              CATEGORIES
            </span>
            <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-4xl font-semibold text-[#171713] sm:text-5xl">
              分类管理
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-[#64645c]">
              自建文章分类，文章编辑器会从这里读取可选分类。已被文章使用的分类不能直接删除。
            </p>
          </div>

          <CategoryManager initialCategories={categories} initialUsageCounts={usageCounts} />
        </div>
      </main>
    </>
  );
}
