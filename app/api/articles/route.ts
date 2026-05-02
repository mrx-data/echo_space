import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type Section = {
  heading: string;
  body: string[];
  callout?: string;
};

type Article = {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  tags: string[];
  excerpt: string;
  highlight: string;
  source: {
    title: string;
    author: string;
    url: string;
  };
  sections: Section[];
};

export async function POST(request: Request) {
  try {
    const article: Article = await request.json();

    // Validate required fields
    if (!article.slug || !article.title || !article.excerpt || !article.highlight) {
      return NextResponse.json(
        { error: "标题、slug、摘要、金句为必填项" },
        { status: 400 },
      );
    }

    // Build the TypeScript object string
    const articleStr = buildArticleString(article);

    // Read the content.ts file
    const filePath = join(process.cwd(), "lib", "content.ts");
    const fileContent = readFileSync(filePath, "utf-8");

    // Find the end of the articles array and insert the new article
    const insertPoint = fileContent.indexOf("];", fileContent.indexOf("export const articles"));
    if (insertPoint === -1) {
      return NextResponse.json(
        { error: "无法定位 articles 数组" },
        { status: 500 },
      );
    }

    const newContent =
      fileContent.slice(0, insertPoint) +
      articleStr + ",\n" +
      fileContent.slice(insertPoint);

    writeFileSync(filePath, newContent, "utf-8");

    return NextResponse.json({ success: true, slug: article.slug });
  } catch (err) {
    console.error("保存文章失败:", err);
    return NextResponse.json(
      { error: "保存失败，请检查控制台" },
      { status: 500 },
    );
  }
}

/** Build a TS object literal string from the article data */
function buildArticleString(article: Article): string {
  const sectionsStr = article.sections
    .filter((s) => s.heading)
    .map((section) => {
      const bodyStr = section.body.map((p) => `        "${escapeTs(p)}"`).join(",\n");
      const calloutStr = section.callout
        ? `,\n      callout: "${escapeTs(section.callout)}"`
        : "";
      return `    {
      heading: "${escapeTs(section.heading)}",
      body: [
${bodyStr},
      ]${calloutStr}
    }`;
    })
    .join(",\n");

  const tagsStr = article.tags.map((t) => `"${escapeTs(t)}"`).join(", ");

  return `  {
    slug: "${escapeTs(article.slug)}",
    title: "${escapeTs(article.title)}",
    date: "${escapeTs(article.date)}",
    readingTime: "${escapeTs(article.readingTime)}",
    tags: [${tagsStr}],
    excerpt:
      "${escapeTs(article.excerpt)}",
    highlight: "${escapeTs(article.highlight)}",
    source: {
      title: "${escapeTs(article.source.title)}",
      author: "${escapeTs(article.source.author)}",
      url: "${escapeTs(article.source.url)}",
    },
    sections: [
${sectionsStr},
    ],
  }`;
}

/** Escape special characters for TS string literals */
function escapeTs(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}
