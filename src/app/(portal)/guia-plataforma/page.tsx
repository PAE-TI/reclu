import Link from "next/link";

export default function PlatformGuidePage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <h2 className="font-mono text-2xl font-semibold text-slate-900">Guia Completa de MotivaIQ</h2>
        <p className="mt-2 text-sm text-slate-600">
          Todo lo que necesitas saber para usar la plataforma paso a paso.
        </p>
      </section>

      <section className="reclu-card p-6">
        <h3 className="font-mono text-lg font-semibold text-slate-900">Contenido de la Guia</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Enviar Evaluaciones",
            "Gestionar Evaluaciones",
            "Ver Resultados",
            "Analisis Avanzado",
            "Notas y Comentarios",
            "Gestion de Equipo",
          ].map((item) => (
            <div className="reclu-surface p-4 text-sm font-semibold text-slate-800" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="reclu-card p-6">
        <h3 className="font-mono text-lg font-semibold text-slate-900">1. Enviar Evaluaciones</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Ubicacion: menu lateral o botones principales en dashboard. Ingresa nombre, correo,
          selecciona modulos, revisa costo en creditos y envia evaluaciones.
        </p>
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          <li>• Cada evaluacion consume creditos.</li>
          <li>• El destinatario recibe enlace seguro por correo.</li>
          <li>• El enlace expira en 30 dias.</li>
        </ul>
      </section>

      <section className="reclu-card p-6">
        <h3 className="font-mono text-lg font-semibold text-slate-900">Listo para comenzar?</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            href="/batch-evaluations"
          >
            Enviar Pruebas
          </Link>
          <Link
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            href="/analytics"
          >
            Ver Analisis Avanzado
          </Link>
        </div>
      </section>
    </div>
  );
}

