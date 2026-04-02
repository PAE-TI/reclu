import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="reclu-grid-bg flex min-h-screen items-center justify-center p-6">
      <main className="reclu-card w-full max-w-md p-7">
        <p className="reclu-pill inline-block">Reclu</p>
        <h1 className="mt-4 font-mono text-2xl font-semibold text-slate-900">Iniciar sesion</h1>
        <p className="mt-2 text-sm text-slate-600">
          Pantalla base replicada de la experiencia original. La autenticacion real se conecta en
          la siguiente etapa.
        </p>
        <form className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            placeholder="correo@empresa.com"
            type="email"
          />
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            placeholder="********"
            type="password"
          />
          <button
            className="w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            type="button"
          >
            Ingresar al portal
          </button>
        </form>
        <div className="mt-4 flex justify-between text-xs text-slate-500">
          <Link className="hover:text-blue-700" href="/terms">
            Terminos
          </Link>
          <Link className="hover:text-blue-700" href="/auth/signup">
            Crear cuenta
          </Link>
        </div>
      </main>
    </div>
  );
}

