import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getArtworkBySlug, getRelatedArtworks } from "@/lib/queries";
import { PublicLayout } from "@/components/public/PublicLayout";
import { ArtworkCard } from "@/components/public/ArtworkCard";
import { FadeIn } from "@/components/public/FadeIn";
import { ArtworkGallery } from "./ArtworkGallery";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) return { title: "Obra não encontrada" };
  return {
    title: `${artwork.title} — Luís Campos`,
    description: artwork.description ?? `Obra de Luís Campos: ${artwork.title}`,
    openGraph: {
      title: `${artwork.title} — Luís Campos`,
      images: artwork.featuredImage ? [artwork.featuredImage.url] : [],
    },
  };
}

const STATUS_LABELS: Record<string, string> = {
  ON_EXHIBITION:      "Em Exposição",
  PRIVATE_COLLECTION: "Coleção Privada",
  AVAILABLE:          "Disponível",
  SOLD:               "Vendida",
  NOT_FOR_SALE:       "Não disponível",
};

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params;
  const [artwork, related] = await Promise.all([
    getArtworkBySlug(slug),
    getRelatedArtworks(slug, 4),
  ]);

  if (!artwork) notFound();

  const allImages = [
    ...(artwork.featuredImage ? [artwork.featuredImage] : []),
    ...artwork.images.map((i) => i.media),
  ];

  return (
    <PublicLayout>

      {/* Breadcrumb */}
      <div className="pt-28 pb-8 px-6 lg:px-10 max-w-7xl mx-auto">
        <Link
          href="/obras"
          className="type-breadcrumb inline-flex items-center gap-2 text-muted hover:text-ink transition-colors duration-200"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Todas as obras
        </Link>
      </div>

      {/* Main */}
      <section className="px-6 lg:px-10 pb-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-20 items-start">

          {/* Gallery */}
          <ArtworkGallery images={allImages} />

          {/* Details */}
          <div className="lg:sticky lg:top-28">
            <FadeIn>
              <span className="type-label text-accent block mb-5">
                {STATUS_LABELS[artwork.status] ?? artwork.status}
              </span>
              <h1 className="type-h2 text-ink mb-7">{artwork.title}</h1>
            </FadeIn>

            {/* Metadata */}
            <FadeIn delay={100}>
              <dl className="border-t border-line">
                {[
                  { label: "Ano",         value: artwork.year?.toString() },
                  { label: "Técnica",     value: artwork.technique },
                  { label: "Dimensões",   value: artwork.dimensions },
                  { label: "Localização", value: artwork.currentLocation },
                ]
                  .filter((item) => item.value)
                  .map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between py-3.5 border-b border-line"
                    >
                      <dt className="type-label text-muted/55">{item.label}</dt>
                      <dd className="type-body-sm text-ink">{item.value}</dd>
                    </div>
                  ))}
              </dl>
            </FadeIn>

            {artwork.description && (
              <FadeIn delay={200}>
                <p className="type-body text-muted mt-8">{artwork.description}</p>
              </FadeIn>
            )}

            {/* Actions */}
            <FadeIn delay={300}>
              <div className="mt-8 flex gap-3">
                <Link
                  href="/contactos"
                  className="type-btn flex-1 text-center bg-ink text-paper py-4 rounded-full hover:bg-ink/90 transition-colors duration-200"
                >
                  Contactar
                </Link>
                <Link
                  href="/obras"
                  className="type-btn flex-1 text-center border border-line text-ink py-4 rounded-full hover:border-ink/50 transition-colors duration-200"
                >
                  Ver mais obras
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-canvas py-20 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="type-h3 text-ink mb-12">Outras Obras</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((rel, i) => (
                <FadeIn key={rel.id} delay={i * 60}>
                  <ArtworkCard
                    slug={rel.slug}
                    title={rel.title}
                    year={rel.year}
                    technique={rel.technique}
                    dimensions={rel.dimensions}
                    status={rel.status}
                    imageUrl={rel.featuredImage?.url}
                    imageAlt={rel.featuredImage?.alt}
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
