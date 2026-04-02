import Link from "next/link";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Campana: {id.replaceAll("-", " ")}
        </p>
        <h2 className="mt-1 font-mono text-2xl font-semibold text-slate-900">Seleccion de desarrollador</h2>
        <p className="mt-1 text-sm text-slate-600">Desarrollador Full Stack · Analizando</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Agregar Candidatos
          </button>
          <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            Analizar Resultados
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Candidatos", value: "4" },
          { label: "Completada", value: "4" },
          { label: "Pendientes", value: "0" },
          { label: "Progreso", value: "100%" },
        ].map((item) => (
          <article className="reclu-card p-4" key={item.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-slate-900">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="reclu-card p-6">
        <h3 className="font-mono text-lg font-semibold text-slate-900">Resumen</h3>
        <p className="mt-2 text-sm text-slate-600">
          Se identifico un candidato excepcional para Desarrollador Full Stack: Angel Osorio.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm text-slate-700">
          <div className="reclu-surface p-3">Top Candidato · Angel Osorio · 80%</div>
          <div className="reclu-surface p-3">Excelente fit (≥80) · 1</div>
          <div className="reclu-surface p-3">Buen fit (65-79) · 0</div>
          <div className="reclu-surface p-3">Fit moderado (50-64) · 3</div>
        </div>
      </section>

      <section className="reclu-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Candidatos (4)</h3>
          <Link className="text-sm font-semibold text-blue-700" href="/analytics">
            Ver Analisis
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {[
            "#1 Angel Osorio · Completada · 4/7 · Score 80%",
            "#2 Paola · Completada · 1/7 · Score 64%",
            "#3 Alejandro Zapata · Completada · 1/7 · Score 64%",
            "#4 john valencia · Completada · 7/7 · Score 58%",
          ].map((item) => (
            <div className="reclu-surface p-3 text-sm text-slate-700" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

