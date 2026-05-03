"use client";

import { useMemo } from "react";
import { marked } from "marked";

type MarkdownTextProps = {
  content: string;
  className?: string;
};

// Configure marked for safe HTML output
marked.setOptions({
  breaks: true,
  gfm: true,
});

export function MarkdownText({ content, className }: MarkdownTextProps) {
  const html = useMemo(() => {
    if (!content?.trim()) return "";
    try {
      const result = marked.parse(content, { async: false });
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
