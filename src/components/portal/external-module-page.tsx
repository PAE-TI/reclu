import Link from "next/link";

type ExternalModulePageProps = {
  title: string;
  subtitle: string;
  sent: number;
  completed: number;
  pending: number;
  expired: number;
  manageCount: number;
};

export function ExternalModulePage({
  title,
  subtitle,
  sent,
  completed,
  pending,
  expired,
  manageCount,
}: ExternalModulePageProps) {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <h2 className="font-mono text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Enviadas", value: sent },
          { label: "Completadas", value: completed },
          { label: "Pendientes", value: pending },
          { label: "Expiradas", value: expired },
        ].map((item) => (
          <article className="reclu-card p-4" key={item.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-slate-900">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
        <article className="reclu-card p-6">
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              Enviar Evaluacion
            </button>
            <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              Gestionar ({manageCount})
            </button>
          </div>
          <h3 className="mt-6 font-mono text-lg font-semibold text-slate-900">Crear y Enviar Evaluacion</h3>
          <p className="mt-1 text-sm text-slate-600">
            Completa los datos del destinatario y envia una evaluacion por correo electronico.
          </p>
          <div className="mt-4 space-y-3">
            <input className="reclu-input" placeholder="Nombre Completo *" type="text" />
            <input className="reclu-input" placeholder="Correo Electronico *" type="email" />
            <button className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Enviar Evaluacion
            </button>
          </div>
        </article>

        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Como Funciona</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Completa el formulario con los datos del evaluado.</li>
            <li>• Se envia automaticamente un correo con instrucciones.</li>
            <li>• El evaluado completa la prueba desde el enlace.</li>
            <li>• Recibes los resultados para revisar en Analisis.</li>
          </ul>
          <h4 className="mt-5 text-sm font-semibold text-slate-900">Importante</h4>
          <ul className="mt-2 space-y-1 text-xs text-slate-500">
            <li>• El enlace expira en 30 dias.</li>
            <li>• Solo puede ser usado una vez.</li>
            <li>• El evaluado no necesita crear cuenta.</li>
            <li>• Puedes eliminar evaluaciones para reenviar.</li>
          </ul>
          <Link className="mt-5 inline-block text-sm font-semibold text-blue-700" href="/analytics">
            Ver Analisis
          </Link>
        </article>
      </section>
    </div>
  );
}

