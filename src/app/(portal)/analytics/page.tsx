import Link from "next/link";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const mode = params.mode ?? "general";

  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <h2 className="font-mono text-2xl font-semibold text-slate-900">Analisis Avanzado</h2>
        <p className="mt-2 text-sm text-slate-600">
          Inteligencia de talento 360 con vista general, individual y comparativa.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Personas", value: "5", sub: "Total evaluados" },
          { label: "Perfil Completo", value: "2", sub: "8 modulos" },
          { label: "MotivaIQ 360", value: "1", sub: "Analisis integrado" },
          { label: "EQ Promedio", value: "72", sub: "Inteligencia Emocional" },
          { label: "Test Tecnico", value: "1", sub: "Competencias tecnicas" },
        ].map((item) => (
          <article className="reclu-card p-4" key={item.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
          </article>
        ))}
      </section>

      <section className="reclu-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Modo de Vista</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              mode === "general" ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-700"
            }`}
            href="/analytics"
          >
            Vista General
          </Link>
          <Link
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              mode === "individual"
                ? "bg-blue-600 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
            href="/analytics?mode=individual"
          >
            Individual
          </Link>
          <Link
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              mode === "compare"
                ? "bg-blue-600 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
            href="/analytics?mode=compare"
          >
            Comparar
          </Link>
        </div>
      </section>

      {mode === "compare" ? (
        <section className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Comparar Personas</h3>
          <p className="mt-1 text-sm text-slate-600">
            Descubre sinergias, compatibilidad y dinamicas de equipo (hasta 4 personas).
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              "Dinamica de Equipo",
              "Matriz de Compatibilidad",
              "Fortalezas y Brechas",
              "Sinergias y Tensiones",
            ].map((item) => (
              <div className="reclu-surface p-4 text-sm text-slate-700" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>
      ) : mode === "individual" ? (
        <section className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Analisis Individual</h3>
          <p className="mt-1 text-sm text-slate-600">Perfil completo MotivaIQ de una persona.</p>
          <input className="reclu-input mt-4" placeholder="Buscar y seleccionar persona..." type="text" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["DISC", "Fuerzas Motivadoras", "Inteligencia Emocional", "DNA-25", "Acumen", "Valores", "Estres"].map(
              (item) => (
                <div className="reclu-surface p-3 text-sm text-slate-700" key={item}>
                  {item}
                </div>
              ),
            )}
          </div>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          <article className="reclu-card p-6">
            <h3 className="font-mono text-lg font-semibold text-slate-900">Promedios del Equipo</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {[
                "EQ 72",
                "DNA 70",
                "Acumen 4.3",
                "Integridad 59",
                "Resiliencia 58%",
                "Tecnica 40%",
              ].map((item) => (
                <div className="reclu-surface p-3" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </article>
          <article className="reclu-card p-6">
            <h3 className="font-mono text-lg font-semibold text-slate-900">Personas Evaluadas</h3>
            <div className="mt-4 space-y-2">
              {[
                "Alejandro Zapata · DISC",
                "Angel Osorio · DISC FM EQ DNA",
                "john valencia · DISC FM EQ DNA ACI Val Str Tec",
              ].map((item) => (
                <div className="reclu-surface p-3 text-sm text-slate-700" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>
      )}
    </div>
  );
}

