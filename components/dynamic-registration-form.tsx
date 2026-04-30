"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { DynamicFormSchema } from "@/lib/form-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function DynamicRegistrationForm({
  courseId,
  schema,
  submitAction
}: {
  courseId: string;
  schema: DynamicFormSchema;
  submitAction: (courseId: string, data: Record<string, string>) => Promise<{ ok: boolean; message: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>;
    startTransition(async () => {
      const response = await submitAction(courseId, payload);
      setResult(response.message);
      if (response.ok) form.reset();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {schema.fields.map((field, index) => (
        <motion.label
          key={field.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, delay: index * 0.035 }}
          className="block space-y-2"
        >
          <span className="text-sm font-medium text-slate-700">
            {field.label} {field.required && <span className="text-indigo-600">*</span>}
          </span>
          {field.type === "textarea" ? (
            <Textarea name={field.name} required={field.required} placeholder={field.label} />
          ) : field.type === "dropdown" ? (
            <Select name={field.name} required={field.required} defaultValue="">
              <option value="" disabled>Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          ) : (
            <Input name={field.name} required={field.required} type={field.type === "phone" ? "tel" : "text"} placeholder={field.label} />
          )}
        </motion.label>
      ))}
      <Button type="submit" disabled={isPending} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-indigo-600/15 hover:scale-[1.01]">
        {isPending ? "Submitting..." : "Submit Registration"}
      </Button>
      {result && (
        <p className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {result}
        </p>
      )}
    </form>
  );
}
