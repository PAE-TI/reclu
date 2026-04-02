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
      <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#88a1cc]">
        {title}
      </p>
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              className={`reclu-sidebar-link block rounded-xl px-3 py-2 text-sm transition ${
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
    </section>
  );
}

export function PortalSidebar() {
  const pathname = usePathname();
  return (
    <aside className="reclu-sidebar hidden w-72 shrink-0 border-r border-[#1a325d] xl:flex xl:flex-col">
      <div className="border-b border-[#1a325d] px-6 py-5">
        <Link href="/dashboard">
          <p className="font-mono text-xl font-semibold tracking-tight text-white">Reclu</p>
          <p className="text-xs text-[#9cb2d9]">Portal Empresarial</p>
        </Link>
        <div className="mt-3 rounded-xl border border-[#244277] bg-[#0f2142] p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8ca9d8]">Cuenta</p>
          <p className="mt-1 text-sm font-semibold text-white">John Corp</p>
          <p className="text-xs text-[#abc1e8]">john valencia</p>
        </div>
      </div>
      <div className="flex-1 space-y-6 overflow-auto p-4">
        <NavList items={mainNav} pathname={pathname} title="General" />
        <div className="space-y-2">
          <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#88a1cc]">
            Modulos
          </p>
          <p className="px-3 text-xs text-[#9cb2d9]">Evaluaciones Psicometrica · 7</p>
          <nav className="space-y-1">
            {moduleNav.slice(0, 8).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  className={`reclu-sidebar-link block rounded-xl px-3 py-2 text-sm transition ${
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
          <p className="px-3 pt-2 text-xs text-[#9cb2d9]">Pruebas Tecnicas · 1</p>
          <Link
            className={`reclu-sidebar-link block rounded-xl px-3 py-2 text-sm transition ${
              pathname.startsWith("/external-technical-evaluations") ? "active" : ""
            }`}
            href="/external-technical-evaluations"
          >
            Evaluaciones Tecnicas
          </Link>
        </div>
        <NavList items={supportNav} pathname={pathname} title="Cuenta" />
      </div>
      <div className="border-t border-[#1a325d] p-4">
        <Link
          className="reclu-sidebar-link block rounded-xl border border-[#254173] px-3 py-2 text-center text-sm font-medium"
          href="/auth/signin"
        >
          Cerrar sesion
        </Link>
      </div>
    </aside>
  );
}
