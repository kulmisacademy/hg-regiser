import * as React from "react";
import { cn } from "@/lib/utils";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props;
  return (
    <select className={cn("focus-ring h-11 w-full rounded-2xl border bg-white px-3 text-sm text-slate-950 shadow-sm transition focus-visible:shadow-[0_0_0_4px_rgba(79,70,229,0.14)]", className)} {...rest}>
      {children}
    </select>
  );
}
