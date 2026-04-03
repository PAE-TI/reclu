"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResetUrl(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json()) as { error?: string; message?: string; resetUrl?: string };

      if (!response.ok) {
        setError(payload.error ?? "No se pudo procesar la solicitud.");
        return;
      }

      setSuccessMessage(payload.message ?? "Revisa tu correo para continuar.");
      setResetUrl(payload.resetUrl ?? null);
    } catch {
      setError("No pudimos conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      title="Recuperar Contrasena"
      description="Ingresa tu correo y te enviaremos un enlace seguro para restablecer tu clave."
      footer={
        <Link className="font-semibold text-sky-600 hover:text-sky-700" href="/auth/signin">
          Volver a iniciar sesion
        </Link>
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

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        {resetUrl ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-800">
            Entorno sin SMTP: abre este enlace para continuar el reset:
            <div className="mt-1 break-all font-semibold">{resetUrl}</div>
          </div>
        ) : null}

        <button
          className="w-full rounded-xl bg-[linear-gradient(90deg,#72d9ff_0%,#7b6cff_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(99,102,241,.20)]"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Enviando..." : "Enviar enlace de recuperacion"}
        </button>
      </form>
    </AuthShell>
  );
}
