"use client";

import { useState, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { slugify } from "@/lib/utils";
import { SubmitButton } from "./SubmitButton";

interface DefaultValues {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  status?: string;
  featuredImage?: { url: string; alt?: string | null } | null;
}

interface PostFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: DefaultValues;
  submitLabel?: string;
}

const input =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-ink/30 transition-colors";

const lbl = "block text-xs font-semibold uppercase tracking-wider text-muted/60 mb-2";

// Converte HTML simples de volta a texto editável
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<\/?p>/gi, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export function PostForm({ action, defaultValues, submitLabel = "Guardar" }: PostFormProps) {
  const [title, setTitle]           = useState(defaultValues?.title ?? "");
  const [slug, setSlug]             = useState(defaultValues?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!defaultValues?.slug);
  const [preview, setPreview]       = useState<string | null>(defaultValues?.featuredImage?.url ?? null);
  const [dragging, setDragging]     = useState(false);
  const fileRef                     = useRef<HTMLInputElement>(null);

  const contentDefault = defaultValues?.content ? htmlToText(defaultValues.content) : "";

  function onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    if (!slugEdited) setSlug(slugify(val));
  }

  function applyFile(file: File) {
    setPreview(URL.createObjectURL(file));
    if (fileRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileRef.current.files = dt.files;
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) applyFile(file);
  }

  return (
    <form action={action} className="space-y-7">

      {/* ── IMAGEM DE DESTAQUE ── */}
      <div>
        <p className={lbl}>Imagem de Destaque</p>
        {preview ? (
          <div className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="preview" className="w-full max-h-56 rounded-xl border border-line object-cover bg-canvas" />
            <button
              type="button"
              onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
              className="absolute top-3 right-3 bg-ink/80 text-paper rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
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
            className={`w-full rounded-xl border-2 border-dashed py-10 flex flex-col items-center gap-3 cursor-pointer transition-colors
              ${dragging ? "border-accent bg-accent/5" : "border-line hover:border-ink/30 hover:bg-canvas"}`}
          >
            <ImagePlus className="h-7 w-7 text-muted/40" />
            <div className="text-center">
              <p className="text-sm font-medium text-ink">Escolher imagem de capa</p>
              <p className="text-xs text-muted mt-0.5">ou arrasta e larga aqui</p>
            </div>
          </button>
        )}
        <input ref={fileRef} name="image" type="file" accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) applyFile(f); }}
          className="hidden"
        />
      </div>

      {/* ── TÍTULO ── */}
      <div>
        <label className={lbl}>Título *</label>
        <input
          name="title"
          type="text"
          required
          value={title}
          onChange={onTitleChange}
          placeholder="Título do artigo"
          className={`${input} text-base`}
        />
      </div>

      {/* ── RESUMO ── */}
      <div>
        <label className={lbl}>Resumo</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={defaultValues?.excerpt ?? ""}
          placeholder="Uma frase curta que resume o artigo (aparece nos cards do blog)"
          className={`${input} resize-none`}
        />
      </div>

      {/* ── CONTEÚDO ── */}
      <div>
        <label className={lbl}>Conteúdo do Artigo</label>
        <textarea
          name="content"
          rows={16}
          defaultValue={contentDefault}
          placeholder={`Escreve aqui o conteúdo completo do artigo...

Separa os parágrafos com uma linha em branco.

Podes escrever o texto livremente — quanto mais detalhes melhor.`}
          className={`${input} resize-y leading-relaxed font-sans`}
        />
        <p className="mt-1.5 text-xs text-muted">
          Separa parágrafos com uma linha em branco. O texto é formatado automaticamente.
        </p>
      </div>

      {/* ── ESTADO ── */}
      <div>
        <label className={lbl}>Estado</label>
        <div className="flex gap-3">
          {[
            { value: "DRAFT",     label: "Rascunho",   desc: "Não aparece no site" },
            { value: "PUBLISHED", label: "Publicado",  desc: "Visível no site" },
          ].map((opt) => (
            <label key={opt.value} className="flex-1 cursor-pointer">
              <input type="radio" name="status" value={opt.value}
                defaultChecked={(defaultValues?.status ?? "DRAFT") === opt.value}
                className="peer sr-only"
              />
              <div className="rounded-xl border border-line p-4 text-center transition-colors peer-checked:border-ink peer-checked:bg-ink/5">
                <p className="text-sm font-semibold text-ink">{opt.label}</p>
                <p className="text-xs text-muted mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* ── SLUG AVANÇADO ── */}
      <details className="group">
        <summary className="cursor-pointer text-xs text-muted hover:text-ink transition-colors list-none flex items-center gap-1.5">
          <span className="group-open:rotate-90 transition-transform inline-block">›</span>
          Configurações avançadas (URL)
        </summary>
        <div className="mt-3">
          <label className={lbl}>Endereço do artigo</label>
          <input
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
            className={`${input} font-mono text-xs`}
          />
          <p className="mt-1.5 text-xs text-muted font-mono">/blog/{slug || "titulo-do-artigo"}</p>
        </div>
      </details>

      {/* ── BOTÕES ── */}
      <div className="flex items-center gap-4 pt-4 border-t border-line">
        <SubmitButton label={submitLabel} pendingLabel="A guardar..." />
        <a href="/admin/posts" className="text-sm text-muted hover:text-ink transition-colors">
          Cancelar
        </a>
      </div>
    </form>
  );
}
