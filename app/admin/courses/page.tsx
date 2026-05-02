import Link from "next/link";
import { Edit3, ExternalLink, Link2, Plus, Rocket } from "lucide-react";
import { deleteCourseAction } from "@/app/actions";
import { AdminShell } from "@/components/admin-shell";
import { CopyRegistrationLink } from "@/components/copy-registration-link";
import { CourseImage } from "@/components/course-image";
import { CreateCourseForm } from "@/components/create-course-form";
import { DeleteSubmitButton } from "@/components/delete-submit-button";
import { Button } from "@/components/ui/button";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CoursesPage({
  searchParams
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;
  if (!hasDatabaseUrl) {
    return <AdminShell><div /></AdminShell>;
  }

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { registrations: true } } }
  });

  return (
    <AdminShell>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Funnels</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Create registration link</h1>
          <p className="mt-2 text-sm text-slate-500">Build the course, form, and shareable link in one flow.</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg shadow-indigo-600/20">
          <Rocket className="h-5 w-5" />
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
        <section className="rounded-2xl border bg-white/90 p-5 shadow-soft backdrop-blur sm:p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
            <Plus className="h-5 w-5 text-indigo-700" />
            Course details
          </h2>
          <div className="mt-6">
            <CreateCourseForm />
          </div>
        </section>

        <section>
          {created && (
            <div className="mb-5 rounded-2xl border border-indigo-100 bg-white p-5 shadow-soft">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-indigo-700">
                <Link2 className="h-4 w-4" />
                Generated Link
              </div>
              <CopyRegistrationLink slug={created} />
            </div>
          )}
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Course Management</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Published funnels</h2>
          </div>
          <div className="grid gap-4">
            {courses.map((course) => (
              <article key={course.id} className="grid gap-4 rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-soft md:grid-cols-[150px_1fr]">
                <CourseImage src={course.imageUrl} alt={course.title} className="bg-slate-50 md:max-w-[170px]" />
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-950">{course.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{course.description}</p>
                  <p className="mt-2 text-xs font-medium text-slate-500">{course._count.registrations} registrations</p>
                  <div className="mt-4">
                    <CopyRegistrationLink slug={course.slug} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild variant="secondary" size="sm" className="rounded-2xl">
                      <Link href={`/admin/forms/${course.id}`}><Edit3 className="h-4 w-4" /> Form</Link>
                    </Button>
                    <Button asChild size="sm" className="rounded-2xl">
                      <Link href={`/register/${course.slug}`}><ExternalLink className="h-4 w-4" /> Open</Link>
                    </Button>
                    <form action={deleteCourseAction.bind(null, course.id)}>
                      <DeleteSubmitButton
                        label="Delete"
                        confirmMessage={`Delete ${course.title}? This will delete its form and all registrations.`}
                      />
                    </form>
                  </div>
                </div>
              </article>
            ))}
            {!courses.length && (
              <div className="rounded-2xl border bg-white/90 p-8 text-center shadow-soft">
                <Link2 className="mx-auto mb-4 h-8 w-8 text-indigo-700" />
                <p className="font-semibold text-slate-950">No funnels yet</p>
                <p className="mt-2 text-sm text-slate-500">Create your first course to generate a private registration link.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
