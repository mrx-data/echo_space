import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Github,
  Layers,
  Mail,
  Sparkles,
  Wrench,
} from "lucide-react";
import { NeoButton } from "@/components/neo-button";
import { NeoCard } from "@/components/neo-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickerBadge } from "@/components/sticker-badge";
import { getCategories, getFeaturedArticle } from "@/lib/articles-db";

const workCards = [
  {
    title: "文章 / 研究",
    description: "系统整理长期问题、方法框架和阅读后的判断，适合从完整文章开始浏览。",
    href: "/articles",
    cta: "查看全部文章",
    tone: "bg-white",
    badgeTone: "secondary" as const,
    icon: FileText,
  },
  {
    title: "AI 工作流",
    description: "把 AI 深度研究、知识库整理和日常开发实践沉淀成可复用的方法。",
    href: "/content/horizontal-vertical-ai-research",
    cta: "阅读代表研究",
    tone: "bg-neo-muted",
    badgeTone: "white" as const,
    icon: Sparkles,
  },
  {
    title: "工具实践",
    description: "记录具体工具接入、配置路径和排错过程，尽量把经验写成可复现步骤。",
    href: "/content/hermes-weixin",
    cta: "查看实践记录",
    tone: "bg-neo-secondary",
    badgeTone: "white" as const,
    icon: Wrench,
  },
  {
    title: "更多作品",
    description: "后续会继续扩展项目、工具和研究索引；当前公开内容会先汇总到文章列表。",
    href: "/articles",
    cta: "浏览当前内容",
    tone: "bg-neo-accent",
    badgeTone: "white" as const,
    icon: Layers,
  },
];

const aboutPoints = [
  "这里收录我对 AI、知识工作流、工具实践和个人写作的整理。",
  "首页先给你一张清晰目录，文章页再展开完整上下文和操作细节。",
  "内容会保持个人判断和实验痕迹，但尽量让入口、标题和阅读路径更直接。",
];

export default async function HomePage() {
  const [featuredArticle, categories] = await Promise.all([getFeaturedArticle(), getCategories()]);
  const articleHref = featuredArticle ? `/content/${featuredArticle.slug}` : "/articles";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b-4 border-black bg-neo-bg px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <StickerBadge tone="white" className="mb-6 w-fit">
                个人作品网站
              </StickerBadge>
              <h1 className="max-w-4xl text-6xl font-black uppercase leading-none tracking-[0] sm:text-8xl lg:text-9xl">
                <span className="block">Echo</span>
                <span className="neo-outline-text block">Space</span>
              </h1>
              <p className="mt-6 max-w-3xl border-l-8 border-black bg-white px-5 py-4 text-xl font-bold leading-snug shadow-[6px_6px_0_0_#000] sm:text-2xl">
                一个用于展示文章、研究、AI 工作流和工具实践的个人作品网站。
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <NeoButton href="#work">查看作品</NeoButton>
                <NeoButton href={articleHref} variant="white">
                  阅读文章
                </NeoButton>
              </div>
              <div className="mt-8 flex max-w-3xl flex-wrap gap-3">
                {categories.slice(0, 8).map((category) => (
                  <Link
                    href={`/articles?tag=${encodeURIComponent(category.name)}`}
                    className="border-4 border-black bg-neo-secondary px-4 py-2 text-sm font-black uppercase tracking-[0.12em] shadow-[4px_4px_0_0_#000]"
                    key={category.name}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <NeoCard className="overflow-hidden">
              <div className="border-b-4 border-black bg-neo-muted p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <BookOpen aria-hidden="true" className="h-8 w-8 stroke-[4]" />
                  <span className="text-sm font-black uppercase tracking-[0.16em]">Latest Entry</span>
                </div>
                <h2 className="text-3xl font-black leading-tight tracking-[0] sm:text-4xl">
                  {featuredArticle?.title ?? "从全部文章开始浏览"}
                </h2>
              </div>
              <div className="bg-white p-6 sm:p-8">
                <div className="mb-4 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.14em]">
                  <span className="border-4 border-black bg-neo-secondary px-3 py-2">
                    {featuredArticle?.date ?? "待发布"}
                  </span>
                  <span className="border-4 border-black bg-neo-bg px-3 py-2">
                    {featuredArticle?.readingTime ?? "Echo Space"}
                  </span>
                </div>
                <p className="text-lg font-bold leading-snug">
                  {featuredArticle?.excerpt ?? "公开文章发布后，这里会自动显示最新内容入口。"}
                </p>
                <NeoButton href={articleHref} variant="secondary" className="mt-6">
                  进入最新文章
                </NeoButton>
              </div>
            </NeoCard>
          </div>
        </section>

        <section id="work" className="border-b-4 border-black bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <StickerBadge tone="accent" className="mb-5 w-fit">
                  作品入口
                </StickerBadge>
                <h2 className="text-4xl font-black uppercase leading-none tracking-[0] sm:text-6xl">
                  先从这里看
                </h2>
              </div>
              <p className="max-w-xl text-lg font-bold leading-snug">
                首页标签来自后台分类库；点击分类可以进入对应文章列表。
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {workCards.map((work, index) => {
                const Icon = work.icon;
                return (
                  <Link
                    href={work.href}
                    className={`group flex min-h-72 flex-col justify-between border-4 border-black ${work.tone} p-6 shadow-[8px_8px_0_0_#000] transition duration-150 ease-linear hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]`}
                    key={work.title}
                  >
                    <div>
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <StickerBadge tone={work.badgeTone}>0{index + 1}</StickerBadge>
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center border-4 border-black bg-white shadow-[4px_4px_0_0_#000]">
                          <Icon aria-hidden="true" className="h-7 w-7 stroke-[4]" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-black leading-tight tracking-[0]">{work.title}</h3>
                      <p className="mt-4 text-lg font-bold leading-snug">{work.description}</p>
                    </div>
                    <div className="mt-8 inline-flex w-fit items-center gap-2 border-4 border-black bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[5px_5px_0_0_#000] transition duration-100 group-hover:-translate-y-0.5">
                      {work.cta}
                      <ArrowUpRight aria-hidden="true" className="h-5 w-5 stroke-[4]" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section id="about" className="border-b-4 border-black bg-neo-bg px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <StickerBadge tone="muted" className="mb-5 w-fit">
                关于
              </StickerBadge>
              <h2 className="text-4xl font-black uppercase leading-none tracking-[0] sm:text-6xl">
                一个更容易进入的作品索引。
              </h2>
            </div>
            <div className="grid gap-4">
              {aboutPoints.map((point, index) => (
                <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]" key={point}>
                  <span className="mb-3 inline-flex border-4 border-black bg-black px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white">
                    0{index + 1}
                  </span>
                  <p className="text-lg font-bold leading-snug">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <StickerBadge tone="secondary" className="mb-5 w-fit">
                联系
              </StickerBadge>
              <h2 className="neo-text-shadow text-4xl font-black uppercase leading-none tracking-[0] sm:text-6xl">
                想继续看作品或联系我。
              </h2>
              <p className="mt-5 max-w-2xl text-lg font-bold leading-snug text-white/80">
                GitHub 放公开代码与实验记录；邮箱适合项目、写作和合作沟通。
              </p>
            </div>
            <div className="grid gap-4">
              <a
                href="https://github.com/mrx-data"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center justify-between gap-4 border-4 border-black bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-black shadow-[6px_6px_0_0_#fff] transition duration-100 ease-linear hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                <span className="inline-flex items-center gap-3">
                  <Github aria-hidden="true" className="h-5 w-5 stroke-[4]" />
                  GitHub
                </span>
                <ArrowUpRight aria-hidden="true" className="h-5 w-5 stroke-[4]" />
              </a>
              <a
                href="mailto:2921108474@qq.com"
                className="inline-flex min-h-14 items-center justify-between gap-4 border-4 border-black bg-neo-secondary px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-black shadow-[6px_6px_0_0_#fff] transition duration-100 ease-linear hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                <span className="inline-flex items-center gap-3">
                  <Mail aria-hidden="true" className="h-5 w-5 stroke-[4]" />
                  2921108474@qq.com
                </span>
                <ArrowUpRight aria-hidden="true" className="h-5 w-5 stroke-[4]" />
              </a>
              <NeoButton href="/articles" variant="black" className="justify-between border-white shadow-[6px_6px_0_0_#fff]">
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
