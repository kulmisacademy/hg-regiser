import Link from "next/link";
import { ArrowRight, Link2 } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <section className="w-full max-w-xl rounded-2xl border bg-white/85 p-8 text-center shadow-soft backdrop-blur">
        <div className="mb-8 flex justify-center">
          <Brand />
        </div>
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-soft">
          <Link2 className="h-5 w-5" />
        </div>
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Link-based course registration</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">
          Hoggaan Academy courses are opened through private registration links shared by the admin.
        </p>
        <Button asChild className="mt-8 rounded-2xl">
          <Link href="/admin">
            Admin Panel
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </main>
  );
}
