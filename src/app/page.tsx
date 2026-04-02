import Link from "next/link";

export default function Home() {
  return (
    <div className="reclu-grid-bg min-h-screen px-6 py-10 md:px-12 md:py-14">
      <main className="mx-auto w-full max-w-6xl space-y-6">
        <section className="reclu-card p-8 md:p-10">
          <span className="reclu-pill">Reclu · Etapa 1 activa</span>
          <h1 className="mt-4 max-w-2xl font-mono text-4xl font-semibold leading-tight text-slate-900">
            Plataforma de reclutamiento y evaluacion basada en la estructura del producto
            original.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Esta primera etapa deja la base del sistema: arquitectura de rutas, shell del
            portal y modulos principales. Las etapas siguientes agregaran autenticacion real,
            logica de creditos, evaluaciones, scoring, analitica y persistencia productiva.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              href="/dashboard"
            >
              Ir al portal
            </Link>
            <Link
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              href="/guia-plataforma"
            >
              Ver guia inicial
            </Link>
            <Link
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              href="/auth/signin"
            >
              Iniciar sesion
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
