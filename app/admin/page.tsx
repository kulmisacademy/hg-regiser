import Link from "next/link";
import { ArrowUpRight, Clock, Library, TrendingUp, Users } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!hasDatabaseUrl) {
    return <AdminShell><div /></AdminShell>;
  }

  const [registrations, courses, recent] = await Promise.all([
    prisma.registration.count(),
    prisma.course.findMany({ include: { _count: { select: { registrations: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.registration.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { course: true } })
  ]);

  return (
    <AdminShell>
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Track funnel performance and recent student submissions.</p>
        </div>
        <Button asChild className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-indigo-600/15">
          <Link href="/admin/courses">Create Course <ArrowUpRight className="h-4 w-4" /></Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Total registrations" value={registrations} icon={Users} />
        <Stat label="Published funnels" value={courses.length} icon={Library} />
        <Stat label="Top course" value={courses.sort((a, b) => b._count.registrations - a._count.registrations)[0]?.title ?? "None"} icon={TrendingUp} />
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border bg-white/90 p-5 shadow-soft backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-950">Course popularity</h2>
          <div className="mt-5 space-y-4">
            {courses.map((course) => (
              <div key={course.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{course.title}</span>
                  <span className="text-slate-500">{course._count.registrations}</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-slate-100">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all" style={{ width: `${Math.min(100, course._count.registrations * 20)}%` }} />
                </div>
              </div>
            ))}
            {!courses.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No published funnels yet.</p>}
          </div>
        </div>

        <div className="rounded-2xl border bg-white/90 p-5 shadow-soft backdrop-blur">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
            <Clock className="h-5 w-5 text-indigo-700" />
            Recent submissions
          </h2>
          <div className="mt-5 divide-y">
            {recent.map((item) => {
              const data = item.dataJson as Record<string, string>;
              return (
                <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{data.fullName ?? data.name ?? "Student"}</p>
                    <p className="text-sm text-slate-500">{item.course.title}</p>
                  </div>
                  <p className="text-right text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </div>
              );
            })}
            {!recent.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No registrations yet.</p>}
          </div>
        </div>
      </section>
    </div>
    </AdminShell>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Users }) {
  return (
    <div className="rounded-2xl border bg-white/90 p-5 shadow-soft backdrop-blur transition hover:-translate-y-0.5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
