"use client";

import { useState } from "react";
import { slugify } from "@/lib/utils";
import { SubmitButton } from "./SubmitButton";

interface DefaultValues {
  title?:       string;
  slug?:        string;
  venue?:       string | null;
  city?:        string | null;
  country?:     string | null;
  description?: string | null;
  startDate?:   Date | null;
  endDate?:     Date | null;
}

interface ExhibitionFormProps {
  action:        (formData: FormData) => Promise<void>;
  defaultValues?: DefaultValues;
  submitLabel?:  string;
}

const input = "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-ink/30 transition-colors";
const lbl   = "block text-xs font-semibold uppercase tracking-wider text-muted/60 mb-2";

function toDateInput(d?: Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

export function ExhibitionForm({ action, defaultValues, submitLabel = "Guardar" }: ExhibitionFormProps) {
  const [title, setTitle]           = useState(defaultValues?.title ?? "");
  const [slug,  setSlug]            = useState(defaultValues?.slug  ?? "");
  const [slugEdited, setSlugEdited] = useState(!!defaultValues?.slug);

  function onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    if (!slugEdited) setSlug(slugify(val));
  }

  return (
    <form action={action} className="space-y-7">

      {/* ── TÍTULO ── */}
      <div>
        <label className={lbl}>Título *</label>
        <input
          name="title"
          type="text"
          required
          value={title}
          onChange={onTitleChange}
          placeholder="Nome da exposição"
          className={`${input} text-base`}
        />
      </div>

      {/* ── LOCAL ── */}
      <div>
        <label className={lbl}>Local / Galeria</label>
        <input
          name="venue"
          type="text"
          defaultValue={defaultValues?.venue ?? ""}
          placeholder="Ex: Galeria Municipal de Torres Novas"
          className={input}
        />
      </div>

      {/* ── CIDADE + PAÍS ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Cidade</label>
          <input
            name="city"
            type="text"
            defaultValue={defaultValues?.city ?? ""}
            placeholder="Ex: Torres Novas"
            className={input}
          />
        </div>
        <div>
          <label className={lbl}>País</label>
          <input
            name="country"
            type="text"
            defaultValue={defaultValues?.country ?? "Portugal"}
            placeholder="Ex: Portugal"
            className={input}
          />
        </div>
      </div>

      {/* ── DATAS ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Data de Início</label>
          <input
            name="startDate"
            type="date"
            defaultValue={toDateInput(defaultValues?.startDate)}
            className={input}
          />
        </div>
        <div>
          <label className={lbl}>Data de Fim</label>
          <input
            name="endDate"
            type="date"
            defaultValue={toDateInput(defaultValues?.endDate)}
            className={input}
          />
        </div>
      </div>

      {/* ── DESCRIÇÃO ── */}
      <div>
        <label className={lbl}>Descrição</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={defaultValues?.description ?? ""}
          placeholder="Descrição opcional da exposição..."
          className={`${input} resize-y`}
        />
      </div>

      {/* ── SLUG AVANÇADO ── */}
      <details className="group">
        <summary className="cursor-pointer text-xs text-muted hover:text-ink transition-colors list-none flex items-center gap-1.5">
          <span className="group-open:rotate-90 transition-transform inline-block">›</span>
          Configurações avançadas (URL)
        </summary>
        <div className="mt-3">
          <label className={lbl}>Endereço da exposição</label>
          <input
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
            className={`${input} font-mono text-xs`}
          />
          <p className="mt-1.5 text-xs text-muted font-mono">/exposicoes/{slug || "nome-da-exposicao"}</p>
        </div>
      </details>

      {/* ── BOTÕES ── */}
      <div className="flex items-center gap-4 pt-4 border-t border-line">
        <SubmitButton label={submitLabel} pendingLabel="A guardar..." />
        <a href="/admin/exhibitions" className="text-sm text-muted hover:text-ink transition-colors">
          Cancelar
        </a>
      </div>
    </form>
  );
}
