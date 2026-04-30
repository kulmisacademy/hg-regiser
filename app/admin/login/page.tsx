import { loginAction } from "@/app/actions";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-md border bg-white p-8 shadow-soft">
        <div className="mb-8">
          <Brand />
        </div>
        <h1 className="text-2xl font-bold text-slate-950">Admin login</h1>
        <p className="mt-2 text-sm text-slate-500">Manage courses, forms, and registrations.</p>
        <form action={loginAction} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <Input name="email" type="email" required defaultValue="admin@hoggaan.com" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <Input name="password" type="password" required placeholder="Admin password" />
          </label>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">Invalid email or password.</p>}
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    </main>
  );
}
