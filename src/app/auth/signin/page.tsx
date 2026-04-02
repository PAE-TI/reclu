import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";

export default function SignInPage() {
  return (
    <AuthShell
      title="Iniciar Sesion"
      description="Ingresa tus credenciales para acceder al portal de evaluacion y seguimiento."
      footer={
        <>
          Aun no tienes una cuenta?{" "}
          <Link className="font-semibold text-sky-600 hover:text-sky-700" href="/auth/signup">
            Registrate gratis
          </Link>
        </>
      }
    >
      <form className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Correo electronico
          </label>
          <input className="reclu-input" placeholder="tu@empresa.com" type="email" />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Contrasena
            </label>
            <button className="text-xs font-medium text-sky-600 hover:text-sky-700" type="button">
              Olvide mi clave
            </button>
          </div>
          <input className="reclu-input" placeholder="********" type="password" />
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs leading-6 text-slate-500">
          <input className="mt-1 h-4 w-4 rounded border-slate-300" type="checkbox" />
          <span>
            Al iniciar sesion, confirmo que he leido y acepto los{" "}
            <Link className="font-semibold text-sky-600 hover:text-sky-700" href="/terms">
              Terminos y Condiciones
            </Link>{" "}
            de Reclu.
          </span>
        </label>

        <button
          className="w-full rounded-xl bg-[linear-gradient(90deg,#72d9ff_0%,#7b6cff_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(99,102,241,.20)] transition-transform duration-300 hover:-translate-y-0.5"
          type="button"
        >
          Ingresar al Portal
        </button>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-xs font-medium text-emerald-700">
          Conexion segura y encriptada · SSL/TLS
        </div>
      </form>
    </AuthShell>
  );
}
