import Link from "next/link";

const metrics = [
  { value: "96%", label: "Precision" },
  { value: "-70%", label: "Tiempo" },
  { value: "+85%", label: "Retencion" },
];

const painPoints = [
  "Filtro inicial lento y altamente manual",
  "Decisiones basadas en intuicion y entrevista",
  "Semanas consumidas revisando hojas de vida",
  "Mayor rotacion por contrataciones imprecisas",
  "Sin una metrica objetiva de compatibilidad",
  "Sesgos inconscientes durante la evaluacion",
];

const benefits = [
  "Evaluacion cientifica con 8 modulos integrados",
  "Ranking automatico segun ajuste al cargo",
  "Hasta 85% de retencion en roles criticos",
  "Compatibilidad medida con criterios consistentes",
  "Lectura objetiva y comparativa de perfiles",
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

const faqs = [
  {
    question: "Que incluye Reclu en una campana de seleccion?",
    answer:
      "Cada campana integra evaluaciones psicometricas, pruebas tecnicas, ranking de candidatos, comparativos y reportes accionables para tomar decisiones con datos.",
  },
  {
    question: "Cuanto tiempo tardan los candidatos en completar las pruebas?",
    answer:
      "Depende de los modulos activados, pero una ruta estandar suele completarse entre 35 y 60 minutos, con avance guiado y experiencia responsive.",
  },
  {
    question: "Puedo combinar psicometria con evaluaciones tecnicas?",
    answer:
      "Si. Esa es una de las fortalezas principales de la plataforma: puedes mezclar modulos conductuales, cognitivos y tecnicos en un mismo proceso.",
  },
  {
    question: "Como se presenta el resultado final al reclutador?",
    answer:
      "La plataforma entrega scores, alertas, fortalezas, compatibilidad con el cargo y comparativos visuales para revisar rapidamente a los mejores perfiles.",
  },
  {
    question: "Que tipo de roles puede evaluar Reclu?",
    answer:
      "La plataforma puede adaptarse a procesos administrativos, comerciales, operativos, gerenciales y tambien a perfiles tecnicos con rutas de evaluacion diferenciadas.",
  },
  {
    question: "Las evaluaciones se pueden personalizar por vacante?",
    answer:
      "Si. Cada campana puede activar solo los modulos que necesita el cargo, para equilibrar profundidad de analisis y tiempo de respuesta del candidato.",
  },
  {
    question: "Los resultados sirven para comparar varios candidatos a la vez?",
    answer:
      "Si. Reclu esta pensada para visualizar comparativos entre candidatos, detectar fortalezas compartidas y evidenciar diferencias criticas de ajuste.",
  },
  {
    question: "Puedo usar la plataforma con procesos masivos?",
    answer:
      "Si. El flujo esta preparado para cargas grupales, envio de invitaciones y seguimiento del avance de multiples candidatos dentro de una misma campana.",
  },
  {
    question: "Reclu reemplaza la entrevista humana?",
    answer:
      "No. La fortalece. La idea es que llegues a la entrevista con mejor contexto, menos sesgo y preguntas mas enfocadas en validar el ajuste real.",
  },
  {
    question: "Como ayuda Reclu a reducir la rotacion?",
    answer:
      "Al medir conducta, motivadores, competencias, inteligencia emocional y capacidad tecnica, la decision final se apoya en evidencia mas completa y menos subjetiva.",
  },
  {
    question: "La experiencia del candidato es mobile friendly?",
    answer:
      "Si. El recorrido puede completarse desde desktop o movil, con una interfaz pensada para mantener claridad, continuidad y baja friccion.",
  },
  {
    question: "Se pueden revisar avances parciales por candidato?",
    answer:
      "Si. Reclu permite ver estados, porcentaje completado, modulos pendientes y alertas clave antes de que termine toda la ruta de evaluacion.",
  },
  {
    question: "Que diferencia a Reclu de un ATS tradicional?",
    answer:
      "Un ATS ordena postulaciones. Reclu profundiza en el ajuste humano y tecnico del perfil para ayudarte a decidir mejor, no solo a administrar candidatos.",
  },
  {
    question: "Los reportes estan pensados para equipos de talento y lideres?",
    answer:
      "Si. Los resultados se presentan de forma ejecutiva para RRHH, hiring managers y liderazgo, con hallazgos claros y lectura rapida para decisiones compartidas.",
  },
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
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2" href="/">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 text-xs font-bold text-white">
                R
              </div>
              <span className="text-sm font-semibold text-slate-900">Reclu</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
              <a className="transition-colors hover:text-slate-900" href="#modulos">Evaluaciones</a>
              <a className="transition-colors hover:text-slate-900" href="#problema">Campanas</a>
              <a className="transition-colors hover:text-slate-900" href="#beneficios">Beneficios</a>
              <a className="transition-colors hover:text-slate-900" href="#faq">FAQ</a>
            </nav>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-slate-400 sm:inline-flex">ES</span>
            <Link className="rounded-lg px-3 py-2 font-medium text-slate-600 transition-colors hover:text-slate-900" href="/auth/signin">
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
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,.18),_transparent_24%),linear-gradient(120deg,_#132042_0%,_#1b2458_42%,_#4f1d95_100%)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="pointer-events-none absolute -left-12 top-20 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl reclu-glow-shift" />
          <div className="pointer-events-none absolute bottom-10 right-0 h-52 w-52 rounded-full bg-fuchsia-500/18 blur-3xl reclu-glow-shift" />
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
                    className="rounded-2xl border border-white/12 bg-white/9 px-4 py-3 text-center shadow-[0_18px_32px_rgba(6,11,30,.18)] backdrop-blur-sm reclu-fade-up"
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

        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eef4ff_0%,#dbe8ff_100%)] py-20" id="modulos">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,.12),_transparent_26%)]" />
          <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/70 bg-white/55 px-4 py-12 text-center shadow-[0_30px_70px_rgba(37,99,235,.10)] backdrop-blur-sm md:px-8">
            <span className="inline-flex rounded-full border border-indigo-200 bg-white px-3 py-1 text-[11px] font-semibold text-indigo-500 shadow-[0_10px_24px_rgba(99,102,241,.10)]">
              8 modulos de Analisis
            </span>
            <h2 className="mt-4 font-mono text-4xl font-semibold text-slate-900 sm:text-5xl">
              Analisis <span className="text-indigo-500">cientifico integral</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Cada modulo evalua una dimension clave del candidato. Juntos, construyen un perfil
              360 que predice el exito laboral.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((moduleItem, index) => (
                <article
                  className="rounded-2xl border border-white/85 bg-white/92 p-5 text-left shadow-[0_20px_38px_rgba(37,99,235,.10)] transition-transform duration-300 hover:-translate-y-1 reclu-fade-up"
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

        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,.16),_transparent_24%),linear-gradient(120deg,_#132042_0%,_#1b2458_52%,_#16315d_100%)] py-20 text-white" id="problema">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-400/18 blur-3xl reclu-glow-shift" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-blue-500/16 blur-3xl reclu-glow-shift" />
          <div className="mx-auto w-full max-w-5xl px-4 text-center md:px-6">
            <span className="inline-flex rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] font-semibold text-rose-500 shadow-[0_10px_24px_rgba(244,63,94,.08)]">
              El Problema
            </span>
            <h2 className="mt-4 font-mono text-4xl font-semibold text-white sm:text-5xl">
              Contratar sin datos <span className="text-rose-300">cuesta caro</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-200">
              El 46% de las contrataciones fallan en sus primeros 18 meses. Las entrevistas
              tradicionales tienen solo 14% de efectividad predictiva.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
              {[
                { value: "46%", label: "Contrataciones fallidas", tone: "from-rose-500 to-pink-500" },
                { value: "14%", label: "Prediccion por entrevista", tone: "from-amber-500 to-orange-500" },
                { value: "18m", label: "Impacto promedio", tone: "from-sky-500 to-cyan-500" },
              ].map((stat, index) => (
                <article
                  className="reclu-fade-up rounded-2xl border border-white/10 bg-white/10 p-4 text-left shadow-[0_20px_40px_rgba(0,0,0,.18)] backdrop-blur-md"
                  key={stat.label}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${stat.tone}`} />
                  <p className="mt-4 font-mono text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-200">{stat.label}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2" id="beneficios">
              <article className="reclu-fade-up relative overflow-hidden rounded-[1.75rem] border border-rose-200/80 bg-[linear-gradient(180deg,#fff4f7_0%,#ffd9e5_100%)] p-6 text-left shadow-[0_30px_70px_rgba(244,63,94,.18)]">
                <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-rose-300/40 blur-2xl" />
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 text-white shadow-[0_18px_28px_rgba(244,63,94,.28)]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-900">Seleccion tradicional</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-rose-600">
                      Proceso lento, manual y reactivo
                    </p>
                  </div>
                </div>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-700">
                  Equipos que avanzan con poca trazabilidad, mucha intuicion y baja capacidad de
                  comparar candidatos con criterio consistente.
                </p>
                <ul className="mt-4 space-y-3">
                  {painPoints.map((item) => (
                    <li className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/82 px-4 py-3 text-sm text-slate-700 backdrop-blur-sm shadow-[0_10px_24px_rgba(244,63,94,.08)]" key={item}>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                          <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article
                className="reclu-fade-up relative overflow-hidden rounded-[1.75rem] border border-cyan-200/80 bg-[linear-gradient(180deg,#edf9ff_0%,#cfeeff_100%)] p-6 text-left shadow-[0_30px_70px_rgba(14,165,233,.18)]"
                style={{ animationDelay: "120ms" }}
              >
                <div className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 rounded-full bg-cyan-300/35 blur-2xl" />
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-500 text-white shadow-[0_18px_28px_rgba(59,130,246,.28)]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M7 12.5 10.2 16 17 8.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-900">Con Reclu</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-sky-600">
                      Decision basada en evidencia
                    </p>
                  </div>
                </div>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-700">
                  Un flujo mucho mas claro para priorizar candidatos, medir compatibilidad y
                  sostener decisiones de seleccion con datos comparables.
                </p>
                <ul className="mt-4 space-y-3">
                  {benefits.map((item) => (
                    <li className="flex items-center gap-3 rounded-2xl border border-white/85 bg-white/85 px-4 py-3 text-sm text-slate-800 backdrop-blur-sm shadow-[0_10px_24px_rgba(14,165,233,.08)]" key={item}>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                          <path
                            d="M7 12.5 10.2 16 17 8.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] py-18" id="faq">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,.10),_transparent_50%)]" />
          <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
            <div className="mb-12 text-center">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">
                FAQ
              </span>
              <h2 className="mt-4 font-mono text-4xl font-semibold text-slate-900">
                Preguntas frecuentes para equipos de talento
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                Respuestas claras para entender como opera la plataforma y como se integra al
                flujo real de seleccion.
              </p>
            </div>

            <div className="mb-12 grid gap-4">
              {faqs.map((faq, index) => (
                <details
                  className="group reclu-fade-up overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-6 py-5 shadow-[0_18px_36px_rgba(15,23,42,.06)] transition-transform duration-300 hover:-translate-y-0.5"
                  key={faq.question}
                  open={index === 0}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="text-left text-base font-semibold text-slate-900">
                      {faq.question}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-300 group-open:rotate-45 group-open:bg-sky-100 group-open:text-sky-600">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-3xl pr-10 text-sm leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

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
