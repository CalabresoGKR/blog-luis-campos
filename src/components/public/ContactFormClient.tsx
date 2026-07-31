"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { sendMessage } from "@/actions/message";
import type { MessageState } from "@/actions/message";

const fieldCls = "type-input w-full bg-paper border border-line rounded-xl px-4 py-3.5 text-ink placeholder:text-muted/35 focus:outline-none focus:border-ink/40 transition-colors duration-200";
const labelCls = "type-form-label text-muted/55 block mb-2";

export function ContactFormClient() {
  const [state, action, isPending] = useActionState<MessageState, FormData>(
    sendMessage,
    null
  );

  if (state?.ok) {
    return (
      <div className="bg-canvas rounded-2xl p-8 lg:p-10 flex flex-col items-center justify-center gap-5 min-h-64 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>
        <div>
          <h3 className="type-h3 text-ink mb-2">Mensagem enviada</h3>
          <p className="type-body-sm text-muted max-w-xs">
            Obrigado pelo contacto. Responderei o mais brevemente possível.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-canvas rounded-2xl p-8 lg:p-10">
      <h2 className="type-h3 text-ink mb-8">Enviar mensagem</h2>

      <form action={action} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nome *</label>
            <input
              name="name"
              type="text"
              required
              placeholder="O seu nome"
              className={fieldCls}
            />
          </div>
          <div>
            <label className={labelCls}>Email *</label>
            <input
              name="email"
              type="email"
              required
              placeholder="o-seu@email.com"
              className={fieldCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Assunto</label>
          <input
            name="subject"
            type="text"
            placeholder="Assunto da mensagem"
            className={fieldCls}
          />
        </div>

        <div>
          <label className={labelCls}>Mensagem *</label>
          <textarea
            name="body"
            rows={6}
            required
            placeholder="A sua mensagem..."
            className={`${fieldCls} resize-none`}
          />
        </div>

        {state && !state.ok && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="type-btn w-full bg-ink text-paper py-4 rounded-full hover:bg-ink/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-paper/30 border-t-paper animate-spin" />
              A enviar...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Enviar Mensagem
            </>
          )}
        </button>
      </form>
    </div>
  );
}
