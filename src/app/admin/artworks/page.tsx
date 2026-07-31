import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteArtworkButton } from "@/components/admin/DeleteArtworkButton";

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  AVAILABLE:          { label: "Disponível",     cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ON_EXHIBITION:      { label: "Em Exposição",   cls: "bg-blue-50 text-blue-700 border-blue-200" },
  PRIVATE_COLLECTION: { label: "Col. Privada",   cls: "bg-violet-50 text-violet-700 border-violet-200" },
  SOLD:               { label: "Vendida",        cls: "bg-gray-100 text-gray-500 border-gray-200" },
  NOT_FOR_SALE:       { label: "Não Disponível", cls: "bg-orange-50 text-orange-700 border-orange-200" },
};

export default async function ArtworksPage() {
  const artworks = await prisma.artwork.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    include: { featuredImage: { select: { url: true, alt: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Obras"
        description={`${artworks.length} obra${artworks.length !== 1 ? "s" : ""} no catálogo`}
        action={
          <Link
            href="/admin/artworks/new"
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Obra
          </Link>
        }
      />

      {artworks.length === 0 ? (

        /* ── Estado vazio ── */
        <div className="rounded-2xl border-2 border-dashed border-line bg-canvas p-20 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-paper border border-line">
            <Plus className="h-7 w-7 text-muted/40" />
          </div>
          <h3 className="font-display text-lg text-ink mb-2">Nenhuma obra ainda</h3>
          <p className="text-sm text-muted mb-6 max-w-xs mx-auto">
            Adiciona a primeira obra ao catálogo — ela aparecerá automaticamente no site.
          </p>
          <Link
            href="/admin/artworks/new"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:bg-ink/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar Obra
          </Link>
        </div>

      ) : (

        /* ── Grelha de obras ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {artworks.map((artwork) => {
            const badge = STATUS_BADGE[artwork.status] ?? STATUS_BADGE.AVAILABLE;
            return (
              <div
                key={artwork.id}
                className="group rounded-2xl border border-line bg-paper overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Imagem */}
                <div className="relative aspect-[4/3] bg-canvas overflow-hidden">
                  {artwork.featuredImage ? (
                    <Image
                      src={artwork.featuredImage.url}
                      alt={artwork.featuredImage.alt ?? artwork.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-muted/20 text-4xl font-display">
                        {artwork.title[0]}
                      </span>
                    </div>
                  )}
                  {/* Badge estado */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-display text-base text-ink font-medium truncate">{artwork.title}</h3>
                  <p className="text-xs text-muted mt-1">
                    {[artwork.technique, artwork.year, artwork.dimensions].filter(Boolean).join(" · ")}
                  </p>
                  {artwork.description && (
                    <p className="text-xs text-muted/70 mt-2 line-clamp-2 leading-relaxed">
                      {artwork.description}
                    </p>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center border-t border-line divide-x divide-line">
                  <Link
                    href={`/obras/${artwork.slug}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-muted hover:text-ink hover:bg-canvas transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Ver no site
                  </Link>
                  <Link
                    href={`/admin/artworks/${artwork.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-muted hover:text-ink hover:bg-canvas transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Link>
                  <div className="flex-1 flex items-center justify-center">
                    <DeleteArtworkButton id={artwork.id} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Card Nova Obra */}
          <Link
            href="/admin/artworks/new"
            className="rounded-2xl border-2 border-dashed border-line hover:border-ink/30 hover:bg-canvas transition-colors aspect-[4/3] flex flex-col items-center justify-center gap-3 text-muted hover:text-ink group"
          >
            <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Nova Obra</span>
          </Link>
        </div>
      )}
    </div>
  );
}
