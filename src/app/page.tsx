import Link from "next/link";

const metrics = [
  { value: "96%", label: "Precision" },
  { value: "-70%", label: "Tiempo" },
  { value: "+85%", label: "Retencion" },
];

const painPoints = [
  "Procesos manuales y subjetivos",
  "Decisiones basadas en entrevistas",
  "Semanas revisando CVs manualmente",
  "Alta rotacion por malas contrataciones",
  "Sin metrica de compatibilidad real",
  "Sesgos inconscientes en entrevistas",
];

const benefits = [
  "Analisis cientifico con 8 modulos",
  "Ranking automatico de candidatos",
  "85% de retencion a 2 anos",
  "Compatibilidad medida con precision",
  "Evaluacion objetiva y sin sesgos",
];

const modules = [
  {
    name: "DISC",
    desc: "Estilo conductual y comunicacion",
    tone: "border-blue-300 bg-blue-100",
    iconBg: "bg-blue-500",
    icon: "disc",
  },
  {
    name: "Motivadores",
    desc: "12 fuerzas que impulsan decisiones",
    tone: "border-violet-300 bg-violet-100",
    iconBg: "bg-violet-500",
    icon: "flame",
  },
  {
    name: "EQ",
    desc: "Inteligencia emocional",
    tone: "border-rose-300 bg-rose-100",
    iconBg: "bg-rose-500",
    icon: "heart",
  },
  {
    name: "DNA-25",
    desc: "25 competencias medibles",
    tone: "border-emerald-300 bg-emerald-100",
    iconBg: "bg-emerald-500",
    icon: "cross",
  },
  {
    name: "Acumen",
    desc: "Claridad en toma de decisiones",
    tone: "border-amber-300 bg-amber-100",
    iconBg: "bg-amber-500",
    icon: "target",
  },
  {
    name: "Valores",
    desc: "Alineacion cultural",
    tone: "border-fuchsia-300 bg-fuchsia-100",
    iconBg: "bg-fuchsia-500",
    icon: "shield",
  },
  {
    name: "Estres",
    desc: "Manejo bajo presion",
    tone: "border-orange-300 bg-orange-100",
    iconBg: "bg-orange-500",
    icon: "bolt",
  },
  {
    name: "Tecnica",
    desc: "+225 cargos · 13,700+ preguntas",
    tone: "border-cyan-300 bg-cyan-100",
    iconBg: "bg-cyan-500",
    icon: "grid",
  },
];

const candidates = [
  { name: "Maria Lopez G.", tag: "Match Excelente", score: "94%", active: true },
  { name: "Carlos R. Perez", tag: "Match Alto", score: "89%" },
  { name: "Ana Martinez D.", tag: "Match Alto", score: "85%" },
];

function ModuleIcon({ type }: { type: string }) {
  const common = "h-5 w-5 text-white";

  if (type === "disc") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </svg>
    );
  }

  if (type === "flame") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24">
        <path
          d="M12 3c1.5 3-1 4.7 1.8 7.1 1.4 1.1 2.2 2.6 2.2 4.3A4.9 4.9 0 1 1 8 10.8C8.8 8.6 10.6 7 12 3Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "heart") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24">
        <path
          d="M12 19s-6-3.8-6-8.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 6 2.7C18 15.2 12 19 12 19Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "cross") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24">
        <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "target") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24">
        <path
          d="M12 4l6 2.5V12c0 4.1-2.6 6.8-6 8-3.4-1.2-6-3.9-6-8V6.5L12 4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "bolt") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24">
        <path
          d="M13 3 7 13h4l-1 8 7-11h-4l0-7Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className={common} fill="none" viewBox="0 0 24 24">
      <path
        d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f8fe] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2" href="/">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 text-xs font-bold text-white">
                R
              </div>
              <span className="text-sm font-semibold text-slate-900">Reclu</span>
            </Link>
            <nav className="hidden items-center gap-5 text-xs font-medium text-slate-500 md:flex">
              <a href="#modulos">Evaluaciones</a>
              <a href="#problema">Campanas</a>
              <a href="#beneficios">Beneficios</a>
              <a href="#faq">FAQ</a>
            </nav>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden text-slate-400 sm:inline-flex">ES</span>
            <Link className="rounded-lg px-3 py-2 font-medium text-slate-600" href="/auth/signin">
              Iniciar Sesion
            </Link>
            <Link
              className="reclu-btn-violet rounded-lg px-3 py-2 font-semibold !text-white shadow-[0_10px_24px_rgba(124,58,237,.24)]"
              href="/auth/signup"
            >
              Comenzar Gratis
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,.18),_transparent_26%),linear-gradient(120deg,_#132042_0%,_#1b2458_42%,_#4f1d95_100%)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-8 md:px-6 lg:grid-cols-[1fr_420px] lg:items-center lg:pb-20 lg:pt-14">
            <div className="reclu-fade-up text-white">
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-white/10 px-3 py-1 text-[11px] font-medium text-cyan-100">
                Headhunter Tecnologico con IA
              </span>
              <h1 className="mt-5 max-w-xl font-mono text-4xl font-semibold leading-[1.02] sm:text-5xl">
                Tu <span className="text-cyan-300">seleccionador</span>
                <br />
                de talento
                <br />
                inteligente
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-200">
                MotivaiQ analiza candidatos con 8 modulos de evaluacion cientifica para encontrar
                al profesional perfecto para tu empresa. Sin sesgos, con datos precisos.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  className="rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(14,165,233,.28)] hover:bg-sky-400"
                  href="/auth/signup"
                >
                  Comenzar a Seleccionar
                </Link>
                <a
                  className="rounded-lg border border-white/15 bg-white/6 px-4 py-2.5 text-sm font-semibold text-slate-100 backdrop-blur-sm hover:bg-white/10"
                  href="#problema"
                >
                  Como Funciona
                </a>
              </div>

              <div className="mt-7 grid max-w-md grid-cols-3 gap-3">
                {metrics.map((item, index) => (
                  <div
                    className="rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-center backdrop-blur-sm reclu-fade-up"
                    key={item.label}
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <p className="font-mono text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-[11px] text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="reclu-fade-up" style={{ animationDelay: "120ms" }}>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4 text-white shadow-[0_32px_80px_rgba(10,14,38,.34)] backdrop-blur-md">
                <div className="rounded-xl bg-white/8 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-300">
                        Busqueda en curso
                      </p>
                      <p className="mt-1 text-sm font-semibold">Product Manager Senior</p>
                    </div>
                    <div className="rounded-full bg-emerald-400/20 px-2 py-1 text-[10px] font-semibold text-emerald-200">
                      Analizando
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-300">
                    <span>Candidatos evaluados</span>
                    <span>24 / 30</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" />
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.04))] p-3">
                  <div className="mb-3 flex gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                    <span className="text-white">Candidatos</span>
                    <span>Metricas</span>
                  </div>
                  <div className="space-y-3">
                    {candidates.map((candidate, index) => (
                      <div
                        className={`relative overflow-hidden rounded-xl border p-3 ${
                          candidate.active
                            ? "border-emerald-300/40 bg-white"
                            : "border-white/8 bg-white/6"
                        }`}
                        key={candidate.name}
                      >
                        {candidate.active ? (
                          <div className="absolute inset-y-0 left-0 w-1 rounded-full bg-emerald-400" />
                        ) : null}
                        <div className="flex items-center justify-between gap-3 pl-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${
                                candidate.active
                                  ? "bg-emerald-100 text-emerald-700"
                                  : index === 1
                                    ? "bg-sky-400/20 text-sky-200"
                                    : "bg-violet-400/20 text-violet-200"
                              }`}
                            >
                              {candidate.name[0]}
                            </div>
                            <div>
                              <p
                                className={`text-sm font-semibold ${
                                  candidate.active ? "text-slate-800" : "text-white"
                                }`}
                              >
                                {candidate.name}
                              </p>
                              <p
                                className={`text-[11px] ${
                                  candidate.active ? "text-slate-500" : "text-slate-300"
                                }`}
                              >
                                {candidate.tag}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`text-lg font-semibold ${
                              candidate.active ? "text-emerald-600" : "text-cyan-300"
                            }`}
                          >
                            {candidate.score}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2 text-[10px] text-slate-300">
                    <span className="rounded-full bg-white/8 px-2 py-1">DISC</span>
                    <span className="rounded-full bg-white/8 px-2 py-1">EQ</span>
                    <span className="rounded-full bg-white/8 px-2 py-1">DNA</span>
                    <span className="rounded-full bg-white/8 px-2 py-1">TEC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16" id="problema">
          <div className="mx-auto w-full max-w-5xl px-4 text-center md:px-6">
            <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-500">
              El Problema
            </span>
            <h2 className="mt-4 font-mono text-4xl font-semibold text-slate-900">
              Contratar sin datos <span className="text-rose-500">cuesta caro</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              El 46% de las contrataciones fallan en sus primeros 18 meses. Las entrevistas
              tradicionales tienen solo 14% de efectividad predictiva.
            </p>

            <div className="mt-10 grid gap-5 lg:grid-cols-2" id="beneficios">
              <article className="rounded-3xl border border-rose-100 bg-[linear-gradient(180deg,#fff8f8_0%,#fff1f1_100%)] p-6 text-left shadow-[0_18px_40px_rgba(244,63,94,.08)]">
                <p className="text-sm font-semibold text-slate-800">Seleccion Tradicional</p>
                <p className="mt-1 text-xs text-rose-400">Proceso manual y subjetivo</p>
                <ul className="mt-4 space-y-3">
                  {painPoints.map((item) => (
                    <li className="flex items-center gap-3 text-sm text-slate-500" key={item}>
                      <span className="h-2 w-2 rounded-full bg-rose-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-3xl border border-sky-100 bg-[linear-gradient(180deg,#f6fbff_0%,#eef6ff_100%)] p-6 text-left shadow-[0_18px_40px_rgba(59,130,246,.08)]">
                <p className="text-sm font-semibold text-slate-800">Con Reclu</p>
                <p className="mt-1 text-xs text-sky-500">Headhunter Tecnologico</p>
                <ul className="mt-4 space-y-3">
                  {benefits.map((item) => (
                    <li className="flex items-center gap-3 text-sm text-slate-600" key={item}>
                      <span className="h-2 w-2 rounded-full bg-sky-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#f5f7ff_0%,#edf2ff_100%)] py-18" id="modulos">
          <div className="mx-auto w-full max-w-5xl px-4 text-center md:px-6">
            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-500">
              8 modulos de Analisis
            </span>
            <h2 className="mt-4 font-mono text-4xl font-semibold text-slate-900">
              Analisis <span className="text-indigo-500">cientifico integral</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Cada modulo evalua una dimension clave del candidato. Juntos, construyen un perfil
              360 que predice el exito laboral.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((moduleItem, index) => (
                <article
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_18px_34px_rgba(15,23,42,.07)] reclu-fade-up"
                  key={moduleItem.name}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border ${moduleItem.tone} shadow-[inset_0_1px_0_rgba(255,255,255,.6)]`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${moduleItem.iconBg} shadow-[0_10px_20px_rgba(15,23,42,.16)]`}
                    >
                      <ModuleIcon type={moduleItem.icon} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-900">{moduleItem.name}</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">{moduleItem.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16" id="faq">
          <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
            <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#151e40_0%,#3f1d7b_100%)] px-8 py-10 text-center text-white shadow-[0_28px_70px_rgba(31,41,55,.18)]">
              <h2 className="font-mono text-3xl font-semibold">Comienza a seleccionar mejor</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                Replica el flujo de la plataforma base con una experiencia moderna, visual y lista
                para crecer.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  className="rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,.3)] hover:bg-sky-400"
                  href="/auth/signup"
                >
                  Crear Cuenta Gratis
                </Link>
                <Link
                  className="rounded-lg border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white hover:bg-white/12"
                  href="/auth/signin"
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
