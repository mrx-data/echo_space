import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Braces, Eye, MessageSquareText, Orbit, PenLine, Sparkles, Star } from "lucide-react";
import { MarqueeStrip } from "@/components/marquee-strip";
import { NeoButton } from "@/components/neo-button";
import { NeoCard } from "@/components/neo-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickerBadge } from "@/components/sticker-badge";
import { featuredArticle, topicTags } from "@/lib/content";

const signals = [
  { label: "观察", icon: Eye, tone: "bg-neo-muted" },
  { label: "书写", icon: PenLine, tone: "bg-neo-secondary" },
  { label: "重组", icon: Braces, tone: "bg-neo-accent" },
];

function SignalPoster() {
  return (
    <div className="relative min-h-[460px] border-4 border-black bg-white p-5 shadow-[12px_12px_0_0_#000] sm:min-h-[540px] sm:p-7">
      <div className="absolute -left-5 top-10 rotate-[-7deg] border-4 border-black bg-neo-secondary px-4 py-2 text-sm font-black uppercase tracking-[0.18em] shadow-[5px_5px_0_0_#000]">
        信号 001
      </div>
      <div className="absolute -right-4 top-24 flex h-24 w-24 rotate-12 items-center justify-center rounded-full border-4 border-black bg-neo-accent shadow-[6px_6px_0_0_#000]">
        <Star aria-hidden="true" className="h-12 w-12 animate-spin-slow fill-black stroke-[4]" />
      </div>
      <div className="neo-grid grid h-full min-h-[420px] place-items-center border-4 border-black bg-neo-muted p-6">
        <div className="relative grid w-full max-w-sm gap-4">
          <div className="-rotate-2 border-4 border-black bg-black px-5 py-4 text-5xl font-black uppercase leading-none text-white shadow-[8px_8px_0_0_#fff] sm:text-6xl">
            Echo
          </div>
          <div className="rotate-1 border-4 border-black bg-neo-secondary px-5 py-4 text-5xl font-black uppercase leading-none shadow-[8px_8px_0_0_#000] sm:text-6xl">
            Space
          </div>
          <div className="ml-auto w-4/5 rotate-[-3deg] border-4 border-black bg-white p-4 text-xl font-black leading-tight shadow-[6px_6px_0_0_#000]">
            给反复出现的念头留一张桌子。
          </div>
        </div>
      </div>
      <div className="absolute bottom-7 left-7 right-7 grid grid-cols-3 gap-3">
        {signals.map((item) => {
          const Icon = item.icon;
          return (
            <div className={`border-4 border-black ${item.tone} p-3 text-center shadow-[4px_4px_0_0_#000]`} key={item.label}>
              <Icon aria-hidden="true" className="mx-auto mb-2 h-7 w-7 stroke-[4]" />
              <p className="text-xs font-black uppercase tracking-[0.12em]">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HomePage() {
  const articleHref = `/content/${featuredArticle.slug}`;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="neo-noise overflow-hidden border-b-4 border-black bg-neo-bg">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-20">
            <div className="relative flex flex-col justify-center">
              <StickerBadge tone="muted" className="mb-6 w-fit rotate-[-2deg]">
                个人网站 / 个人回声室
              </StickerBadge>
              <h1 className="max-w-5xl text-6xl font-black uppercase leading-none tracking-[0] sm:text-8xl lg:text-9xl">
                <span className="block">Echo</span>
                <span className="neo-outline-text block">Space</span>
              </h1>
              <p className="mt-6 max-w-3xl border-l-8 border-black bg-white px-5 py-4 text-xl font-bold leading-snug shadow-[6px_6px_0_0_#000] sm:text-2xl">
                一个把想法贴上墙、把观察摊在桌面、把问题留到下一次回响的个人网站。
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <NeoButton href={articleHref}>阅读文章</NeoButton>
                <NeoButton href="#about" variant="white">
                  看看空间
                </NeoButton>
              </div>
              <div className="mt-10 grid max-w-3xl grid-cols-3 gap-3">
                {["笔记", "随笔", "系统"].map((item, index) => (
                  <div
                    className="border-4 border-black bg-neo-secondary px-3 py-4 text-center text-sm font-black uppercase tracking-[0.12em] shadow-[4px_4px_0_0_#000]"
                    key={item}
                  >
                    <span className="block text-2xl">{String(index + 1).padStart(2, "0")}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <SignalPoster />
          </div>
        </section>

        <MarqueeStrip items={["大声书写", "慢慢思考", "留住回声", "让它可见"]} />

        <section id="about" className="border-b-4 border-black bg-neo-muted px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <StickerBadge tone="accent" className="mb-5 rotate-2">
                关于这个空间
              </StickerBadge>
              <h2 className="text-5xl font-black uppercase leading-none tracking-[0] sm:text-7xl">
                这里不是橱窗，是工作台。
              </h2>
            </div>
            <div className="grid gap-5">
              {[
                "Echo Space 用来收纳那些尚未完成但已经开始发光的念头。",
                "它会保留粗粝的边框、响亮的颜色，也保留思考还没打磨平整时的真实形状。",
                "首页负责建立空间感，内容页负责让一篇文章被认真阅读。",
              ].map((text, index) => (
                <div className="border-4 border-black bg-white p-6 text-xl font-bold leading-snug shadow-[7px_7px_0_0_#000]" key={text}>
                  <span className="mb-3 inline-flex border-4 border-black bg-black px-3 py-1 text-sm font-black uppercase tracking-[0.16em] text-white">
                    0{index + 1}
                  </span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="writing" className="border-b-4 border-black bg-neo-bg px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <StickerBadge tone="secondary" className="mb-5 rotate-[-2deg]">
                  精选内容
                </StickerBadge>
                <h2 className="text-5xl font-black uppercase leading-none tracking-[0] sm:text-7xl">最新内容</h2>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 border-4 border-black bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[5px_5px_0_0_#000] transition duration-100 ease-linear active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  全部文章
                  <ArrowUpRight aria-hidden="true" className="h-5 w-5 stroke-[4]" />
                </Link>
                <Link
                  href={articleHref}
                  className="inline-flex items-center gap-2 border-4 border-black bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.16em] shadow-[5px_5px_0_0_#000] transition duration-100 ease-linear active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  最新文章
                  <ArrowUpRight aria-hidden="true" className="h-5 w-5 stroke-[4]" />
                </Link>
              </div>
            </div>
            <NeoCard className="grid gap-0 overflow-hidden md:grid-cols-[0.9fr_1.1fr]">
              <div className="neo-halftone min-h-72 border-b-4 border-black bg-neo-accent p-8 md:border-b-0 md:border-r-4">
                <div className="flex h-full flex-col justify-between gap-8">
                  <div className="flex flex-wrap gap-3">
                    {featuredArticle.tags.slice(0, 3).map((tag) => (
                      <StickerBadge tone="white" key={tag}>
                        {tag}
                      </StickerBadge>
                    ))}
                  </div>
                  <div className="rotate-[-2deg] border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000]">
                    <MessageSquareText aria-hidden="true" className="mb-4 h-10 w-10 stroke-[4]" />
                    <p className="text-2xl font-black leading-tight">“{featuredArticle.highlight}”</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-7 sm:p-10">
                <div className="mb-5 flex flex-wrap gap-3 text-sm font-black uppercase tracking-[0.14em]">
                  <span className="border-4 border-black bg-neo-secondary px-3 py-2">{featuredArticle.date}</span>
                  <span className="border-4 border-black bg-neo-muted px-3 py-2">{featuredArticle.readingTime}</span>
                </div>
                <h3 className="text-4xl font-black leading-none tracking-[0] sm:text-5xl">{featuredArticle.title}</h3>
                <p className="mt-5 text-xl font-bold leading-snug">{featuredArticle.excerpt}</p>
                <NeoButton href={articleHref} variant="secondary" className="mt-8">
                  进入文章
                </NeoButton>
              </div>
            </NeoCard>
          </div>
        </section>

        <section className="border-b-4 border-black bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <StickerBadge tone="accent" className="mb-5 rotate-2">
                话题
              </StickerBadge>
              <h2 className="neo-text-shadow text-5xl font-black uppercase leading-none tracking-[0] sm:text-7xl">
                会被反复谈起的东西
              </h2>
            </div>
            <div className="flex flex-wrap content-start gap-4">
              {topicTags.map((tag, index) => (
                <span
                  className={`border-4 border-black px-5 py-3 text-lg font-black uppercase tracking-[0.1em] text-black shadow-[5px_5px_0_0_#fff] ${
                    index % 3 === 0 ? "bg-neo-secondary" : index % 3 === 1 ? "bg-neo-muted" : "bg-neo-accent"
                  }`}
                  key={tag}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-neo-accent px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-center">
            <div className="border-4 border-black bg-neo-secondary p-8 shadow-[10px_10px_0_0_#000]">
              <div className="mb-5 flex items-center gap-3">
                <Sparkles aria-hidden="true" className="h-9 w-9 fill-black stroke-[4]" />
                <span className="text-sm font-black uppercase tracking-[0.18em]">从这里开始</span>
              </div>
              <h2 className="text-5xl font-black uppercase leading-none tracking-[0] sm:text-7xl">
                从这篇研究开始。
              </h2>
            </div>
            <div className="grid gap-4">
              <NeoButton href="/articles" variant="black" className="w-full justify-between">
                全部文章
              </NeoButton>
              <a
                href="#"
                className="inline-flex min-h-14 items-center justify-between border-4 border-black bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_0_#000] transition duration-100 ease-linear active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                aria-label="回到页面顶部"
              >
                回到顶部
                <ArrowDownRight aria-hidden="true" className="h-5 w-5 stroke-[4]" />
              </a>
              <div className="flex items-center gap-3 border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_#000]">
                <Orbit aria-hidden="true" className="h-10 w-10 animate-wiggle stroke-[4]" />
                <p className="text-lg font-black leading-tight">页面先小而完整，后续再长出更多房间。</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
