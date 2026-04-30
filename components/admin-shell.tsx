import { AdminNav } from "@/components/admin-nav";
import { DatabaseRequired } from "@/components/database-required";
import { requireAdmin } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/prisma";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  if (!hasDatabaseUrl) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DatabaseRequired />
      </div>
    );
  }

  await requireAdmin();
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.10),transparent_34%),#f8fafc] lg:flex">
      <AdminNav />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
