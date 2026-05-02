import { Star } from "lucide-react";

type MarqueeStripProps = {
  items: string[];
  tone?: "yellow" | "black";
};

export function MarqueeStrip({ items, tone = "yellow" }: MarqueeStripProps) {
  const repeated = [...items, ...items, ...items];

  return (
    <div
      className={
        tone === "black"
          ? "overflow-hidden border-y-4 border-black bg-black py-3 text-white"
          : "overflow-hidden border-y-4 border-black bg-neo-secondary py-3 text-black"
      }
      aria-label={items.join(", ")}
    >
      <div className="flex w-max animate-[marquee_24s_linear_infinite] items-center gap-6 whitespace-nowrap px-6 text-xl font-black uppercase tracking-[0.16em]">
        {repeated.map((item, index) => (
          <span className="flex items-center gap-6" key={`${item}-${index}`}>
            {item}
            <Star aria-hidden="true" className="h-6 w-6 fill-current stroke-[4]" />
          </span>
        ))}
      </div>
    </div>
  );
}
