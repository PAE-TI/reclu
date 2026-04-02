import Link from "next/link";

const modules = [
  "DISC",
  "Motivadores",
  "EQ",
  "DNA-25",
  "Acumen",
  "Valores",
  "Estres",
  "Tecnica",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <Link className="font-mono text-xl font-semibold tracking-tight" href="/">
            Reclu
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#evaluaciones">Evaluaciones</a>
            <a href="#campanas">Campanas</a>
            <a href="#beneficios">Beneficios</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <span className="reclu-pill">ES</span>
            <Link
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
              href="/auth/signin"
            >
              Iniciar Sesion
            </Link>
            <Link
              className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              href="/auth/signup"
            >
              Comenzar Gratis
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-14 pt-14 md:grid-cols-2 md:px-6">
          <div>
            <p className="reclu-pill inline-block">Headhunter Tecnologico con IA</p>
            <h1 className="mt-4 font-mono text-4xl font-semibold leading-tight md:text-5xl">
              Tu seleccionador de talento inteligente
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              Reclu analiza candidatos con 8 modulos de evaluacion cientifica para encontrar
              al profesional ideal para tu empresa. Sin sesgos, con datos precisos.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                href="/auth/signup"
              >
                Comenzar a Seleccionar
              </Link>
              <a
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                href="#como-funciona"
              >
                Como Funciona
              </a>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
              <div className="reclu-card p-3 text-center">
                <p className="font-mono text-2xl font-semibold">96%</p>
                <p className="text-xs text-slate-500">Precision</p>
              </div>
              <div className="reclu-card p-3 text-center">
                <p className="font-mono text-2xl font-semibold">-70%</p>
                <p className="text-xs text-slate-500">Tiempo</p>
              </div>
              <div className="reclu-card p-3 text-center">
                <p className="font-mono text-2xl font-semibold">+85%</p>
                <p className="text-xs text-slate-500">Retencion</p>
              </div>
            </div>
          </div>
          <div className="reclu-gradient rounded-2xl p-[1px]">
            <div className="rounded-2xl bg-slate-950 p-5 text-slate-100">
              <p className="text-xs uppercase tracking-wide text-cyan-300">Busqueda en curso</p>
              <h2 className="mt-2 font-mono text-2xl font-semibold">Product Manager Senior</h2>
              <p className="mt-2 text-sm text-slate-300">Candidatos evaluados · 24 / 30</p>
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-sm">1. Maria Lopez G. · Match Excelente</p>
                  <p className="text-xs text-cyan-300">94% compatibilidad</p>
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-sm">2. Carlos R. Perez · Match Alto</p>
                  <p className="text-xs text-cyan-300">89% compatibilidad</p>
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-sm">3. Ana Martinez D. · Match Alto</p>
                  <p className="text-xs text-cyan-300">85% compatibilidad</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Modulos aplicados: DISC · EQ · DNA · TEC
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-14">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <h2 className="font-mono text-3xl font-semibold">El Problema</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Contratar sin datos cuesta caro. El 46% de las contrataciones fallan en los
              primeros 18 meses y las entrevistas tradicionales tienen baja efectividad predictiva.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6" id="evaluaciones">
          <h2 className="font-mono text-3xl font-semibold">8 Modulos de Analisis</h2>
          <p className="mt-2 text-sm text-slate-600">
            Cada modulo evalua una dimension clave del candidato para construir un perfil 360.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((moduleName) => (
              <article className="reclu-card p-4" key={moduleName}>
                <p className="font-semibold">{moduleName}</p>
                <p className="mt-1 text-xs text-slate-500">Evaluacion especializada</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-14" id="como-funciona">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <h2 className="font-mono text-3xl font-semibold">Proceso Simple</h2>
            <p className="mt-2 text-sm text-slate-600">Encuentra talento en 3 pasos.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="reclu-card p-5">
                <p className="text-xs font-semibold text-slate-500">01</p>
                <h3 className="mt-1 font-semibold">Crea tu campana</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Define cargo, selecciona modulos y carga candidatos.
                </p>
              </article>
              <article className="reclu-card p-5">
                <p className="text-xs font-semibold text-slate-500">02</p>
                <h3 className="mt-1 font-semibold">Reclu analiza</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Los candidatos completan evaluaciones y el sistema procesa resultados.
                </p>
              </article>
              <article className="reclu-card p-5">
                <p className="text-xs font-semibold text-slate-500">03</p>
                <h3 className="mt-1 font-semibold">Recibe tu ranking</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Obtienes comparacion y compatibilidad para decidir con datos.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6" id="beneficios">
          <h2 className="font-mono text-3xl font-semibold">Reportes Detallados</h2>
          <p className="mt-2 text-sm text-slate-600">
            Graficas, scores y analisis visuales para comparar candidatos con objetividad.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="reclu-card p-5">
              <p className="text-sm font-semibold">DISC</p>
              <p className="mt-1 text-xs text-slate-500">Estilo conductual</p>
            </div>
            <div className="reclu-card p-5">
              <p className="text-sm font-semibold">EQ</p>
              <p className="mt-1 text-xs text-slate-500">Inteligencia emocional</p>
            </div>
            <div className="reclu-card p-5">
              <p className="text-sm font-semibold">Tecnica</p>
              <p className="mt-1 text-xs text-slate-500">Conocimiento por cargo</p>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-14">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <h2 className="font-mono text-3xl font-semibold">Para Todo Tipo de Empresa</h2>
            <p className="mt-2 text-sm text-slate-600">
              Desde startups hasta enterprise con evaluacion estandarizada.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="reclu-card p-5">
                <p className="text-xs text-slate-500">1-10 empleados</p>
                <h3 className="mt-1 font-semibold">Startups</h3>
              </article>
              <article className="reclu-card p-5">
                <p className="text-xs text-slate-500">10-500 empleados</p>
                <h3 className="mt-1 font-semibold">PyMEs</h3>
              </article>
              <article className="reclu-card p-5">
                <p className="text-xs text-slate-500">500+ empleados</p>
                <h3 className="mt-1 font-semibold">Enterprise</h3>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6">
          <h2 className="font-mono text-3xl font-semibold">Testimonios</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="reclu-card p-5">
              <p className="text-sm text-slate-700">
                &quot;Reclu transformo nuestra forma de contratar y redujo la rotacion inicial.&quot;
              </p>
              <p className="mt-3 text-xs text-slate-500">Maria Gonzalez · Directora RRHH</p>
            </article>
            <article className="reclu-card p-5">
              <p className="text-sm text-slate-700">
                &quot;Los reportes nos ayudaron a crear equipos mas efectivos.&quot;
              </p>
              <p className="mt-3 text-xs text-slate-500">Carlos Rodriguez · CEO</p>
            </article>
            <article className="reclu-card p-5">
              <p className="text-sm text-slate-700">
                &quot;Pasamos de semanas de evaluacion manual a decisiones mas precisas.&quot;
              </p>
              <p className="mt-3 text-xs text-slate-500">Ana Martinez · Talento</p>
            </article>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-14" id="faq">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <h2 className="font-mono text-3xl font-semibold">Preguntas Frecuentes</h2>
            <div className="mt-6 space-y-3">
              {[
                "Que incluye Reclu?",
                "Como funcionan las campanas de reclutamiento?",
                "Cuanto tiempo toman las evaluaciones?",
                "Que cargos cubren las pruebas tecnicas?",
                "Como se protegen los datos?",
              ].map((question) => (
                <article className="reclu-card p-4" key={question}>
                  <h3 className="text-sm font-semibold">{question}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6">
          <div className="reclu-gradient rounded-2xl p-[1px]">
            <div className="rounded-2xl bg-white p-7 text-center">
              <h2 className="font-mono text-3xl font-semibold">Comienza hoy</h2>
              <p className="mt-2 text-sm text-slate-600">
                Encuentra el talento que tu empresa merece.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  href="/auth/signup"
                >
                  Crear Cuenta Gratis
                </Link>
                <Link
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  href="/auth/signin"
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 text-sm text-slate-500 md:px-6">
          <p>
            <span className="font-mono font-semibold text-slate-900">Reclu</span> · Headhunter
            Tecnologico
          </p>
          <Link href="/terms">Terminos y Condiciones</Link>
        </div>
      </footer>
    </div>
  );
}
