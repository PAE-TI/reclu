export default function TechnicalEvaluationsPage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <h2 className="font-mono text-2xl font-semibold text-slate-900">Evaluaciones Tecnicas Externas</h2>
        <p className="mt-2 text-sm text-slate-600">
          Envia evaluaciones tecnicas especificas para cada cargo a candidatos externos.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Enviadas", value: "4" },
          { label: "Completadas", value: "3" },
          { label: "Pendientes", value: "0" },
          { label: "Expiradas", value: "1" },
        ].map((item) => (
          <article className="reclu-card p-4" key={item.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-slate-900">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <article className="reclu-card p-6">
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              Enviar Evaluacion
            </button>
            <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              Gestionar (4)
            </button>
          </div>
          <h3 className="mt-6 font-mono text-lg font-semibold text-slate-900">Enviar Evaluacion Tecnica</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="reclu-input" placeholder="Nombre Completo *" type="text" />
            <input className="reclu-input" placeholder="Correo Electronico *" type="email" />
          </div>
          <select className="reclu-input mt-3">
            <option>Todas las categorias</option>
            <option>Tecnologia e IT</option>
            <option>Administracion y Finanzas</option>
            <option>Recursos Humanos</option>
          </select>
          <select className="reclu-input mt-3">
            <option>Director General / CEO</option>
            <option>Desarrollador Full Stack</option>
            <option>Analista Financiero</option>
            <option>Reclutador</option>
          </select>
          <button className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Enviar Evaluacion Tecnica
          </button>
        </article>

        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Cobertura</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• +225 cargos especializados.</li>
            <li>• +13,700 preguntas tecnicas.</li>
            <li>• Dificultad: Basico, Intermedio y Avanzado.</li>
            <li>• Categorizacion por industria y subrol.</li>
          </ul>
          <h4 className="mt-5 text-sm font-semibold text-slate-900">Categorias clave</h4>
          <p className="mt-2 text-xs leading-6 text-slate-500">
            Direccion Ejecutiva, Finanzas, RRHH, Ventas, Marketing, Tecnologia, Operaciones,
            Logistica, Legal, Salud, Educacion, Ingenieria y mas.
          </p>
        </article>
      </section>
    </div>
  );
}

