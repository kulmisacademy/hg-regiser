import Link from "next/link";
import { Download, Search } from "lucide-react";
import { deleteRegistrationAction } from "@/app/actions";
import { AdminShell } from "@/components/admin-shell";
import { DeleteSubmitButton } from "@/components/delete-submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { schemaFromJson } from "@/lib/form-schema";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RegistrationsPage({
  searchParams
}: {
  searchParams: Promise<{ course?: string; district?: string; from?: string; to?: string }>;
}) {
  const filters = await searchParams;
  if (!hasDatabaseUrl) {
    return <AdminShell><div /></AdminShell>;
  }

  const courses = await prisma.course.findMany({
    orderBy: { title: "asc" },
    include: { form: true }
  });
  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    include: { course: { include: { form: true } } },
    where: {
      courseId: filters.course || undefined,
      createdAt: {
        gte: filters.from ? new Date(filters.from) : undefined,
        lte: filters.to ? new Date(`${filters.to}T23:59:59`) : undefined
      }
    }
  });

  const filtered = filters.district
    ? registrations.filter((item) => String((item.dataJson as Record<string, string>).district ?? "").toLowerCase() === filters.district?.toLowerCase())
    : registrations;

  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => Boolean(value)) as [string, string][]).toString();
  const selectedCourse = filters.course ? courses.find((course) => course.id === filters.course) : null;
  const labelByKey = new Map<string, string>();

  for (const course of courses) {
    const schema = schemaFromJson(course.form?.schemaJson);
    for (const field of schema.fields) {
      labelByKey.set(field.name, field.label);
    }
  }

  const dataColumns = selectedCourse
    ? schemaFromJson(selectedCourse.form?.schemaJson).fields.map((field) => ({ key: field.name, label: field.label }))
    : Array.from(
        filtered.reduce((keys, item) => {
          const data = item.dataJson as Record<string, unknown>;
          Object.keys(data).forEach((key) => keys.add(key));
          return keys;
        }, new Set<string>())
      ).map((key) => ({ key, label: labelByKey.get(key) ?? key }));
  const tableColumnCount = dataColumns.length + (selectedCourse ? 2 : 3);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Registration Table</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Student registrations</h1>
            <p className="mt-2 text-sm text-slate-500">Filter submissions and export clean Excel reports.</p>
          </div>
          <Button asChild className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-indigo-600/15">
            <Link href={`/api/registrations/export${query ? `?${query}` : ""}`}>
              <Download className="h-4 w-4" />
              Export Excel
            </Link>
          </Button>
        </div>

        <form className="grid gap-3 rounded-2xl border bg-white/90 p-4 shadow-soft backdrop-blur md:grid-cols-5">
          <Select name="course" defaultValue={filters.course ?? ""}>
            <option value="">All courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </Select>
          <Input name="district" defaultValue={filters.district ?? ""} placeholder="District" />
          <Input name="from" type="date" defaultValue={filters.from ?? ""} />
          <Input name="to" type="date" defaultValue={filters.to ?? ""} />
          <Button type="submit" variant="secondary" className="rounded-2xl">
            <Search className="h-4 w-4" />
            Filter
          </Button>
        </form>

        <div className="overflow-hidden rounded-2xl border bg-white/90 shadow-soft backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {!selectedCourse && <th className="px-4 py-3">Course</th>}
                  {dataColumns.map((column) => (
                    <th key={column.key} className="px-4 py-3">{column.label}</th>
                  ))}
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((item) => {
                  const data = item.dataJson as Record<string, string>;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      {!selectedCourse && <td className="px-4 py-3 font-medium text-slate-900">{item.course.title}</td>}
                      {dataColumns.map((column) => (
                        <td key={column.key} className="max-w-[260px] px-4 py-3 text-slate-600">
                          <span className="block truncate" title={String(data[column.key] ?? "")}>
                            {data[column.key] || "-"}
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-3 text-slate-500">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-3">
                        <form action={deleteRegistrationAction.bind(null, item.id)}>
                          <DeleteSubmitButton
                            label="Delete"
                            confirmMessage="Delete this registration record?"
                          />
                        </form>
                      </td>
                    </tr>
                  );
                })}
                {!filtered.length && (
                  <tr>
                    <td colSpan={tableColumnCount} className="px-4 py-10 text-center text-sm text-slate-500">
                      No registrations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
