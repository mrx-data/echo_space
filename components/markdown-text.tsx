"use client";

import { useMemo } from "react";
import { marked } from "marked";

type MarkdownTextProps = {
  content: string;
  className?: string;
};

// Pre-process Obsidian-specific syntax before passing to marked
function preprocessObsidianSyntax(md: string): string {
  let result = md;

  // 1. Strip wikilinks: [[target|display]] → display, [[target]] → target
  result = result.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2");
  result = result.replace(/\[\[([^\]]+)\]\]/g, "$1");

  // 2. Strip embedded images: ![[file.png]] → (removed)
  result = result.replace(/!\[\[[^\]]*\]\]/g, "");

  // 3. Convert Obsidian callouts to HTML markers before marked processes them
  result = result.replace(
    /^(>\s*\[!(\w+)\]\s*(.*?)\n(?:>\s*.*\n?)*)/gm,
    (match, _full, calloutType, calloutTitle) => {
      const lines = match.split("\n");
      const bodyLines = lines.slice(1).map((line: string) => line.replace(/^>\s?/, ""));
      const body = bodyLines.join("\n").trim();
      const title = calloutTitle.trim() || calloutType;
      return `<div class="obsidian-callout" data-type="${calloutType.toLowerCase()}" data-title="${title}">\n${body}\n</div>`;
    },
  );

  return result;
}

// Configure marked with custom blockquote renderer
const calloutColorMap: Record<string, { border: string; icon: string }> = {
  note: { border: "border-blue-400", icon: "📝" },
  tip: { border: "border-green-400", icon: "💡" },
  warning: { border: "border-yellow-400", icon: "⚠️" },
  danger: { border: "border-red-400", icon: "🚨" },
  info: { border: "border-cyan-400", icon: "ℹ️" },
  quote: { border: "border-gray-400", icon: "💬" },
  example: { border: "border-purple-400", icon: "📋" },
  question: { border: "border-orange-400", icon: "❓" },
};

marked.use({
  breaks: true,
  gfm: true,
  renderer: {
    blockquote({ text }: { text: string }) {
      // Check if this contains an Obsidian callout div
      const calloutMatch = text.match(
        /<div class="obsidian-callout" data-type="([^"]*)" data-title="([^"]*)">([\s\S]*)<\/div>/,
      );
      if (calloutMatch) {
        const [, calloutType, calloutTitle, body] = calloutMatch;
        const colors = calloutColorMap[calloutType] ?? calloutColorMap.note;

        return `<blockquote class="obsidian-callout border-l-3 ${colors.border} pl-4 my-4 py-2">
          <div class="obsidian-callout-title font-semibold text-sm tracking-wide mb-2 text-olive">
            ${colors.icon} ${calloutTitle}
          </div>
          <div class="obsidian-callout-body">${body}</div>
        </blockquote>`;
      }

      return `<blockquote class="border-l-3 border-olive pl-4 italic opacity-80 my-4">${text}</blockquote>`;
    },
  } as any,
});

export function MarkdownText({ content, className }: MarkdownTextProps) {
  const html = useMemo(() => {
    if (!content?.trim()) return "";
    try {
      const processed = preprocessObsidianSyntax(content);
      const result = marked.parse(processed, { async: false });
      return typeof result === "string" ? result : "";
    } catch {
      return `<p>${content}</p>`;
    }
  }, [content]);

  if (!html) return null;

  return (
    <div
      className={`neo-markdown ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
