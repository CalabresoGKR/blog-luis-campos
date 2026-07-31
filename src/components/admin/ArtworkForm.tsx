"use client";

import { useState, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { slugify } from "@/lib/utils";
import { SubmitButton } from "./SubmitButton";

const STATUS_OPTIONS = [
  { value: "AVAILABLE",          label: "Disponível" },
  { value: "ON_EXHIBITION",      label: "Em Exposição" },
  { value: "PRIVATE_COLLECTION", label: "Coleção Privada" },
  { value: "SOLD",               label: "Vendida" },
  { value: "NOT_FOR_SALE",       label: "Não Disponível" },
];

interface DefaultValues {
  title?: string;
  slug?: string;
  year?: number | null;
  technique?: string | null;
  dimensions?: string | null;
  description?: string | null;
  status?: string;
  currentLocation?: string | null;
  featuredImage?: { url: string; alt?: string | null } | null;
}

interface ArtworkFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: DefaultValues;
  submitLabel?: string;
}

const input =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-ink/30 transition-colors";

const label = "block text-xs font-semibold uppercase tracking-wider text-muted/60 mb-2";

export function ArtworkForm({ action, defaultValues, submitLabel = "Guardar" }: ArtworkFormProps) {
  const [title, setTitle]           = useState(defaultValues?.title ?? "");
  const [slug, setSlug]             = useState(defaultValues?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!defaultValues?.slug);
  const [preview, setPreview]       = useState<string | null>(defaultValues?.featuredImage?.url ?? null);
  const [dragging, setDragging]     = useState(false);
  const fileRef                     = useRef<HTMLInputElement>(null);

  function onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    if (!slugEdited) setSlug(slugify(val));
  }

  function onSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(e.target.value);
    setSlugEdited(true);
  }

  function applyFile(file: File) {
    setPreview(URL.createObjectURL(file));
    if (fileRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileRef.current.files = dt.files;
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) applyFile(file);
  }

  function removeImage() {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <form action={action} className="space-y-8">

      {/* ── IMAGEM ── */}
      <div>
        <p className={label}>Imagem da Obra</p>

        {preview ? (
          <div className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Pré-visualização"
              className="w-full max-h-72 rounded-xl border border-line object-contain bg-canvas"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-3 right-3 bg-ink/80 text-paper rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`w-full rounded-xl border-2 border-dashed transition-colors py-14 flex flex-col items-center gap-3 cursor-pointer
              ${dragging ? "border-accent bg-accent/5" : "border-line hover:border-ink/30 hover:bg-canvas"}`}
          >
            <div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center">
              <ImagePlus className="h-6 w-6 text-muted/50" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-ink">Clica para escolher a imagem</p>
              <p className="text-xs text-muted mt-1">ou arrasta e larga aqui · JPG, PNG, WebP</p>
            </div>
          </button>
        )}

        <input
          ref={fileRef}
          name="image"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {/* ── NOME ── */}
      <div>
        <label className={label}>Nome da Obra *</label>
        <input
          name="title"
          type="text"
          required
          value={title}
          onChange={onTitleChange}
          placeholder="Ex: Memória de Mesa"
          className={`${input} text-base`}
        />
      </div>

      {/* ── DESCRIÇÃO ── */}
      <div>
        <label className={label}>Descrição</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={defaultValues?.description ?? ""}
          placeholder="Descreve a obra, o contexto, a série ou a técnica utilizada..."
          className={`${input} resize-none leading-relaxed`}
        />
      </div>

      {/* ── DETALHES ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Ano</label>
          <input
            name="year"
            type="number"
            defaultValue={defaultValues?.year ?? ""}
            placeholder="2025"
            min="1900"
            max="2100"
            className={input}
          />
        </div>
        <div>
          <label className={label}>Técnica</label>
          <input
            name="technique"
            type="text"
            defaultValue={defaultValues?.technique ?? "Xilogravura"}
            placeholder="Xilogravura"
            className={input}
          />
        </div>
        <div>
          <label className={label}>Dimensões</label>
          <input
            name="dimensions"
            type="text"
            defaultValue={defaultValues?.dimensions ?? ""}
            placeholder="50 × 70 cm"
            className={input}
          />
        </div>
        <div>
          <label className={label}>Estado</label>
          <select
            name="status"
            defaultValue={defaultValues?.status ?? "AVAILABLE"}
            className={input}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── LOCALIZAÇÃO ── */}
      <div>
        <label className={label}>Localização Atual</label>
        <input
          name="currentLocation"
          type="text"
          defaultValue={defaultValues?.currentLocation ?? ""}
          placeholder="Torres Novas, Portugal"
          className={input}
        />
      </div>

      {/* ── SLUG (avançado) ── */}
      <details className="group">
        <summary className="cursor-pointer text-xs text-muted hover:text-ink transition-colors list-none flex items-center gap-1.5">
          <span className="group-open:rotate-90 transition-transform inline-block">›</span>
          Configurações avançadas (URL)
        </summary>
        <div className="mt-3">
          <label className={label}>Endereço da obra (slug)</label>
          <input
            name="slug"
            type="text"
            value={slug}
            onChange={onSlugChange}
            placeholder="nome-da-obra"
            className={`${input} font-mono text-xs`}
          />
          <p className="mt-1.5 text-xs text-muted">
            O endereço será: <span className="font-mono">/obras/{slug || "nome-da-obra"}</span>
          </p>
        </div>
      </details>

      {/* ── BOTÕES ── */}
      <div className="flex items-center gap-4 pt-4 border-t border-line">
        <SubmitButton label={submitLabel} pendingLabel="A guardar..." />
        <a href="/admin/artworks" className="text-sm text-muted hover:text-ink transition-colors">
          Cancelar
        </a>
      </div>
    </form>
  );
}
