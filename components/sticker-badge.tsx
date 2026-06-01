import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type StickerBadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: "olive" | "warm" | "muted" | "white";
};

const tones = {
  olive: "bg-olive/10 text-olive",
  warm: "bg-surface-warm text-muted",
  muted: "bg-surface-warm text-faint",
  white: "bg-surface text-muted border-line",
};

export function StickerBadge({ className, tone = "warm", ...props }: StickerBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
