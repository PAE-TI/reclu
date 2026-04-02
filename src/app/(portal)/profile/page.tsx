import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <section className="reclu-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">JV · john valencia · Administrador</p>
            <h2 className="font-mono text-2xl font-semibold text-slate-900">John Corp · CTO</h2>
            <p className="mt-1 text-xs text-slate-500">Miembro desde 02 de septiembre, 2025</p>
          </div>
          <Link
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            href="/profile/edit"
          >
            Editar Perfil
          </Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Informacion Personal</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="reclu-surface p-3">Nombre: john</div>
            <div className="reclu-surface p-3">Apellido: valencia</div>
            <div className="reclu-surface p-3">Correo: johnwainer@gmail.com</div>
          </div>
        </article>
        <article className="reclu-card p-6">
          <h3 className="font-mono text-lg font-semibold text-slate-900">Informacion de la Empresa</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="reclu-surface p-3">Empresa: John Corp</div>
            <div className="reclu-surface p-3">Cargo: CTO</div>
            <div className="reclu-surface p-3">Rol: Administrador</div>
            <div className="reclu-surface p-3">Estado: Activo</div>
          </div>
        </article>
      </section>

      <section className="reclu-card p-6">
        <h3 className="font-mono text-lg font-semibold text-slate-900">Mi Equipo</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="reclu-surface p-4 text-sm text-slate-700">
            john full · Acceso Completo · 8 evaluaciones
          </div>
          <div className="reclu-surface p-4 text-sm text-slate-700">
            john eval · Solo Sus Evaluaciones · 7 evaluaciones
          </div>
        </div>
      </section>
    </div>
  );
}

