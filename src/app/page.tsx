import Link from "next/link";

const modules = [
  { name: "DISC", desc: "Estilo conductual y comunicacion" },
  { name: "Motivadores", desc: "12 fuerzas que impulsan decisiones" },
  { name: "EQ", desc: "Inteligencia emocional aplicada al trabajo" },
  { name: "DNA-25", desc: "Competencias clave para desempeno real" },
  { name: "Acumen", desc: "Claridad de juicio y capacidad analitica" },
  { name: "Valores", desc: "Alineacion cultural e integridad" },
  { name: "Estres", desc: "Resiliencia y manejo bajo presion" },
  { name: "Tecnica", desc: "225+ cargos y 13,700+ preguntas" },
];

const featureCards = [
  {
    title: "Ranking inteligente",
    text: "Priorizacion automatica de candidatos por compatibilidad global.",
  },
  {
    title: "Perfil 360",
    text: "Integracion psicometrica y tecnica para decisiones sin sesgos.",
  },
  {
    title: "Comparacion avanzada",
    text: "Dinamicas de equipo, sinergias y posibles tensiones.",
  },
];

const testimonials = [
  {
    quote:
      "Reclu transformo nuestra forma de contratar. Bajamos la rotacion en el primer ano.",
    author: "Maria Gonzalez · Directora RRHH",
  },
  {
    quote:
      "Los reportes comparativos hicieron evidente el mejor fit para cada vacante critica.",
    author: "Carlos Rodriguez · CEO",
  },
  {
    quote:
      "Pasamos de procesos lentos y subjetivos a un flujo con datos claros y accionables.",
    author: "Ana Martinez · Gerente de Talento",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <Link className="font-mono text-xl font-semibold tracking-tight" href="/">
            Reclu
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            <a className="hover:text-slate-900" href="#modulos">
              Modulos
            </a>
            <a className="hover:text-slate-900" href="#proceso">
              Proceso
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
              className="reclu-btn-primary rounded-xl px-3 py-2 text-sm font-semibold !text-white shadow-[0_10px_24px_rgba(37,99,235,.28)]"
              href="/auth/signup"
            >
              Comenzar Gratis
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-200/80">
          <div className="pointer-events-none absolute inset-0 reclu-hero-grid opacity-70" />
          <div className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-blue-300/35 blur-3xl reclu-glow-shift" />
          <div className="pointer-events-none absolute -right-24 top-28 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl reclu-glow-shift" />
          <div className="pointer-events-none absolute bottom-[-80px] left-[28%] h-64 w-64 rounded-full bg-indigo-200/35 blur-3xl reclu-glow-shift" />

          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-18 pt-16 md:px-6 lg:grid-cols-[1.08fr_.92fr] lg:gap-10 lg:pt-20">
            <div className="reclu-fade-up">
              <span className="reclu-pill">Headhunter Tecnologico con IA</span>
              <h1 className="mt-5 font-mono text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Tu seleccionador de talento inteligente
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Reclu analiza candidatos con 8 modulos de evaluacion cientifica para encontrar al
                profesional ideal para tu empresa. Sin sesgos, con datos precisos.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  className="reclu-btn-primary rounded-xl px-5 py-3 text-sm font-semibold !text-white shadow-[0_12px_28px_rgba(37,99,235,.32)]"
                  href="/auth/signup"
                >
                  Comenzar a Seleccionar
                </Link>
                <a
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  href="#proceso"
                >
                  Como Funciona
                </a>
              </div>

              <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
                {[
                  { value: "96%", label: "Precision" },
                  { value: "-70%", label: "Tiempo" },
                  { value: "+85%", label: "Retencion" },
                ].map((item, index) => (
                  <div
                    className="reclu-card p-3 text-center reclu-fade-up"
                    key={item.label}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <p className="font-mono text-2xl font-semibold">{item.value}</p>
                    <p className="text-xs text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="reclu-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="reclu-gradient rounded-3xl p-[1px] reclu-float shadow-[0_28px_70px_rgba(15,23,42,.25)]">
                <div className="rounded-3xl bg-slate-950 p-6 text-slate-100">
                  <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">Busqueda en curso</p>
                  <h2 className="mt-2 font-mono text-2xl font-semibold">Product Manager Senior</h2>
                  <p className="mt-2 text-sm text-slate-300">Candidatos evaluados · 24 / 30</p>
                  <div className="mt-5 space-y-3">
                    {[
                      "1. Maria Lopez G. · Match Excelente · 94%",
                      "2. Carlos R. Perez · Match Alto · 89%",
                      "3. Ana Martinez D. · Match Alto · 85%",
                    ].map((row) => (
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm" key={row}>
                        {row}
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-slate-400">Modulos aplicados: DISC · EQ · DNA · TEC</p>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.12em] text-cyan-300">Compatibilidad</p>
                      <p className="text-xs text-slate-300">Ultimos 7 dias</p>
                    </div>
                    <div className="mt-3 flex h-20 items-end gap-2">
                      {[32, 48, 41, 63, 58, 76, 92].map((value, index) => (
                        <div className="flex-1" key={`${value}-${index}`}>
                          <div
                            className="reclu-bar-anim rounded-md bg-gradient-to-t from-cyan-400 to-blue-500"
                            style={{ height: `${value}%`, animationDelay: `${index * 90}ms` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="reclu-line-anim mt-3 h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6" id="beneficios">
          <div className="grid gap-4 md:grid-cols-3">
            {featureCards.map((feature, index) => (
              <article
                className="reclu-card p-5 reclu-fade-up"
                key={feature.title}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <h3 className="font-mono text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-14 text-white">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
            <h2 className="font-mono text-3xl font-semibold">El Problema</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-200">
              Contratar sin datos cuesta caro. El 46% de las contrataciones fallan en los
              primeros 18 meses y las entrevistas tradicionales tienen baja efectividad predictiva.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { kpi: "46%", label: "Contrataciones fallidas" },
                { kpi: "2x", label: "Costo por reemplazo" },
                { kpi: "18m", label: "Impacto operativo" },
              ].map((item) => (
                <article className="rounded-xl border border-white/15 bg-white/5 p-4" key={item.label}>
                  <p className="font-mono text-2xl font-semibold text-cyan-300">{item.kpi}</p>
                  <p className="mt-1 text-xs text-slate-200">{item.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6" id="modulos">
          <h2 className="font-mono text-3xl font-semibold">8 Modulos de Analisis</h2>
          <p className="mt-2 text-sm text-slate-600">
            Cada modulo evalua una dimension clave del candidato para construir un perfil 360.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((moduleItem, index) => (
              <article
                className="reclu-card p-4 reclu-fade-up"
                key={moduleItem.name}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <p className="text-sm font-semibold">{moduleItem.name}</p>
                <p className="mt-1 text-xs text-slate-500">{moduleItem.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-14" id="proceso">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
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
              ].map((step, index) => (
                <article
                  className="reclu-card p-5 reclu-fade-up"
                  key={step.n}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-xs font-semibold text-slate-500">{step.n}</p>
                  <h3 className="mt-1 font-semibold">{step.t}</h3>
                  <p className="mt-1 text-sm text-slate-600">{step.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
          <h2 className="font-mono text-3xl font-semibold">Testimonios</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <article
                className="reclu-card p-5 reclu-fade-up"
                key={item.author}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <p className="text-sm text-slate-700">&quot;{item.quote}&quot;</p>
                <p className="mt-3 text-xs text-slate-500">{item.author}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-100/90 py-14" id="faq">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
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

        <section className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
          <div className="reclu-gradient rounded-3xl p-[1px]">
            <div className="rounded-3xl bg-white p-8 text-center">
              <h2 className="font-mono text-3xl font-semibold">Comienza hoy</h2>
              <p className="mt-2 text-sm text-slate-600">
                Encuentra el talento que tu empresa merece.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  className="reclu-btn-primary rounded-xl px-5 py-3 text-sm font-semibold !text-white shadow-[0_10px_24px_rgba(37,99,235,.28)]"
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
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-sm text-slate-500 md:px-6">
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
