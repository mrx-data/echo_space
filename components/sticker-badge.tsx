import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type StickerBadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: "accent" | "secondary" | "muted" | "white" | "black";
};

const tones = {
  accent: "bg-neo-accent text-black",
  secondary: "bg-neo-secondary text-black",
  muted: "bg-neo-muted text-black",
  white: "bg-white text-black",
  black: "bg-black text-white",
};

export function StickerBadge({ className, tone = "secondary", ...props }: StickerBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border-4 border-black px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_0_#000] transition duration-200 ease-out hover:rotate-2",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
