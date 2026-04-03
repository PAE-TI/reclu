"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { moduleNav } from "@/lib/portal-navigation";
import type { CurrentUser } from "@/lib/auth-types";

const pageTitles: Record<string, string> = {
  "/dashboard": "Centro de Reclutamiento",
  "/analytics": "Analisis Avanzado",
  "/campaigns": "Campanas de Seleccion",
  "/team": "Gestion de Equipo",
  "/admin": "Panel de Administracion",
  "/profile": "Perfil Empresarial",
  "/settings": "Configuracion",
};

type PortalTopbarProps = {
  user: CurrentUser;
};

export function PortalTopbar({ user }: PortalTopbarProps) {
  const pathname = usePathname();
  const title =
    pageTitles[pathname] ||
    pageTitles[Object.keys(pageTitles).find((key) => pathname.startsWith(key)) ?? ""] ||
    "Reclu";

  const displayName = user.fullName ?? user.email;
  const companyName = user.companyName ?? "Tu empresa";
  const initials = (displayName || "R")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
      <div className="flex min-h-16 items-center gap-4 px-4 py-3 md:px-6">
        <div className="min-w-0 flex-[0.9]">
          <p className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {companyName}
          </p>
          <h1 className="truncate font-mono text-xl font-semibold text-slate-900">{title}</h1>
        </div>
        <div className="hidden flex-[1.1] items-center justify-center xl:flex">
          <div className="relative w-full max-w-2xl">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>
            <input
              className="reclu-input !rounded-2xl !border-slate-200 !bg-white pl-9 shadow-[0_10px_24px_rgba(12,24,44,.05)]"
              placeholder="Buscar candidatos, evaluaciones o acciones... (⌘K)"
              type="text"
            />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="reclu-portal-chip hidden sm:inline-flex">ES</span>
          <span className="reclu-portal-chip">202 creditos</span>
          <span className="reclu-portal-chip">4 alertas</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#5f6af7_0%,#7b4ef9_100%)] text-xs font-bold text-white shadow-[0_12px_24px_rgba(95,106,247,.24)]">
            {initials || "R"}
          </div>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-3 py-2 xl:hidden">
        {moduleNav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                active
                  ? "bg-[linear-gradient(135deg,#5f6af7_0%,#7b4ef9_100%)] text-white"
                  : "bg-slate-100 text-slate-600"
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
