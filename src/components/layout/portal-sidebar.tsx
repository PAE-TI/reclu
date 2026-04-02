"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, moduleNav, supportNav, type NavItem } from "@/lib/portal-navigation";

function NavList({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <section className="space-y-2">
      <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {title}
      </p>
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              className={`block rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </section>
  );
}

export function PortalSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white xl:flex xl:flex-col">
      <div className="border-b border-slate-200 px-6 py-5">
        <Link href="/dashboard">
          <p className="font-mono text-xl font-semibold tracking-tight text-slate-900">
            Reclu
          </p>
          <p className="text-xs text-slate-500">Portal empresarial</p>
        </Link>
      </div>
      <div className="reclu-grid-bg flex-1 space-y-6 overflow-auto p-4">
        <NavList items={mainNav} pathname={pathname} title="General" />
        <NavList items={moduleNav} pathname={pathname} title="Modulos" />
        <NavList items={supportNav} pathname={pathname} title="Cuenta" />
      </div>
      <div className="border-t border-slate-200 p-4">
        <Link
          className="block rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
          href="/auth/signin"
        >
          Cerrar sesion
        </Link>
      </div>
    </aside>
  );
}

