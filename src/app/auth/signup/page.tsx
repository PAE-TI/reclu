import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Registro"
      description="Crea tu cuenta empresarial para comenzar procesos de seleccion con una experiencia visual, cientifica y escalable."
      footer={
        <>
          Ya tienes una cuenta?{" "}
          <Link className="font-semibold text-sky-600 hover:text-sky-700" href="/auth/signin">
            Inicia sesion
          </Link>
        </>
      }
    >
      <form className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Nombre de la empresa
          </label>
          <input className="reclu-input" placeholder="Empresa ABC" type="text" />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Nombre del responsable
          </label>
          <input className="reclu-input" placeholder="Tu nombre completo" type="text" />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Correo corporativo
          </label>
          <input className="reclu-input" placeholder="tu@empresa.com" type="email" />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Contrasena
          </label>
          <input className="reclu-input" placeholder="Crea una contrasena segura" type="password" />
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs leading-6 text-slate-500">
          <input className="mt-1 h-4 w-4 rounded border-slate-300" type="checkbox" />
          <span>
            Confirmo que la informacion suministrada corresponde a mi empresa y acepto los{" "}
            <Link className="font-semibold text-sky-600 hover:text-sky-700" href="/terms">
              Terminos y Condiciones
            </Link>
            .
          </span>
        </label>

        <button
          className="w-full rounded-xl bg-[linear-gradient(90deg,#72d9ff_0%,#7b6cff_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(99,102,241,.20)] transition-transform duration-300 hover:-translate-y-0.5"
          type="button"
        >
          Crear Cuenta
        </button>

        <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-center text-xs font-medium text-sky-700">
          Configuracion inicial incluida para comenzar tu primera campana
        </div>
      </form>
    </AuthShell>
  );
}
