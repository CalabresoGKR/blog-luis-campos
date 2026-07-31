"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SubmitButton } from "./SubmitButton";

interface Social {
  platform: string;
  url: string;
}

interface ContactFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    email?:   string | null;
    phone?:   string | null;
    address?: string | null;
    hours?:   string | null;
    socials?: Social[];
  };
}

const input = "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-ink/30 transition-colors";
const lbl   = "block text-xs font-semibold uppercase tracking-wider text-muted/60 mb-2";

export function ContactForm({ action, defaultValues }: ContactFormProps) {
  const [socials, setSocials] = useState<Social[]>(
    defaultValues?.socials ?? []
  );

  function addSocial() {
    setSocials((prev) => [...prev, { platform: "", url: "" }]);
  }

  function removeSocial(idx: number) {
    setSocials((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateSocial(idx: number, field: keyof Social, value: string) {
    setSocials((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }

  return (
    <form action={action} className="space-y-8">

      {/* ── Email ── */}
      <div>
        <label className={lbl}>Email</label>
        <input
          name="email"
          type="email"
          defaultValue={defaultValues?.email ?? ""}
          placeholder="email@exemplo.pt"
          className={input}
        />
      </div>

      {/* ── Telefone ── */}
      <div>
        <label className={lbl}>Telefone</label>
        <input
          name="phone"
          type="tel"
          defaultValue={defaultValues?.phone ?? ""}
          placeholder="+351 900 000 000"
          className={input}
        />
      </div>

      {/* ── Morada ── */}
      <div>
        <label className={lbl}>Morada</label>
        <textarea
          name="address"
          rows={3}
          defaultValue={defaultValues?.address ?? ""}
          placeholder={"Rua da Escola, n.º 8\n2350-848 Torres Novas\nPortugal"}
          className={`${input} resize-none`}
        />
        <p className="mt-1.5 text-xs text-muted">Separa as linhas com Enter.</p>
      </div>

      {/* ── Horários ── */}
      <div>
        <label className={lbl}>Horário / Disponibilidade</label>
        <input
          name="hours"
          type="text"
          defaultValue={defaultValues?.hours ?? ""}
          placeholder="Por agendamento"
          className={input}
        />
      </div>

      {/* ── Redes Sociais ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={`${lbl} mb-0`}>Redes Sociais</label>
          <button
            type="button"
            onClick={addSocial}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar
          </button>
        </div>

        {socials.length === 0 && (
          <p className="text-sm text-muted/50 py-4 text-center border border-dashed border-line rounded-xl">
            Nenhuma rede social adicionada.
          </p>
        )}

        <div className="space-y-3">
          {socials.map((social, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              {/* Campos ocultos com os valores do estado */}
              <input type="hidden" name={`social_platform_${idx}`} value={social.platform} />
              <input type="hidden" name={`social_url_${idx}`}      value={social.url} />

              <input
                type="text"
                value={social.platform}
                onChange={(e) => updateSocial(idx, "platform", e.target.value)}
                placeholder="Instagram"
                className="w-36 flex-shrink-0 rounded-xl border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-ink/30 transition-colors"
              />
              <input
                type="url"
                value={social.url}
                onChange={(e) => updateSocial(idx, "url", e.target.value)}
                placeholder="https://instagram.com/…"
                className="flex-1 rounded-xl border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-ink/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => removeSocial(idx)}
                className="p-2.5 rounded-xl border border-line hover:border-red-200 hover:bg-red-50 text-muted hover:text-red-500 transition-colors flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Botão ── */}
      <div className="pt-4 border-t border-line">
        <SubmitButton label="Guardar Contactos" pendingLabel="A guardar..." />
      </div>
    </form>
  );
}
