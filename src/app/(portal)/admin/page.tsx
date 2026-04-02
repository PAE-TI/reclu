import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <h2 className="font-mono text-2xl font-semibold text-slate-900">Panel de Administracion</h2>
        <p className="mt-2 text-sm text-slate-600">
          Gestiona usuarios registrados, creditos, precios y compras.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Configuracion de Registro</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <label className="reclu-surface flex items-center gap-3 p-3">
              <input defaultChecked type="radio" />
              Activo automaticamente
            </label>
            <label className="reclu-surface flex items-center gap-3 p-3">
              <input type="radio" />
              Requiere activacion
            </label>
          </div>
        </article>

        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Configuracion de Creditos</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className="reclu-input" placeholder="Creditos iniciales" type="number" />
            <input className="reclu-input" placeholder="Costo por evaluacion" type="number" />
          </div>
          <button className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Guardar
          </button>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Ventas de Creditos</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              "Ingresos Totales · $0.00 USD",
              "Creditos Vendidos · 0",
              "Ventas Completadas · 0",
            ].map((item) => (
              <div className="reclu-surface p-3 text-sm text-slate-700" key={item}>
                {item}
              </div>
            ))}
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Fecha</th>
                  <th className="px-3 py-2">Usuario</th>
                  <th className="px-3 py-2">Creditos</th>
                  <th className="px-3 py-2">Monto</th>
                  <th className="px-3 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2">20 ene 2026</td>
                  <td className="px-3 py-2">john valencia</td>
                  <td className="px-3 py-2">50</td>
                  <td className="px-3 py-2">$100.00</td>
                  <td className="px-3 py-2">Pendiente</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Pruebas Tecnicas</h3>
          <p className="mt-2 text-sm text-slate-600">
            Administra el banco de preguntas por cargo, categoria y dificultad.
          </p>
          <Link
            className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            href="/admin/technical-questions"
          >
            Gestionar Preguntas
          </Link>
        </article>
      </section>
    </div>
  );
}

