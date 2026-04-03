"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "No se pudo iniciar sesion.");
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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Correo electronico
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
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Contrasena
            </label>
            <Link className="text-xs font-medium text-sky-600 hover:text-sky-700" href="/auth/forgot-password">
              Olvide mi clave
            </Link>
          </div>
          <input
            className="reclu-input"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
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
          {isLoading ? "Ingresando..." : "Ingresar al Portal"}
        </button>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-xs font-medium text-emerald-700">
          Conexion segura y encriptada · SSL/TLS
        </div>
      </form>
    </AuthShell>
  );
}
