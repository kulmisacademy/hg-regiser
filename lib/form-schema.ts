import { z } from "zod";
import { slugify } from "@/lib/utils";

export const fieldTypes = ["text", "phone", "dropdown", "textarea"] as const;

export const formFieldSchema = z.object({
  label: z.string().min(2),
  name: z.string().min(2),
  type: z.enum(fieldTypes),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional()
});

export const dynamicFormSchema = z.object({
  fields: z.array(formFieldSchema).min(1)
});

export type DynamicFormSchema = z.infer<typeof dynamicFormSchema>;
export type DynamicFormField = z.infer<typeof formFieldSchema>;

export const defaultRegistrationSchema: DynamicFormSchema = {
  fields: [
    { label: "Full Name", name: "fullName", type: "text", required: true },
    { label: "Phone Number", name: "phone", type: "phone", required: true },
    { label: "District", name: "district", type: "dropdown", required: true, options: ["Hodan", "Wadajir", "Daynile"] },
    { label: "Notes", name: "notes", type: "textarea", required: false }
  ]
};

export function normalizeField(label: string, type: DynamicFormField["type"], options?: string) {
  return {
    label: label.trim(),
    name: slugify(label).replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()),
    type,
    required: true,
    options: type === "dropdown" ? options?.split(",").map((item) => item.trim()).filter(Boolean) ?? [] : undefined
  };
}

export function schemaFromJson(value: unknown): DynamicFormSchema {
  const parsed = dynamicFormSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultRegistrationSchema;
}
