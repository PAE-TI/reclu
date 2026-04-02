import Link from "next/link";

const metrics = [
  { label: "Candidatos", value: "10", help: "Total evaluados" },
  { label: "Completadas", value: "20", help: "18% variacion" },
  { label: "Pendientes", value: "0", help: "Esperando respuesta" },
  { label: "Perfiles 360", value: "1", help: "8 modulos completos" },
];

const quickActions = [
  { label: "Nueva campana", href: "/campaigns/new" },
  { label: "Enviar evaluaciones", href: "/batch-evaluations" },
  { label: "Comparar candidatos", href: "/analytics?mode=compare" },
  { label: "Ver resultados", href: "/analytics?mode=individual" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6 md:p-8">
        <span className="reclu-pill">Etapa 1 - shell funcional</span>
        <h2 className="mt-4 font-mono text-2xl font-semibold text-slate-900">
          Centro de reclutamiento
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Estructura inicial basada en la plataforma original. En siguientes etapas
          conectaremos autenticacion, base de datos, evaluaciones reales y scoring.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <article className="reclu-card p-4" key={item.label}>
            <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-1 text-xs text-slate-500">{item.help}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Acciones rapidas</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickActions.map((item) => (
              <Link
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </article>
        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Siguiente etapa</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Integrar autenticacion de usuarios y organizaciones.</li>
            <li>• Conectar PostgreSQL de DigitalOcean con base dedicada reclu.</li>
            <li>• Crear entidades base de campanas, candidatos y creditos.</li>
            <li>• Empezar modulo DISC end-to-end con envio real.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}

