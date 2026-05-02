"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearAdminSession, createAdminSession, requireAdmin, validateAdmin } from "@/lib/auth";
import { defaultRegistrationSchema, dynamicFormSchema, normalizeField, schemaFromJson } from "@/lib/form-schema";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { generateShortSlug } from "@/lib/utils";

const courseSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  imageUrl: z.string().optional()
});
const maxUploadBytes = 2 * 1024 * 1024;

export async function submitRegistration(courseId: string, data: Record<string, string>) {
  if (!hasDatabaseUrl) {
    return { ok: false, message: "Database is not configured yet. Add DATABASE_URL to save registrations." };
  }

  const form = await prisma.form.findUnique({ where: { courseId } });
  const schema = schemaFromJson(form?.schemaJson ?? defaultRegistrationSchema);

  for (const field of schema.fields) {
    if (field.required && !data[field.name]?.trim()) {
      return { ok: false, message: `${field.label} is required.` };
    }
  }

  await prisma.registration.create({
    data: {
      courseId,
      dataJson: data
    }
  });

  revalidatePath("/admin/registrations");
  return { ok: true, message: "Waan kula soo xiriiri doonaa" };
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (await validateAdmin(email, password)) {
    await createAdminSession(email);
    redirect("/admin");
  }

  redirect("/admin/login?error=invalid");
}

export async function logoutAction() {
  await requireAdmin();
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createCourseAction(formData: FormData) {
  await requireAdmin();
  const parsed = courseSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl")
  });
  const imageFile = formData.get("imageFile");
  let imageUrl = parsed.imageUrl || "/logo.jpg";

  if (imageFile instanceof File && imageFile.size > 0) {
    if (imageFile.size > maxUploadBytes) {
      redirect("/admin/courses?error=image-too-large");
    }
    const bytes = Buffer.from(await imageFile.arrayBuffer());
    const mimeType = imageFile.type || "image/jpeg";
    imageUrl = `data:${mimeType};base64,${bytes.toString("base64")}`;
  }

  const labels = formData.getAll("label").map(String);
  const types = formData.getAll("type").map(String);
  const options = formData.getAll("options").map(String);
  const fields = labels
    .map((label, index) => normalizeField(label, types[index] as never, options[index]))
    .filter((field) => field.label.length > 1);
  const formSchema = dynamicFormSchema.parse({ fields: fields.length ? fields : defaultRegistrationSchema.fields });

  let slug = generateShortSlug();
  while (await prisma.course.findUnique({ where: { slug } })) {
    slug = generateShortSlug();
  }

  const course = await prisma.course.create({
    data: {
      ...parsed,
      imageUrl,
      slug,
      form: {
        create: {
          schemaJson: formSchema
        }
      }
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/courses");
  revalidatePath(`/register/${course.slug}`);
  redirect(`/admin/courses?created=${course.slug}`);
}

export async function saveFormBuilderAction(courseId: string, formData: FormData) {
  await requireAdmin();
  const labels = formData.getAll("label").map(String);
  const types = formData.getAll("type").map(String);
  const options = formData.getAll("options").map(String);

  const fields = labels
    .map((label, index) => normalizeField(label, types[index] as never, options[index]))
    .filter((field) => field.label.length > 1);

  const schema = dynamicFormSchema.parse({ fields });

  await prisma.form.upsert({
    where: { courseId },
    update: { schemaJson: schema },
    create: { courseId, schemaJson: schema }
  });

  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { slug: true } });
  if (course) revalidatePath(`/register/${course.slug}`);
  revalidatePath(`/admin/forms/${courseId}`);
  redirect(`/admin/forms/${courseId}?saved=1`);
}

export async function deleteCourseAction(courseId: string) {
  await requireAdmin();
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { slug: true } });

  await prisma.course.delete({
    where: { id: courseId }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/courses");
  revalidatePath("/admin/registrations");
  if (course) revalidatePath(`/register/${course.slug}`);
}

export async function deleteRegistrationAction(registrationId: string) {
  await requireAdmin();

  await prisma.registration.delete({
    where: { id: registrationId }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/registrations");
}
