import { Database } from "lucide-react";

export function DatabaseRequired() {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4">
      <div className="rounded-md border bg-white p-8 text-center shadow-soft">
        <Database className="mx-auto mb-5 h-10 w-10 text-indigo-700" />
        <h1 className="text-2xl font-bold text-slate-950">Database setup required</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Add your Neon PostgreSQL connection string to `.env` as `DATABASE_URL`, then run `npm run db:push` and `npm run db:seed`.
        </p>
      </div>
    </div>
  );
}
