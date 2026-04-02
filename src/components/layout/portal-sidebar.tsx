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
          <p className="font-mono text-xl font-semibold tracking-tight text-slate-900">Reclu</p>
          <p className="text-xs text-slate-500">Portal Empresarial</p>
        </Link>
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cuenta</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">John Corp</p>
          <p className="text-xs text-slate-600">john valencia</p>
        </div>
      </div>
      <div className="reclu-grid-bg flex-1 space-y-6 overflow-auto p-4">
        <NavList items={mainNav} pathname={pathname} title="General" />
        <div className="space-y-2">
          <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Modulos
          </p>
          <p className="px-3 text-xs text-slate-500">Evaluaciones Psicometrica · 7</p>
          <nav className="space-y-1">
            {moduleNav.slice(0, 8).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
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
          <p className="px-3 pt-2 text-xs text-slate-500">Pruebas Tecnicas · 1</p>
          <Link
            className={`block rounded-xl px-3 py-2 text-sm transition ${
              pathname.startsWith("/external-technical-evaluations")
                ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            href="/external-technical-evaluations"
          >
            Evaluaciones Tecnicas
          </Link>
        </div>
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
