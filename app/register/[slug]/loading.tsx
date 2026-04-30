import { Brand } from "@/components/brand";

export default function RegisterLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:py-10">
      <section className="mx-auto max-w-2xl">
        <div className="mb-6 flex justify-center">
          <Brand />
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-soft">
          <div className="aspect-[16/10] animate-pulse bg-slate-200" />
          <div className="space-y-5 p-5 sm:p-8">
            <div className="mx-auto h-9 w-64 animate-pulse rounded-2xl bg-slate-200" />
            <div className="mx-auto h-5 w-80 max-w-full animate-pulse rounded-2xl bg-slate-100" />
            <div className="mt-8 space-y-4 rounded-2xl border bg-white p-4 sm:p-6">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-11 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
