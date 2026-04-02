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

const testimonials = [
  {
    quote: "Reclu transformo nuestra forma de contratar y redujo la rotacion inicial.",
    author: "Maria Gonzalez · Directora RRHH",
  },
  {
    quote: "Los reportes nos ayudaron a crear equipos mas efectivos.",
    author: "Carlos Rodriguez · CEO",
  },
  {
    quote: "Pasamos de semanas de evaluacion manual a decisiones mas precisas.",
    author: "Ana Martinez · Talento",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <Link className="font-mono text-xl font-semibold tracking-tight" href="/">
            Reclu
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a className="hover:text-slate-900" href="#evaluaciones">
              Evaluaciones
            </a>
            <a className="hover:text-slate-900" href="#campanas">
              Campanas
            </a>
            <a className="hover:text-slate-900" href="#beneficios">
              Beneficios
            </a>
            <a className="hover:text-slate-900" href="#faq">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <span className="reclu-pill hidden sm:inline-flex">ES</span>
            <Link
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              href="/auth/signin"
            >
              Iniciar Sesion
            </Link>
            <Link
              className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(29,78,216,.28)] hover:bg-blue-700"
              href="/auth/signup"
            >
              Comenzar Gratis
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 pt-14 md:grid-cols-[1.07fr_.93fr] md:px-6">
          <div>
            <span className="reclu-pill">Headhunter Tecnologico con IA</span>
            <h1 className="mt-5 font-mono text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
              Tu seleccionador de talento inteligente
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              Reclu analiza candidatos con 8 modulos de evaluacion cientifica para encontrar al
              profesional ideal para tu empresa. Sin sesgos, con datos precisos.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,.32)] hover:bg-blue-700"
                href="/auth/signup"
              >
                Comenzar a Seleccionar
              </Link>
              <a
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                href="#como-funciona"
              >
                Como Funciona
              </a>
            </div>
            <div className="mt-9 grid max-w-md grid-cols-3 gap-3">
              {[
                { n: "96%", l: "Precision" },
                { n: "-70%", l: "Tiempo" },
                { n: "+85%", l: "Retencion" },
              ].map((item) => (
                <div className="reclu-card p-3 text-center" key={item.l}>
                  <p className="font-mono text-2xl font-semibold">{item.n}</p>
                  <p className="text-xs text-slate-500">{item.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -right-4 -top-6 h-32 w-32 rounded-full bg-cyan-300/40 blur-2xl" />
            <div className="pointer-events-none absolute -left-6 bottom-6 h-32 w-32 rounded-full bg-blue-300/40 blur-2xl" />
            <div className="reclu-gradient rounded-3xl p-[1px]">
              <div className="rounded-3xl bg-slate-950 p-6 text-slate-100">
                <p className="text-xs uppercase tracking-[0.12em] text-cyan-300">Busqueda en curso</p>
                <h2 className="mt-2 font-mono text-2xl font-semibold">Product Manager Senior</h2>
                <p className="mt-2 text-sm text-slate-300">Candidatos evaluados · 24 / 30</p>
                <div className="mt-5 space-y-3">
                  {[
                    "1. Maria Lopez G. · Match Excelente · 94%",
                    "2. Carlos R. Perez · Match Alto · 89%",
                    "3. Ana Martinez D. · Match Alto · 85%",
                  ].map((row) => (
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3" key={row}>
                      <p className="text-sm">{row}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-400">Modulos aplicados: DISC · EQ · DNA · TEC</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white/60 py-14 backdrop-blur-sm">
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

        <section className="border-y border-slate-200 bg-white/60 py-14 backdrop-blur-sm" id="como-funciona">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <h2 className="font-mono text-3xl font-semibold">Proceso Simple</h2>
            <p className="mt-2 text-sm text-slate-600">Encuentra talento en 3 pasos.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  n: "01",
                  t: "Crea tu campana",
                  d: "Define cargo, selecciona modulos y carga candidatos.",
                },
                {
                  n: "02",
                  t: "Reclu analiza",
                  d: "Los candidatos completan evaluaciones y el sistema procesa resultados.",
                },
                {
                  n: "03",
                  t: "Recibe tu ranking",
                  d: "Obtienes comparacion y compatibilidad para decidir con datos.",
                },
              ].map((step) => (
                <article className="reclu-card p-5" key={step.n}>
                  <p className="text-xs font-semibold text-slate-500">{step.n}</p>
                  <h3 className="mt-1 font-semibold">{step.t}</h3>
                  <p className="mt-1 text-sm text-slate-600">{step.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6" id="beneficios">
          <h2 className="font-mono text-3xl font-semibold">Reportes Detallados</h2>
          <p className="mt-2 text-sm text-slate-600">
            Graficas, scores y analisis visuales para comparar candidatos con objetividad.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { t: "DISC", d: "Estilo conductual" },
              { t: "EQ", d: "Inteligencia emocional" },
              { t: "Tecnica", d: "Conocimiento por cargo" },
            ].map((card) => (
              <div className="reclu-card p-5" key={card.t}>
                <p className="text-sm font-semibold">{card.t}</p>
                <p className="mt-1 text-xs text-slate-500">{card.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white/60 py-14 backdrop-blur-sm" id="campanas">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <h2 className="font-mono text-3xl font-semibold">Para Todo Tipo de Empresa</h2>
            <p className="mt-2 text-sm text-slate-600">
              Desde startups hasta enterprise con evaluacion estandarizada.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { t: "Startups", d: "1-10 empleados" },
                { t: "PyMEs", d: "10-500 empleados" },
                { t: "Enterprise", d: "500+ empleados" },
              ].map((segment) => (
                <article className="reclu-card p-5" key={segment.t}>
                  <p className="text-xs text-slate-500">{segment.d}</p>
                  <h3 className="mt-1 font-semibold">{segment.t}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6">
          <h2 className="font-mono text-3xl font-semibold">Testimonios</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <article className="reclu-card p-5" key={item.author}>
                <p className="text-sm text-slate-700">&quot;{item.quote}&quot;</p>
                <p className="mt-3 text-xs text-slate-500">{item.author}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white/60 py-14 backdrop-blur-sm" id="faq">
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
          <div className="reclu-gradient rounded-3xl p-[1px]">
            <div className="rounded-3xl bg-white p-8 text-center">
              <h2 className="font-mono text-3xl font-semibold">Comienza hoy</h2>
              <p className="mt-2 text-sm text-slate-600">
                Encuentra el talento que tu empresa merece.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(37,99,235,.28)] hover:bg-blue-700"
                  href="/auth/signup"
                >
                  Crear Cuenta Gratis
                </Link>
                <Link
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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

