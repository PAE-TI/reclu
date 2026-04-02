import Link from "next/link";

const stats = [
  { label: "CANDIDATOS", value: "10", sub: "Total evaluados" },
  { label: "COMPLETADAS", value: "20", sub: "18%" },
  { label: "PENDIENTES", value: "0", sub: "Esperando respuesta" },
  { label: "PERFILES 360", value: "1", sub: "8 modulos completos" },
];

const actions = [
  { title: "Nueva Campana", text: "Inicia un proceso de seleccion", href: "/campaigns/new" },
  { title: "Enviar Evaluaciones", text: "Los 8 modulos disponibles", href: "/batch-evaluations" },
  {
    title: "Comparar Candidatos",
    text: "Analisis comparativo",
    href: "/analytics?mode=compare",
  },
  { title: "Ver Resultados", text: "Analisis individual", href: "/analytics?mode=individual" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-mono text-2xl font-semibold text-slate-900">Centro de Reclutamiento</h2>
            <p className="mt-1 text-sm text-slate-600">
              Tu hub para seleccionar el mejor talento.
            </p>
          </div>
          <Link
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            href="/campaigns/new"
          >
            Nueva Campana de Seleccion
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article className="reclu-card p-4" key={item.label}>
            <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-slate-500">
              {item.label}
            </p>
            <p className="mt-2 font-mono text-3xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="reclu-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-lg font-semibold text-slate-900">Acciones Rapidas</h3>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {actions.map((item) => (
              <Link
                className="reclu-surface p-4 transition hover:translate-y-[-1px] hover:shadow-md"
                href={item.href}
                key={item.title}
              >
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.text}</p>
              </Link>
            ))}
          </div>
        </article>
        <article className="reclu-gradient rounded-2xl p-[1px]">
          <div className="h-full rounded-2xl bg-slate-950 p-5 text-slate-100">
            <p className="text-xs uppercase tracking-wide text-cyan-300">Tip del Dia</p>
            <h3 className="mt-2 font-mono text-xl font-semibold">Valida Conocimientos Tecnicos</h3>
            <p className="mt-2 text-sm text-slate-300">
              Complementa evaluaciones psicometricas con pruebas tecnicas para verificar el
              conocimiento real del candidato.
            </p>
            <Link
              className="mt-4 inline-block rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              href="/external-technical-evaluations"
            >
              Aplicar ahora
            </Link>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="reclu-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-lg font-semibold text-slate-900">Actividad Reciente</h3>
            <Link className="text-sm font-semibold text-blue-700" href="/analytics">
              Ver todo
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {[
              "John Valencia · TECHNICAL · 6 de feb · Completado",
              "John Valencia · TECHNICAL · 5 de feb · Completado",
              "John Valencia · TECHNICAL · 4 de feb · Completado",
              "Johan · STRESS · 30 de ene · Expirado",
              "Johan · VALUES · 30 de ene · Expirado",
              "Johan · ACI · 30 de ene · Expirado",
            ].map((item) => (
              <div
                className="reclu-surface px-4 py-3 text-sm text-slate-700"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </article>
        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">8 Modulos de Evaluacion</h3>
          <p className="mt-2 text-xs text-slate-500">
            Combina modulos para obtener una vision 360 de cada candidato.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {["DISC", "F. Motivadoras", "EQ", "DNA-25", "Acumen", "Valores", "Estres", "Tecnica"].map(
              (item) => (
                <div className="reclu-surface px-2 py-2" key={item}>
                  {item}
                </div>
              ),
            )}
          </div>
          <Link className="mt-4 inline-block text-sm font-semibold text-blue-700" href="/evaluations-guide">
            Ver Guia
          </Link>
        </article>
      </section>
    </div>
  );
}
