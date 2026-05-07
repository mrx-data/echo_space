import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const contentSource = await readFile(new URL("../lib/content.ts", import.meta.url), "utf8");
const transpiled = ts.transpileModule(contentSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

const moduleUrl = `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`;
const { articles } = await import(moduleUrl);

const categoryNames = Array.from(
  new Set(
    articles
      .flatMap((article) => article.tags ?? [])
      .map((tag) => tag.trim())
      .filter(Boolean),
  ),
);

const categoryRows = categoryNames.map((name, index) => ({
  name,
  description: "",
  sort_order: index,
}));

if (categoryRows.length > 0) {
  const categoryResponse = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/categories?on_conflict=name&select=name`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(categoryRows),
    },
  );

  if (!categoryResponse.ok) {
    console.error(await categoryResponse.text());
    process.exit(1);
  }

  const seededCategories = await categoryResponse.json();
  console.log(`Seeded ${seededCategories.length} categories.`);
}

const rows = articles.map((article) => ({
  slug: article.slug,
  title: article.title,
  excerpt: article.excerpt,
  highlight: article.highlight,
  reading_time: article.readingTime,
  date: article.date,
  status: "published",
  tags: article.tags,
  source_title: article.source?.title || null,
  source_author: article.source?.author || null,
  source_url: article.source?.url || null,
  sections: article.sections,
  published_at: `${article.date}T00:00:00.000Z`,
}));

const response = await fetch(
  `${supabaseUrl.replace(/\/$/, "")}/rest/v1/articles?on_conflict=slug&select=slug,title,sections`,
  {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(rows),
  },
);

if (!response.ok) {
  console.error(await response.text());
  process.exit(1);
}

const seeded = await response.json();
console.log(`Seeded ${seeded.length} articles.`);
for (const article of seeded) {
  console.log(`- ${article.slug}: ${article.title} (${article.sections?.length ?? 0} sections)`);
}

console.log(`Source module: ${pathToFileURL(new URL("../lib/content.ts", import.meta.url).pathname)}`);
