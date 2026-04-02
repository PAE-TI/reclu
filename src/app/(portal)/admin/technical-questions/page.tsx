import Link from "next/link";

export default function TechnicalQuestionsPage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <Link className="text-sm font-semibold text-blue-700" href="/admin">
          Volver al Panel de Admin
        </Link>
        <h2 className="mt-2 font-mono text-2xl font-semibold text-slate-900">
          Gestion de Preguntas Tecnicas
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Administra las preguntas tecnicas para evaluaciones por cargo.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Preguntas", value: "13796" },
          { label: "Faciles", value: "4560" },
          { label: "Medias", value: "4560" },
          { label: "Dificiles", value: "4676" },
        ].map((item) => (
          <article className="reclu-card p-4" key={item.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-slate-900">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="reclu-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Preguntas Tecnicas</h3>
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Nueva Pregunta
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <select className="reclu-input">
            <option>Todos los cargos</option>
          </select>
          <select className="reclu-input">
            <option>Todas las dificultades</option>
            <option>Facil</option>
            <option>Media</option>
            <option>Dificil</option>
          </select>
          <input className="reclu-input" placeholder="Buscar pregunta..." type="text" />
        </div>

        <div className="mt-4 space-y-2">
          {[
            "Coordinador Academico · Facil · #1 · Que son los estilos de aprendizaje? · Respuesta A",
            "Coordinador Academico · Media · #2 · Que es la evaluacion formativa? · Respuesta A",
            "Coordinador Academico · Dificil · #3 · Como abordaria dificultades de aprendizaje? · Respuesta A",
            "Coordinador Academico · Dificil · #4 · Que es el aula invertida? · Respuesta A",
          ].map((item) => (
            <div className="reclu-surface p-3 text-sm text-slate-700" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

