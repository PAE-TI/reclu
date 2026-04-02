export default function BatchEvaluationsPage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <h2 className="font-mono text-2xl font-semibold text-slate-900">Enviar Pruebas de Evaluacion</h2>
        <p className="mt-2 text-sm text-slate-600">
          Envia multiples evaluaciones a una persona con un solo formulario.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Creditos a usar", value: "0", sub: "Disponibles: 202" },
          { label: "Seleccionadas", value: "0", sub: "2 creditos c/u" },
          { label: "Preguntas", value: "0", sub: "~0 minutos" },
          { label: "Formato", value: "Unico", sub: "Recomendado" },
        ].map((item) => (
          <article className="reclu-card p-4" key={item.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Datos del Destinatario</h3>
          <div className="mt-4 space-y-3">
            <input className="reclu-input" placeholder="Nombre completo" type="text" />
            <input className="reclu-input" placeholder="Correo electronico" type="email" />
          </div>

          <h3 className="mt-6 font-mono text-lg font-semibold text-slate-900">Formato de Envio</h3>
          <div className="mt-3 space-y-2">
            <label className="reclu-surface flex items-start gap-3 p-3">
              <input defaultChecked type="radio" />
              <span className="text-sm text-slate-700">
                <strong>Un solo correo</strong> · Todas las evaluaciones en un unico email.
              </span>
            </label>
            <label className="reclu-surface flex items-start gap-3 p-3">
              <input type="radio" />
              <span className="text-sm text-slate-700">
                <strong>Un correo por evaluacion</strong> · Cada prueba en email separado.
              </span>
            </label>
          </div>

          <h3 className="mt-6 font-mono text-lg font-semibold text-slate-900">Seleccionar Evaluaciones</h3>
          <button className="mt-3 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            Seleccionar todas
          </button>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              "DISC · 24 preguntas · 10-15 min",
              "Fuerzas Motivadoras · 12 preguntas · 8-10 min",
              "Inteligencia Emocional · 25 preguntas · 10-12 min",
              "DNA-25 Competencias · 25 preguntas · 10-12 min",
              "Acumen (ACI) · 30 preguntas · 12-15 min",
              "Valores e Integridad · 25 preguntas · 10-12 min",
              "Estres y Resiliencia · 25 preguntas · 10-12 min",
            ].map((item) => (
              <label className="reclu-surface flex items-center gap-2 p-3 text-sm text-slate-700" key={item}>
                <input type="checkbox" />
                {item}
              </label>
            ))}
          </div>
        </article>

        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Resumen del Envio</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Evaluaciones seleccionadas: 0 de 7</li>
            <li>• Total preguntas: 0</li>
            <li>• Tiempo estimado: ~0 min</li>
          </ul>
          <button className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Enviar 0 evaluaciones
          </button>
          <p className="mt-3 text-xs text-slate-500">
            El destinatario recibira un unico correo con todos los enlaces de evaluacion.
          </p>
        </article>
      </section>
    </div>
  );
}

