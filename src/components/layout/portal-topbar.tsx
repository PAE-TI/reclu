"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { moduleNav } from "@/lib/portal-navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Centro de Reclutamiento",
  "/analytics": "Analisis Avanzado",
  "/campaigns": "Campanas de Seleccion",
  "/team": "Gestion de Equipo",
  "/admin": "Panel de Administracion",
  "/profile": "Perfil Empresarial",
  "/settings": "Configuracion",
};

export function PortalTopbar() {
  const pathname = usePathname();
  const title =
    pageTitles[pathname] ||
    pageTitles[Object.keys(pageTitles).find((key) => pathname.startsWith(key)) ?? ""] ||
    "Reclu";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm text-slate-500">John Corp</p>
          <h1 className="truncate font-mono text-lg font-semibold text-slate-900">{title}</h1>
        </div>
        <div className="hidden flex-1 items-center justify-center xl:flex">
          <input
            className="w-full max-w-xl rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none ring-blue-200 transition focus:ring"
            placeholder="Buscar candidatos, evaluaciones o acciones... (⌘K)"
            type="text"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="reclu-pill">ES</span>
          <span className="reclu-pill">202</span>
          <span className="reclu-pill">4</span>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-3 py-2 xl:hidden">
        {moduleNav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
