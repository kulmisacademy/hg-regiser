import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { FormBuilder } from "@/components/form-builder";
import { Button } from "@/components/ui/button";
import { defaultRegistrationSchema, schemaFromJson } from "@/lib/form-schema";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CourseFormPage({
  params,
  searchParams
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { courseId } = await params;
  const { saved } = await searchParams;
  if (!hasDatabaseUrl) {
    return <AdminShell><div /></AdminShell>;
  }

  const course = await prisma.course.findUnique({ where: { id: courseId }, include: { form: true } });
  if (!course) notFound();

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/courses"><ArrowLeft className="h-4 w-4" /> Courses</Link>
            </Button>
            <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">{course.title} form builder</h1>
            <p className="mt-2 text-sm text-slate-500">Add fields, choose field types, and set dropdown options for this course.</p>
          </div>
          <Button asChild variant="secondary" className="rounded-2xl">
            <Link href={`/register/${course.slug}`}>Preview Form</Link>
          </Button>
        </div>
        {saved && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">Form saved successfully.</p>}
        <div className="rounded-2xl border bg-white/90 p-5 shadow-soft backdrop-blur">
          <FormBuilder courseId={course.id} schema={schemaFromJson(course.form?.schemaJson ?? defaultRegistrationSchema)} />
        </div>
      </div>
    </AdminShell>
  );
}
