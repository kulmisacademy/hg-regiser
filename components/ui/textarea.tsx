import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("focus-ring min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm text-slate-950 shadow-sm transition focus-visible:shadow-[0_0_0_4px_rgba(79,70,229,0.14)]", className)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
