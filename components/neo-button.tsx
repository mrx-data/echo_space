import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type NeoButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  children: ReactNode;
  variant?: "olive" | "outline" | "ghost" | "white";
  showArrow?: boolean;
};

const variants = {
  olive: "bg-olive-dark text-white hover:opacity-90",
  outline: "border border-line text-ink hover:bg-surface-warm",
  ghost: "text-muted hover:text-ink",
  white: "bg-surface text-ink border border-line hover:bg-surface-warm",
};

export function NeoButton({
  children,
  className,
  variant = "olive",
  showArrow = true,
  ...props
}: NeoButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-[38px] items-center justify-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium transition-all duration-200",
        variants[variant],
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {showArrow ? <ArrowRight aria-hidden="true" className="h-4 w-4" /> : null}
    </Link>
  );
}
