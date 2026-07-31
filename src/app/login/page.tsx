"use client";

import { useActionState } from "react";
import { authenticate } from "@/actions/auth";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <main className="min-h-screen grid place-items-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ink">Atelier</h1>
          <p className="text-sm text-muted mt-1">Painel de administração</p>
        </div>

        <form
          action={formAction}
          className="bg-paper border border-line rounded-xl p-6 shadow-sm space-y-4"
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Palavra-passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-accent" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-ink px-3 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "A entrar…" : "Iniciar sessão"}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          Acesso reservado a administradores.
        </p>
      </div>
    </main>
  );
}
