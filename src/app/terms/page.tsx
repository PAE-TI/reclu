export default function TermsPage() {
  return (
    <div className="reclu-grid-bg min-h-screen p-6 md:p-10">
      <main className="reclu-card mx-auto w-full max-w-4xl p-8">
        <h1 className="font-mono text-3xl font-semibold text-slate-900">
          Terminos y condiciones
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Documento base temporal para etapa inicial de Reclu. El texto legal definitivo se
          agregara en una fase posterior junto con politica de datos, consentimiento y uso de
          evaluaciones.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-slate-600">
          <li>• Uso exclusivo para procesos de evaluacion y reclutamiento.</li>
          <li>• Manejo de datos sujeto a politicas de privacidad de la empresa.</li>
          <li>• Creditos consumidos por evaluacion enviada.</li>
          <li>• Enlaces de evaluacion con vencimiento controlado.</li>
        </ul>
      </main>
    </div>
  );
}

