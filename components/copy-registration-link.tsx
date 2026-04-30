"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyRegistrationLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const href = `/register/${slug}`;
  const fullUrl = useMemo(() => {
    if (typeof window === "undefined") return href;
    return `${window.location.origin}${href}`;
  }, [href]);

  async function copy() {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-2xl border bg-slate-50 p-2">
      <code className="min-w-0 flex-1 truncate px-2 text-xs font-medium text-slate-600">{href}</code>
      <Button type="button" size="sm" onClick={copy} className="rounded-2xl">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}
