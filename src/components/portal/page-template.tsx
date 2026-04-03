type PageTemplateProps = {
  title: string;
  description: string;
  badge?: string;
  highlights: string[];
  details?: string[];
};

export function PageTemplate({
  title,
  description,
  badge,
  highlights,
  details = [],
}: PageTemplateProps) {
  return (
    <div className="space-y-6">
      <section className="reclu-portal-hero p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            {badge ? <span className="reclu-portal-chip">{badge}</span> : null}
            <h2 className="mt-4 font-mono text-2xl font-semibold text-slate-900 md:text-3xl">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {highlights.map((item) => (
          <article className="reclu-portal-card-soft p-4" key={item}>
            <p className="text-sm font-semibold text-slate-900">{item}</p>
            <p className="mt-1 text-xs text-slate-500">Indicador clave de esta seccion.</p>
          </article>
        ))}
      </section>

      {details.length > 0 ? (
        <section className="reclu-portal-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Detalle</h3>
          <ul className="mt-4 space-y-2">
            {details.map((item) => (
              <li className="text-sm text-slate-600" key={item}>
                • {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
