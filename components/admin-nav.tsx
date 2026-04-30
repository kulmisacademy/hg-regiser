"use client";

import Link from "next/link";
import { BarChart3, FileSpreadsheet, LayoutDashboard, Library, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();
  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/courses", label: "Courses", icon: Library },
    { href: "/admin/registrations", label: "Registrations", icon: FileSpreadsheet },
    { href: "/", label: "Public Site", icon: BarChart3 }
  ];
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="border-b border-slate-200/80 bg-white/90 backdrop-blur lg:sticky lg:top-0 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:block lg:space-y-7 lg:px-5 lg:py-6">
        <div className="rounded-2xl border bg-slate-50 p-3">
          <Brand compact />
        </div>
        <nav className="hidden gap-1.5 lg:grid">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                isActive(href) && "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/20 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <Button type="submit" variant="secondary" size="sm" className="rounded-2xl lg:w-full">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:hidden">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "whitespace-nowrap rounded-2xl border bg-white px-3 py-2 text-sm font-medium text-slate-600",
              isActive(href) && "border-indigo-600 bg-indigo-600 text-white"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
