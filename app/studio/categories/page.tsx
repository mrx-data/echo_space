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
      <main className="min-h-screen bg-neo-bg px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8">
          <div>
            <span className="mb-4 inline-flex border-4 border-black bg-neo-muted px-4 py-2 text-sm font-black uppercase tracking-[0.16em] shadow-[4px_4px_0_0_#000]">
              分类库
            </span>
            <h1 className="text-6xl font-black uppercase leading-none tracking-[0] sm:text-8xl">
              Categories
            </h1>
            <p className="mt-4 max-w-3xl text-lg font-bold leading-snug">
              自建文章分类，文章编辑器会从这里读取可选分类。已被文章使用的分类不能直接删除。
            </p>
          </div>

          <CategoryManager initialCategories={categories} initialUsageCounts={usageCounts} />
        </div>
      </main>
    </>
  );
}
