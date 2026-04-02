import Link from "next/link";
import { PageTemplate } from "@/components/portal/page-template";

const campaigns = [
  { id: "demo-fullstack", name: "Seleccion Full Stack", state: "Analizando", candidates: 4 },
  { id: "demo-lawyer", name: "Abogado 2026", state: "Activa", candidates: 0 },
];

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <PageTemplate
        description="Panel de campanas con estados, volumen de candidatos y progreso de evaluaciones."
        highlights={[
          "Listado de campanas activas",
          "Estados Activa / Analizando / Completada / Archivada",
          "Acceso a detalle por campana",
        ]}
        nextMilestones={[
          "Persistencia real de campanas y candidatos.",
          "Flujo completo para crear y editar campanas.",
          "Calculo real de score promedio y progreso.",
        ]}
        phase="Etapa 1"
        title="Campanas de seleccion"
      />

      <section className="reclu-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Campanas actuales</h3>
          <Link
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            href="/campaigns/new"
          >
            Nueva campana
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {campaigns.map((campaign) => (
            <Link
              className="block rounded-xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100"
              href={`/campaigns/${campaign.id}`}
              key={campaign.id}
            >
              <p className="font-semibold text-slate-900">{campaign.name}</p>
              <p className="text-xs text-slate-500">
                Estado: {campaign.state} · Candidatos: {campaign.candidates}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

