import Link from "next/link";

export default function EvaluationsGuidePage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <h2 className="font-mono text-2xl font-semibold text-slate-900">Guia de Evaluaciones MotivaIQ</h2>
        <p className="mt-2 text-sm text-slate-600">
          Conoce a fondo cada una de las 8 evaluaciones del sistema.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["DISC", "Fuerzas Motivadoras", "Inteligencia Emocional", "DNA-25", "Acumen (ACI)", "Valores", "Estres", "Pruebas Tecnicas"].map((tab, idx) => (
            <button
              className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                idx === 0 ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-700"
              }`}
              key={tab}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <article className="reclu-card p-6">
          <h3 className="font-mono text-xl font-semibold text-slate-900">Analisis de Comportamiento DISC</h3>
          <p className="mt-1 text-sm text-slate-600">10-15 minutos · 24 preguntas</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Evalua como las personas responden a problemas, influyen en otros, responden al
            ritmo del entorno y como responden a reglas y procedimientos.
          </p>
          <button className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Enviar Evaluacion DISC
          </button>
          <h4 className="mt-6 text-sm font-semibold text-slate-900">Dimensiones que Mide</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>• Dominancia (D)</li>
            <li>• Influencia (I)</li>
            <li>• Estabilidad (S)</li>
            <li>• Cumplimiento (C)</li>
          </ul>
        </article>

        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Informacion Rapida</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="reclu-surface p-3">Duracion: 10-15 min</div>
            <div className="reclu-surface p-3">Preguntas: 24</div>
            <div className="reclu-surface p-3">Dimensiones: 4</div>
          </div>
          <h4 className="mt-5 text-sm font-semibold text-slate-900">Consejos</h4>
          <ul className="mt-2 space-y-1 text-xs text-slate-500">
            <li>• No hay estilos buenos o malos.</li>
            <li>• Combinar con otros modulos para vision 360.</li>
            <li>• Usar resultados para conversaciones de desarrollo.</li>
          </ul>
          <Link className="mt-5 inline-block text-sm font-semibold text-blue-700" href="/analytics">
            Ver Analisis Avanzado
          </Link>
        </article>
      </section>
    </div>
  );
}

