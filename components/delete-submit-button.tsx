"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function DeleteSubmitButton({
  label = "Delete",
  confirmMessage = "Are you sure you want to delete this item?"
}: {
  label?: string;
  confirmMessage?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="secondary"
      size="sm"
      disabled={pending}
      className="rounded-2xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {pending ? "Deleting..." : label}
    </Button>
  );
}
