export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <h2 className="font-mono text-2xl font-semibold text-slate-900">Nueva Campana de Seleccion</h2>
        <p className="mt-2 text-sm text-slate-600">
          Define el cargo, selecciona evaluaciones y comienza a recibir perfiles completos.
        </p>
      </section>

      <section className="reclu-card p-6">
        <h3 className="font-mono text-lg font-semibold text-slate-900">Informacion de la Campana</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="reclu-input" placeholder="Nombre de la Campana *" type="text" />
          <input className="reclu-input" placeholder="Cargo a Buscar *" type="text" />
        </div>
        <textarea
          className="reclu-input mt-3 min-h-24"
          placeholder="Descripcion (opcional)"
        />
      </section>

      <section className="reclu-card p-6">
        <h3 className="font-mono text-lg font-semibold text-slate-900">Visibilidad y Permisos</h3>
        <div className="mt-4 space-y-2">
          <label className="reclu-surface flex items-center gap-3 p-3 text-sm text-slate-700">
            <input defaultChecked type="radio" />
            Privada · Solo tu y usuarios con acceso completo pueden verla.
          </label>
          <label className="reclu-surface flex items-center gap-3 p-3 text-sm text-slate-700">
            <input type="radio" />
            Publica · Todos los miembros del equipo pueden verla.
          </label>
          <label className="reclu-surface flex items-center gap-3 p-3 text-sm text-slate-700">
            <input type="checkbox" />
            Permitir que el equipo agregue candidatos.
          </label>
        </div>
      </section>

      <section className="reclu-card p-6">
        <h3 className="font-mono text-lg font-semibold text-slate-900">Evaluaciones a Enviar</h3>
        <p className="mt-1 text-sm text-slate-600">
          Selecciona las evaluaciones que se enviaran a cada candidato (2 creditos por evaluacion).
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "DISC",
            "Fuerzas Motivadoras",
            "Inteligencia Emocional",
            "DNA-25",
            "Acumen",
            "Valores e Integridad",
            "Estres y Resiliencia",
            "Tecnica",
          ].map((moduleName) => (
            <label className="reclu-surface flex items-center gap-2 p-3 text-sm text-slate-700" key={moduleName}>
              <input defaultChecked={moduleName !== "Tecnica"} type="checkbox" />
              {moduleName}
            </label>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Basico (3)</p>
          <p className="mt-1 text-sm text-blue-900">Costo por candidato: 3 evaluaciones × 2 creditos = 6</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            Cancelar
          </button>
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Crear Campana
          </button>
        </div>
      </section>
    </div>
  );
}

