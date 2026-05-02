import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type NeoButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  children: ReactNode;
  variant?: "accent" | "secondary" | "white" | "black";
  showArrow?: boolean;
};

const variants = {
  accent: "bg-neo-accent text-black",
  secondary: "bg-neo-secondary text-black",
  white: "bg-white text-black",
  black: "bg-black text-white",
};

export function NeoButton({
  children,
  className,
  variant = "accent",
  showArrow = true,
  ...props
}: NeoButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-14 items-center justify-center gap-3 border-4 border-black px-6 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_0_#000] transition duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#000] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-neo-bg active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        variants[variant],
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {showArrow ? <ArrowRight aria-hidden="true" className="h-5 w-5 stroke-[4]" /> : null}
    </Link>
  );
}
