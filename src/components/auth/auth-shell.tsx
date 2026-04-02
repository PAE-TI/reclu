import Link from "next/link";
import type { ReactNode } from "react";

const modules = [
  { name: "DISC", desc: "Estilo conductual", tone: "from-blue-500 to-cyan-500" },
  { name: "Fuerzas Motivadoras", desc: "Impulso profesional", tone: "from-violet-500 to-fuchsia-500" },
  { name: "Inteligencia Emocional", desc: "Gestion emocional", tone: "from-rose-500 to-pink-500" },
  { name: "DNA-25", desc: "Competencias medibles", tone: "from-emerald-500 to-teal-500" },
  { name: "Acumen", desc: "Juicio y criterio", tone: "from-amber-500 to-orange-500" },
  { name: "Valores", desc: "Alineacion cultural", tone: "from-indigo-500 to-violet-500" },
  { name: "Estres y Resiliencia", desc: "Respuesta bajo presion", tone: "from-red-500 to-orange-500" },
  { name: "Pruebas Tecnicas", desc: "Skill fit por cargo", tone: "from-sky-500 to-blue-500" },
];

type AuthShellProps = {
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
};

export function AuthShell({ title, description, footer, children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#eef4ff] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,.16),_transparent_22%),linear-gradient(120deg,_#132042_0%,_#1b2458_42%,_#16315d_100%)] px-10 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="pointer-events-none absolute left-10 top-10 h-24 w-24 rounded-full bg-cyan-300/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-12 right-10 h-36 w-36 rounded-full bg-blue-400/12 blur-3xl" />

          <div className="relative z-10">
            <Link className="inline-flex items-center gap-3" href="/">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/14 shadow-[0_10px_24px_rgba(2,6,23,.18)] backdrop-blur-sm">
                <span className="text-sm font-bold text-white">R</span>
              </div>
              <span className="text-sm font-semibold tracking-wide text-white/95">Reclu</span>
            </Link>

            <div className="mt-16 max-w-md">
              <h1 className="font-mono text-4xl font-semibold leading-tight text-white xl:text-5xl">
                Bienvenido de nuevo
              </h1>
              <p className="mt-4 text-base leading-8 text-slate-200">
                Continua gestionando el talento de tu organizacion con evaluaciones basadas en
                ciencia, datos y comparativos visuales.
              </p>
            </div>

            <div className="mt-12 grid max-w-xl gap-3 sm:grid-cols-2">
              {modules.map((moduleItem, index) => (
                <article
                  className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 shadow-[0_18px_34px_rgba(2,6,23,.16)] backdrop-blur-sm"
                  key={moduleItem.name}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${moduleItem.tone} text-sm font-bold text-white shadow-[0_12px_20px_rgba(2,6,23,.18)]`}
                    >
                      {moduleItem.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{moduleItem.name}</p>
                      <p className="mt-1 text-xs text-slate-300">{moduleItem.desc}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
            <p>Reclu Platform · Seleccion basada en evidencia</p>
            <p>UI inspirada en la experiencia original</p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-end text-xs text-slate-400">
              <span>ES</span>
            </div>

            <main className="rounded-[2rem] border border-white/70 bg-white/90 p-7 shadow-[0_28px_70px_rgba(15,23,42,.10)] backdrop-blur-sm sm:p-8">
              <div className="mb-6 text-center">
                <p className="font-mono text-3xl font-semibold text-slate-900">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
              </div>

              {children}

              <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
                {footer}
              </div>
            </main>

            <div className="mt-6 text-center text-[11px] leading-6 text-slate-400">
              <p>
                <Link className="hover:text-slate-600" href="/terms">
                  Terminos y Condiciones
                </Link>
              </p>
              <p className="mt-1">© 2026 Reclu. Plataforma de seleccion de talento empresarial.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
