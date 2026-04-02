import Link from "next/link";

const campaigns = [
  {
    id: "abogado-2026",
    name: "Abogado 2026",
    state: "Activa",
    visibility: "Publica",
    role: "Abogado Corporativo",
    date: "6 feb 2026",
    candidates: 0,
    evaluated: 0,
    pending: 0,
  },
  {
    id: "prueba-johan",
    name: "Prueba Johan",
    state: "Activa",
    visibility: "Publica",
    role: "Closer",
    date: "30 ene 2026",
    candidates: 0,
    evaluated: 0,
    pending: 0,
  },
  {
    id: "seleccion-de-desarrollador",
    name: "Seleccion de desarrollador",
    state: "Analizando",
    visibility: "Privada",
    role: "Desarrollador Full Stack",
    date: "20 ene 2026",
    candidates: 4,
    evaluated: 4,
    pending: 0,
  },
];

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-mono text-2xl font-semibold text-slate-900">Campanas de Seleccion</h2>
            <p className="mt-1 text-sm text-slate-600">MotivaIQ Recruitment Suite</p>
          </div>
          <Link
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            href="/campaigns/new"
          >
            Nueva Campana
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Campanas", value: "3", sub: "Procesos de seleccion" },
          { label: "Campanas Activas", value: "3", sub: "En progreso" },
          { label: "Candidatos", value: "4", sub: "0 pendientes" },
          { label: "Evaluados", value: "4", sub: "Perfiles completos" },
        ].map((item) => (
          <article className="reclu-card p-4" key={item.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
          </article>
        ))}
      </section>

      <section className="reclu-card p-6">
        <div className="flex flex-wrap gap-2">
          {["Todas", "Activas", "Analizando", "Completadas", "Archivadas"].map((tab) => (
            <button
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                tab === "Todas" ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-700"
              }`}
              key={tab}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-5 space-y-3">
          {campaigns.map((campaign) => (
            <Link
              className="block rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
              href={`/campaigns/${campaign.id}`}
              key={campaign.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{campaign.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {campaign.state} · {campaign.visibility} · {campaign.role} · {campaign.date}
                  </p>
                </div>
                <p className="text-xs font-semibold text-slate-500">Score Prom. 66.5%</p>
              </div>
              <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
                <div className="reclu-surface p-2">Candidatos: {campaign.candidates}</div>
                <div className="reclu-surface p-2">Evaluados: {campaign.evaluated}</div>
                <div className="reclu-surface p-2">Pendientes: {campaign.pending}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

