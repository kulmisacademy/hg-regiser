"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { saveFormBuilderAction } from "@/app/actions";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DynamicFormField, DynamicFormSchema } from "@/lib/form-schema";

type EditableField = DynamicFormField & { id: string };

export function FormBuilder({ courseId, schema }: { courseId: string; schema: DynamicFormSchema }) {
  const [fields, setFields] = useState<EditableField[]>(
    schema.fields.map((field, index) => ({ ...field, id: `${field.name}-${index}` }))
  );

  function addField() {
    setFields((current) => [
      ...current,
      { id: crypto.randomUUID(), label: "New Field", name: "newField", type: "text", required: true }
    ]);
  }

  function removeField(id: string) {
    setFields((current) => current.filter((field) => field.id !== id));
  }

  return (
    <form action={saveFormBuilderAction.bind(null, courseId)} className="space-y-4">
      <AnimatePresence initial={false}>
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-[34px_1fr_160px_1fr_44px]"
          >
            <div className="flex items-center gap-2 text-slate-400">
              <GripVertical className="hidden h-4 w-4 md:block" />
              <span className="text-sm font-semibold text-slate-500">{index + 1}</span>
            </div>
            <Input name="label" defaultValue={field.label} aria-label="Field label" />
            <Select name="type" defaultValue={field.type} aria-label="Field type">
              <option value="text">Text</option>
              <option value="phone">Phone</option>
              <option value="dropdown">Dropdown</option>
              <option value="textarea">Textarea</option>
            </Select>
            <Input name="options" defaultValue={field.options?.join(", ") ?? ""} placeholder="Dropdown options, comma separated" aria-label="Dropdown options" />
            <Button type="button" variant="secondary" size="icon" onClick={() => removeField(field.id)} aria-label="Remove field">
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="flex flex-wrap justify-between gap-3 border-t pt-5">
        <Button type="button" variant="secondary" onClick={addField}>
          <Plus className="h-4 w-4" />
          Add Field
        </Button>
        <FormSubmitButton pendingText="Saving...">Save Form</FormSubmitButton>
      </div>
    </form>
  );
}
