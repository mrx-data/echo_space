import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NeoButton } from "@/components/neo-button";
import { NeoCard } from "@/components/neo-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategories, getFeaturedArticle } from "@/lib/articles-db";

export default async function HomePage() {
  const [featuredArticle, categories] = await Promise.all([getFeaturedArticle(), getCategories()]);
  const articleHref = featuredArticle ? `/content/${featuredArticle.slug}` : "/articles";

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero Section */}
        <section className="bg-canvas px-6 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              {/* Small olive label */}
              <span className="mb-4 inline-block text-[11px] font-medium uppercase tracking-wider text-olive">
                你好，我是 Echo
              </span>

              {/* Large serif headline */}
              <h1
                className="max-w-2xl text-[36px] leading-[1.15] text-ink sm:text-[44px] lg:text-[52px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                我在这里记录思考、工具和创作
              </h1>

              {/* Subtitle description */}
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
                一个用于写作、观察与整理内心回声的个人知识库。文章涵盖 AI 工作流、工具实践和个人思考。
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <NeoButton href="/articles">查看文章</NeoButton>
                <Link
                  href="/#about"
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-olive underline underline-offset-4 transition-colors hover:text-olive-dark"
                >
                  关于我
                </Link>
              </div>

              {/* Category tags */}
              <div className="mt-8 flex max-w-lg flex-wrap gap-2">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    href={`/articles?tag=${encodeURIComponent(category.name)}`}
                    className="inline-flex items-center rounded-full bg-surface-warm px-3 py-1 text-[11px] font-medium text-muted transition-colors hover:text-ink"
                    key={category.name}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: portrait placeholder */}
            <div className="relative">
              <div className="dot-grid absolute -right-4 -top-4 h-32 w-32 opacity-40" />
              <div className="relative overflow-hidden rounded-[10px] border border-line bg-surface shadow-[0_12px_30px_rgba(31,29,24,0.08)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/hero-portrait.png" alt="Echo" className="h-80 w-full object-cover sm:h-96" />
              </div>
            </div>
          </div>
        </section>

        {/* Separator */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="h-px bg-line" />
        </div>

        {/* Featured Articles Section */}
        <section className="bg-canvas px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between">
              <h2
                className="text-[28px] leading-tight text-ink sm:text-[32px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                精选文章
              </h2>
              <Link
                href="/articles"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-olive transition-colors hover:text-olive-dark"
              >
                查看全部
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            {/* 3-column card grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 3).map((category, index) => (
                <NeoCard key={category.name} className="group overflow-hidden">
                  {/* Thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/thumb-${index + 1}.png`}
                    alt={category.name}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3
                      className="text-[20px] leading-tight text-ink"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                    >
                      {category.name}
                    </h3>
                    <span className="mt-2 inline-flex items-center rounded-full bg-olive/10 px-2.5 py-0.5 text-[10px] font-medium text-olive">
                      分类
                    </span>
                    <p className="mt-3 text-[13px] leading-relaxed text-muted">
                      包含「{category.name}」相关文章，记录该领域的思考与实践。
                    </p>
                    <Link
                      href={`/articles?tag=${encodeURIComponent(category.name)}`}
                      className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-olive transition-colors hover:text-olive-dark"
                    >
                      阅读 →
                    </Link>
                  </div>
                </NeoCard>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-surface-warm px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <span className="mb-3 inline-block text-[11px] font-medium uppercase tracking-wider text-olive">
                  关于
                </span>
                <h2
                  className="text-[28px] leading-tight text-ink sm:text-[36px]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  一个更容易进入的作品索引
                </h2>
              </div>
              <div className="grid gap-4">
                {[
                  "这里收录我对 AI、知识工作流、工具实践和个人写作的整理。",
                  "首页先给你一张清晰目录，文章页再展开完整上下文和操作细节。",
                  "内容会保持个人判断和实验痕迹，但尽量让入口、标题和阅读路径更直接。",
                ].map((point, index) => (
                  <div
                    className="rounded-[10px] border border-line bg-surface p-5"
                    key={index}
                  >
                    <span className="mb-2 inline-block text-[11px] font-medium uppercase tracking-wider text-olive">
                      0{index + 1}
                    </span>
                    <p className="text-[14px] leading-relaxed text-muted">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-canvas px-6 py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <span className="mb-3 inline-block text-[11px] font-medium uppercase tracking-wider text-olive">
                联系
              </span>
              <h2
                className="text-[28px] leading-tight text-ink sm:text-[36px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                想继续看作品或联系我
              </h2>
              <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-muted">
                GitHub 放公开代码与实验记录；邮箱适合项目、写作和合作沟通。
              </p>
            </div>
            <div className="grid gap-3">
              <a
                href="https://github.com/mrx-data"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-[10px] border border-line bg-surface px-5 py-4 transition-shadow hover:shadow-[0_12px_30px_rgba(31,29,24,0.08)]"
              >
                <span className="text-[14px] font-medium text-ink">GitHub</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 text-faint" />
              </a>
              <a
                href="mailto:2921108474@qq.com"
                className="flex items-center justify-between rounded-[10px] border border-line bg-surface px-5 py-4 transition-shadow hover:shadow-[0_12px_30px_rgba(31,29,24,0.08)]"
              >
                <span className="text-[14px] font-medium text-ink">2921108474@qq.com</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 text-faint" />
              </a>
              <a
                href="/studio"
                className="flex items-center justify-between rounded-[10px] border border-line bg-surface px-5 py-4 transition-shadow hover:shadow-[0_12px_30px_rgba(31,29,24,0.08)]"
              >
                <span className="text-[14px] font-medium text-ink">进入后台</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 text-faint" />
              </a>
              <NeoButton href="/articles" variant="outline" className="justify-between rounded-full">
                全部文章
              </NeoButton>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
