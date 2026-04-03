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
      <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {title}
      </p>
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              className={`reclu-sidebar-link group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
                isActive ? "active" : ""
              }`}
              href={item.href}
              key={item.href}
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full transition ${
                  isActive
                    ? "bg-[linear-gradient(135deg,#5f6af7_0%,#7b4ef9_100%)]"
                    : "bg-slate-300 group-hover:bg-slate-400"
                }`}
              />
              <span className="font-medium">{item.label}</span>
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
    <aside className="reclu-portal-sidebar hidden w-[300px] shrink-0 xl:flex xl:flex-col">
      <div className="border-b border-slate-200 px-6 py-5">
        <Link href="/dashboard">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#5f6af7_0%,#7b4ef9_100%)] text-sm font-bold text-white shadow-[0_12px_24px_rgba(95,106,247,.24)]">
              R
            </div>
            <div>
              <p className="font-mono text-xl font-semibold tracking-tight text-slate-900">Reclu</p>
              <p className="text-xs text-slate-500">Portal Empresarial</p>
            </div>
          </div>
        </Link>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_28px_rgba(12,24,44,.06)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Cuenta activa
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">John Corp</p>
          <p className="text-xs text-slate-500">john valencia</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="text-xs font-medium text-slate-500">Espacio empresarial sincronizado</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-6 overflow-auto px-4 py-5">
        <NavList items={mainNav} pathname={pathname} title="General" />
        <div className="space-y-2">
          <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Modulos
          </p>
          <p className="px-3 text-xs text-slate-500">Evaluaciones psicometricas · 7</p>
          <nav className="space-y-1">
            {moduleNav.slice(0, 8).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  className={`reclu-sidebar-link block rounded-2xl px-3 py-2.5 text-sm transition ${
                    isActive ? "active" : ""
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="px-3 pt-2 text-xs text-slate-500">Pruebas tecnicas · 1</p>
          <Link
            className={`reclu-sidebar-link block rounded-2xl px-3 py-2.5 text-sm transition ${
              pathname.startsWith("/external-technical-evaluations") ? "active" : ""
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
          className="reclu-sidebar-link block rounded-2xl border px-3 py-2.5 text-center text-sm font-semibold"
          href="/auth/signin"
        >
          Cerrar sesion
        </Link>
      </div>
    </aside>
  );
}
