import { notFound } from "next/navigation";
import { submitRegistration } from "@/app/actions";
import { Brand } from "@/components/brand";
import { CourseImage } from "@/components/course-image";
import { DynamicRegistrationForm } from "@/components/dynamic-registration-form";
import { defaultRegistrationSchema, schemaFromJson } from "@/lib/form-schema";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = hasDatabaseUrl
    ? await prisma.course.findUnique({
        where: { slug },
        include: { form: true }
      })
    : null;

  if (!course) {
    if (hasDatabaseUrl) notFound();
    if (slug !== "demo") notFound();
  }

  const activeCourse = course ?? {
    id: "demo",
    title: "Web Development",
    description: "Learn practical web development with Hoggaan Academy.",
    imageUrl: "/logo.jpg",
    form: { schemaJson: defaultRegistrationSchema }
  };
  const schema = schemaFromJson(activeCourse.form?.schemaJson ?? defaultRegistrationSchema);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:py-10">
      <section className="mx-auto max-w-2xl">
        <div className="mb-6 flex justify-center">
          <Brand />
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-soft backdrop-blur">
          <CourseImage src={activeCourse.imageUrl} alt={activeCourse.title} priority className="rounded-none border-b bg-slate-50" />
          <div className="p-5 sm:p-8">
            <div>
              <h1 className="text-center text-3xl font-bold text-slate-950 sm:text-4xl">{activeCourse.title}</h1>
              <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-7 text-slate-600">{activeCourse.description}</p>
            </div>
            <div className="mt-8 rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
              <DynamicRegistrationForm courseId={activeCourse.id} schema={schema} submitAction={submitRegistration} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
