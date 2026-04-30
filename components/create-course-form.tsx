"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GripVertical, ImagePlus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { createCourseAction } from "@/app/actions";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DynamicFormField, defaultRegistrationSchema } from "@/lib/form-schema";

type EditableField = DynamicFormField & { id: string };

export function CreateCourseForm() {
  const [fields, setFields] = useState<EditableField[]>(
    defaultRegistrationSchema.fields.map((field, index) => ({ ...field, id: `${field.name}-${index}` }))
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
    <form action={createCourseAction} className="space-y-6">
      <div className="grid gap-4 rounded-2xl border bg-slate-50/70 p-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Course Name</span>
          <Input name="title" required placeholder="Web Development" className="rounded-2xl" />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <Textarea name="description" required placeholder="Short course description" className="rounded-2xl" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Image URL</span>
            <Input name="imageUrl" placeholder="/logo.jpg or https://..." className="rounded-2xl" />
          </label>
          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <ImagePlus className="h-4 w-4 text-indigo-600" />
              Image Upload
            </span>
            <Input name="imageFile" type="file" accept="image/*" className="rounded-2xl file:mr-3 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-indigo-700" />
            <span className="block text-xs text-slate-500">Use images under 2MB for reliable Vercel uploads.</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
          <h2 className="text-lg font-semibold text-slate-950">Registration form fields</h2>
          <p className="mt-1 text-sm text-slate-500">Create dropdowns, phone fields, notes, and any extra questions.</p>
          </div>
          <Button type="button" variant="secondary" onClick={addField} className="rounded-2xl">
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        </div>
        <AnimatePresence initial={false}>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-[34px_1fr_150px_1fr_44px]"
            >
              <div className="flex items-center gap-2 text-slate-400">
                <GripVertical className="hidden h-4 w-4 md:block" />
                <span className="text-sm font-semibold text-slate-500">{index + 1}</span>
              </div>
              <Input name="label" defaultValue={field.label} aria-label="Field label" className="rounded-2xl" />
              <Select name="type" defaultValue={field.type} aria-label="Field type" className="rounded-2xl">
                <option value="text">Text</option>
                <option value="phone">Phone</option>
                <option value="dropdown">Dropdown</option>
                <option value="textarea">Textarea</option>
              </Select>
              <Input name="options" defaultValue={field.options?.join(", ") ?? ""} placeholder="Dropdown options" aria-label="Dropdown options" className="rounded-2xl" />
              <Button type="button" variant="secondary" size="icon" onClick={() => removeField(field.id)} aria-label="Remove field" className="rounded-2xl">
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-end border-t pt-5">
        <FormSubmitButton pendingText="Publishing..." className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 shadow-lg shadow-indigo-600/15 hover:scale-[1.01]">
          Publish Course
        </FormSubmitButton>
      </div>
    </form>
  );
}
