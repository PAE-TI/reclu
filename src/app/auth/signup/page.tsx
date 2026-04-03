"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, companyName, email, password }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "No se pudo crear la cuenta.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("No pudimos conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  }

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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Nombre del responsable
          </label>
          <input
            className="reclu-input"
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Tu nombre completo"
            required
            type="text"
            value={fullName}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Nombre de la empresa
          </label>
          <input
            className="reclu-input"
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder="Empresa ABC"
            required
            type="text"
            value={companyName}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Correo corporativo
          </label>
          <input
            className="reclu-input"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@empresa.com"
            required
            type="email"
            value={email}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Contrasena
          </label>
          <input
            className="reclu-input"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Crea una contrasena segura"
            required
            type="password"
            value={password}
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        ) : null}

        <button
          className="w-full rounded-xl bg-[linear-gradient(90deg,#72d9ff_0%,#7b6cff_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(99,102,241,.20)] transition-transform duration-300 hover:-translate-y-0.5"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>

        <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-center text-xs font-medium text-sky-700">
          Configuracion inicial incluida para comenzar tu primera campana
        </div>
      </form>
    </AuthShell>
  );
}
