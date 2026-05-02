import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function NeoCard({ className, ...props }: ComponentPropsWithoutRef<"article">) {
  return (
    <article
      className={cn(
        "border-4 border-black bg-white shadow-[8px_8px_0_0_#000] transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]",
        className,
      )}
      {...props}
    />
  );
}
