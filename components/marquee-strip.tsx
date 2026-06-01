type TagListProps = {
  items: string[];
  tone?: "olive" | "default";
};

export function MarqueeStrip({ items, tone = "default" }: TagListProps) {
  return (
    <div className="border-y border-line bg-surface py-3">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 lg:px-8">
        {items.map((item) => (
          <span
            key={item}
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${
              tone === "olive"
                ? "bg-olive/10 text-olive"
                : "bg-surface-warm text-muted"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
