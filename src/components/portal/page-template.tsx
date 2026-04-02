type PageTemplateProps = {
  title: string;
  description: string;
  phase: string;
  highlights: string[];
  nextMilestones: string[];
};

export function PageTemplate({
  title,
  description,
  phase,
  highlights,
  nextMilestones,
}: PageTemplateProps) {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6 md:p-8">
        <div className="reclu-gradient rounded-2xl p-[1px]">
          <div className="rounded-2xl bg-white p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="reclu-pill">{phase}</span>
              <span className="reclu-pill">Base original preservada</span>
            </div>
            <h2 className="mt-4 font-mono text-2xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {highlights.map((item) => (
          <article className="reclu-card p-4" key={item}>
            <p className="text-sm font-semibold text-slate-900">{item}</p>
            <p className="mt-1 text-xs text-slate-500">
              Estructura inicial implementada para acelerar siguientes fases.
            </p>
          </article>
        ))}
      </section>

      <section className="reclu-card p-6">
        <h3 className="font-mono text-lg font-semibold text-slate-900">
          Siguiente bloque de trabajo
        </h3>
        <ul className="mt-4 space-y-2">
          {nextMilestones.map((item) => (
            <li className="text-sm text-slate-600" key={item}>
              • {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

