export default function TeamPage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <h2 className="font-mono text-2xl font-semibold text-slate-900">Gestion de Equipo</h2>
        <p className="mt-2 text-sm text-slate-600">
          Administra facilitadores de tu empresa. Ellos usan creditos de la cuenta principal.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Miembros Activos", value: "2" },
          { label: "Pendientes", value: "0" },
          { label: "Evaluaciones Enviadas", value: "2" },
          { label: "Tu Empresa", value: "John Corp" },
        ].map((item) => (
          <article className="reclu-card p-4" key={item.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-slate-900">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Miembros del Equipo</h3>
          <p className="mt-1 text-sm text-slate-600">
            Los facilitadores usan creditos de tu cuenta para enviar evaluaciones.
          </p>
          <div className="mt-4 space-y-3">
            {[
              "john faccilitador full · Activo · Admin 2 · Acceso completo · 1 evaluaciones",
              "john facilitador 1 · Activo · RRHH · Solo sus evaluaciones · 1 evaluaciones",
            ].map((item) => (
              <div className="reclu-surface p-4 text-sm text-slate-700" key={item}>
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Invitar Facilitador</h3>
          <div className="mt-4 space-y-3">
            <input className="reclu-input" placeholder="Nombre completo" type="text" />
            <input className="reclu-input" placeholder="Correo electronico" type="email" />
            <input className="reclu-input" placeholder="Cargo" type="text" />
            <select className="reclu-input">
              <option>Solo sus evaluaciones</option>
              <option>Acceso completo</option>
            </select>
            <button className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Enviar Invitacion
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

