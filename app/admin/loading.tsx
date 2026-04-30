export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.10),transparent_34%),#f8fafc] lg:flex">
      <div className="hidden border-r bg-white/90 lg:block lg:min-h-screen lg:w-72" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-10 w-64 animate-pulse rounded-2xl bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-2xl border bg-white shadow-sm" />
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="h-80 animate-pulse rounded-2xl border bg-white shadow-sm" />
            <div className="h-80 animate-pulse rounded-2xl border bg-white shadow-sm" />
          </div>
        </div>
      </main>
    </div>
  );
}
