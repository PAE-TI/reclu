import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-guard";

const stats = [
  { label: "Candidatos", value: "10", sub: "Total evaluados", tone: "from-blue-500 to-cyan-500" },
  { label: "Completadas", value: "20", sub: "18% completado", tone: "from-emerald-500 to-teal-500" },
  { label: "Pendientes", value: "0", sub: "Esperando respuesta", tone: "from-amber-500 to-orange-500" },
  { label: "Perfiles 360", value: "1", sub: "8 modulos completos", tone: "from-violet-500 to-fuchsia-500" },
  { label: "Hoy", value: "0", sub: "Evaluaciones completadas", tone: "from-slate-700 to-slate-900" },
];

const quickActions = [
  { title: "Nueva Campana", text: "Inicia un proceso de seleccion", href: "/campaigns/new", accent: "from-violet-500 to-indigo-500" },
  { title: "Enviar Evaluaciones", text: "Activa los modulos disponibles", href: "/batch-evaluations", accent: "from-blue-500 to-cyan-500" },
  {
    title: "Comparar Candidatos",
    text: "Analisis comparativo de perfiles",
    href: "/analytics?mode=compare",
    accent: "from-emerald-500 to-teal-500",
  },
  { title: "Ver Resultados", text: "Analisis individual y detalle", href: "/analytics?mode=individual", accent: "from-amber-500 to-orange-500" },
];

const recentActivity = [
  { name: "John Valencia", module: "Technical", date: "6 de feb", state: "Completado" },
  { name: "John Valencia", module: "Technical", date: "5 de feb", state: "Completado" },
  { name: "John Valencia", module: "Technical", date: "4 de feb", state: "Completado" },
  { name: "Johan", module: "Stress", date: "30 de ene", state: "Expirado" },
  { name: "Johan", module: "Values", date: "30 de ene", state: "Expirado" },
  { name: "Johan", module: "ACI", date: "30 de ene", state: "Expirado" },
];

const modules = ["DISC", "Fuerzas Motivadoras", "EQ", "DNA-25", "Acumen", "Valores", "Estres", "Tecnica"];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const displayName = user?.fullName ?? user?.email ?? "Bienvenido";
  const companyName = user?.companyName ?? "Tu empresa";
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="space-y-6">
        <section className="reclu-portal-hero p-6 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-600">
                Centro de Reclutamiento
              </span>
              <h2 className="mt-4 font-mono text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Hola, {displayName}
              </h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                {companyName}
              </p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Una vista compacta y moderna para lanzar campanas, revisar estados y tomar
                decisiones basadas en datos.
              </p>
            </div>
            <Link
              className="rounded-2xl bg-[linear-gradient(135deg,#5f6af7_0%,#7b4ef9_50%,#4a7bff_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(95,106,247,.22)]"
              href="/campaigns/new"
            >
              Nueva Campana de Seleccion
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((item, index) => (
            <article
              className="reclu-portal-card p-4"
              key={item.label}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${item.tone}`} />
              <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 font-mono text-3xl font-semibold text-slate-900">{item.value}</p>
              <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
            </article>
          ))}
        </section>

        <section className="reclu-portal-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-mono text-lg font-semibold text-slate-900">Acciones Rapidas</h3>
              <p className="mt-1 text-sm text-slate-500">Acceso inmediato a las tareas principales.</p>
            </div>
            <Link className="text-sm font-semibold text-violet-600 hover:text-violet-700" href="/analytics">
              Ver Analisis
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {quickActions.map((item) => (
              <Link
                className="reclu-portal-action group p-4 transition hover:-translate-y-0.5"
                href={item.href}
                key={item.title}
              >
                <div className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${item.accent}`} />
                <p className="mt-4 text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs leading-6 text-slate-500">{item.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)]">
          <article className="reclu-portal-card p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-mono text-lg font-semibold text-slate-900">Actividad Reciente</h3>
                <p className="mt-1 text-sm text-slate-500">Ultimos eventos de la plataforma.</p>
              </div>
              <Link className="text-sm font-semibold text-violet-600 hover:text-violet-700" href="/analytics">
                Ver todo
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {recentActivity.map((item) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(12,24,44,.05)]"
                  key={`${item.name}-${item.date}-${item.module}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.module} · {item.date}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                      item.state === "Completado"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-500"
                    }`}
                  >
                    {item.state}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="reclu-portal-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-lg font-semibold text-slate-900">8 Modulos</h3>
                <p className="mt-1 text-xs text-slate-500">Vision 360 de cada candidato.</p>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-600">
                Activos
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {modules.map((item, index) => (
                <div
                  className="reclu-portal-card-soft px-3 py-3 text-slate-700"
                  key={item}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {item}
                </div>
              ))}
            </div>
            <Link className="mt-4 inline-block text-sm font-semibold text-violet-600 hover:text-violet-700" href="/evaluations-guide">
              Ver Guia
            </Link>
          </article>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="reclu-portal-gradient rounded-[1.4rem] p-[1px] shadow-[0_18px_40px_rgba(95,106,247,.18)]">
          <div className="rounded-[1.35rem] bg-white/8 p-5 text-white backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">Tip del dia</p>
            <h3 className="mt-2 font-mono text-xl font-semibold">Analisis Integrado 360</h3>
            <p className="mt-2 text-sm leading-7 text-slate-100/90">
              Combina evaluaciones psicometricas y tecnicas para obtener una lectura mas completa
              del fit real de cada candidato.
            </p>
            <Link
              className="mt-5 inline-flex rounded-xl bg-[linear-gradient(135deg,#5f6af7_0%,#7b4ef9_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(95,106,247,.2)]"
              href="/analytics"
            >
              Aplicar ahora
            </Link>
          </div>
        </section>

        <section className="reclu-portal-rail p-5">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Consejos para Headhunters</h3>
          <div className="mt-4 space-y-3">
            {[
              "Define el perfil ideal antes de invitar candidatos.",
              "Combina DISC, EQ y tecnica para mejores decisiones.",
              "Usa comparativos para detectar brechas y sinergias.",
            ].map((item) => (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600" key={item}>
                {item}
              </div>
            ))}
          </div>
          <Link className="mt-4 inline-block text-sm font-semibold text-violet-600 hover:text-violet-700" href="/guia-plataforma">
            Ver mas consejos
          </Link>
        </section>

        <section className="reclu-portal-card p-5">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Primera vez?</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Empieza por una campana sencilla, envia una evaluacion y revisa el analisis 360 en
            minutos.
          </p>
          <div className="mt-4 space-y-2">
            {["Guia de Evaluaciones", "Como usar MotivaIQ", "Mis Campanas"].map((item) => (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="reclu-portal-card bg-[linear-gradient(135deg,#f7f3ff_0%,#edf5ff_100%)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#5f6af7_0%,#7b4ef9_100%)] text-white">
              ?
            </div>
            <div>
              <h3 className="font-mono text-base font-semibold text-slate-900">Necesitas ayuda?</h3>
              <p className="text-sm text-slate-500">Estamos para ayudarte a avanzar.</p>
            </div>
          </div>
          <Link
            className="mt-4 inline-flex rounded-xl bg-[linear-gradient(135deg,#5f6af7_0%,#7b4ef9_100%)] px-4 py-2 text-sm font-semibold !text-white"
            href="/guia-plataforma"
          >
            Ver Guia Completa
          </Link>
        </section>
      </aside>
    </div>
  );
}
