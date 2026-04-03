"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!token) {
      setError("El enlace es invalido.");
      return;
    }
    if (password.length < 8) {
      setError("La contrasena debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "No se pudo restablecer la contrasena.");
        return;
      }
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("No pudimos conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      title="Nueva Contrasena"
      description="Define una contrasena segura para recuperar el acceso a tu cuenta."
      footer={
        <Link className="font-semibold text-sky-600 hover:text-sky-700" href="/auth/signin">
          Volver a iniciar sesion
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Nueva contrasena
          </label>
          <input
            className="reclu-input"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimo 8 caracteres"
            required
            type="password"
            value={password}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Confirmar contrasena
          </label>
          <input
            className="reclu-input"
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repite la contrasena"
            required
            type="password"
            value={confirmPassword}
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Contrasena actualizada. Ya puedes iniciar sesion.
          </div>
        ) : null}

        <button
          className="w-full rounded-xl bg-[linear-gradient(90deg,#72d9ff_0%,#7b6cff_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(99,102,241,.20)]"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Guardando..." : "Actualizar contrasena"}
        </button>
      </form>
    </AuthShell>
  );
}
