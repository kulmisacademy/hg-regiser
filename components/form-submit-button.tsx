"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

export function FormSubmitButton({
  children,
  pendingText = "Saving...",
  ...props
}: ButtonProps & { pendingText?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? pendingText : children}
    </Button>
  );
}
