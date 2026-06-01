import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function NeoCard({ className, ...props }: ComponentPropsWithoutRef<"article">) {
  return (
    <article
      className={cn(
        "rounded-[10px] border border-line bg-surface shadow-[0_12px_30px_rgba(31,29,24,0.08)] transition-shadow duration-200 hover:shadow-[0_20px_45px_rgba(31,29,24,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
