import Image from "next/image";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image src="/logo.jpg" alt="Hoggaan Academy logo" width={compact ? 40 : 52} height={compact ? 40 : 52} className="rounded-2xl object-cover" />
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Hoggaan Academy</p>
        {!compact && <p className="text-xs text-slate-500">Build Your Future with Skills</p>}
      </div>
    </div>
  );
}
