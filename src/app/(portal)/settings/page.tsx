import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <h2 className="font-mono text-2xl font-semibold text-slate-900">Configuracion</h2>
        <p className="mt-2 text-sm text-slate-600">Personaliza tu experiencia en Reclu.</p>
      </section>

      <section className="reclu-card p-6">
        <h3 className="font-mono text-lg font-semibold text-slate-900">Mis Creditos</h3>
        <p className="mt-2 text-sm text-slate-600">Saldo actual: 202 creditos disponibles.</p>
        <Link
          className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          href="/credits/purchase"
        >
          Comprar creditos
        </Link>
        <p className="mt-3 text-xs text-slate-500">
          Los creditos utilizados para enviar evaluaciones no son reembolsables.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Historial de transacciones</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            {[
              "Recarga de 200 creditos por administrador · +200 · Saldo: 210",
              "Evaluacion Estres y Resiliencia enviada a Johan · -2 · Saldo: 10",
              "Evaluacion Valores e Integridad enviada a Johan · -2 · Saldo: 12",
              "Evaluacion Acumen (ACI) enviada a Johan · -2 · Saldo: 14",
            ].map((item) => (
              <div className="reclu-surface p-3" key={item}>
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Configuracion Actual</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="reclu-surface p-3">Cuenta: Activa</div>
            <div className="reclu-surface p-3">Creditos: 202 disponibles</div>
            <div className="reclu-surface p-3">Idioma: Espanol</div>
          </div>
        </article>
      </section>
    </div>
  );
}

