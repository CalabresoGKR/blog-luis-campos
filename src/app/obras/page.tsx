import { getArtworks } from "@/lib/queries";
import { PublicLayout } from "@/components/public/PublicLayout";
import { ArtworkCard } from "@/components/public/ArtworkCard";
import { FadeIn } from "@/components/public/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Obras — Luís Campos",
  description: "Galeria completa de obras de Luís Campos, artista plástico e xilografista.",
};

export default async function ObrasPage() {
  const artworks = await getArtworks();

  const techniques = Array.from(
    new Set(artworks.map((a) => a.technique).filter(Boolean))
  ) as string[];

  return (
    <PublicLayout>

      {/* Header */}
      <section className="pt-40 pb-16 px-6 lg:px-10 max-w-7xl mx-auto">
        <FadeIn>
          <span className="type-overline text-accent block mb-8">Portfólio</span>
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className="type-h1 text-ink">Obras</h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="type-subtitle-lg text-muted mt-4">
            {artworks.length > 0
              ? `${artworks.length} obras no portfólio`
              : "Galeria em construção."}
          </p>
        </FadeIn>
      </section>

      {/* Technique filter */}
      {techniques.length > 1 && (
        <div className="px-6 lg:px-10 pb-12 max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex flex-wrap gap-2">
              {["Todas", ...techniques].map((tech) => (
                <span
                  key={tech}
                  className="type-label px-4 py-2 rounded-full border border-line text-muted cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      )}

      {/* Grid */}
      <section className="px-6 lg:px-10 pb-32 max-w-7xl mx-auto">
        {artworks.length === 0 ? (
          <FadeIn>
            <div className="py-32 text-center">
              <p className="type-h3 text-ink/30 mb-3">Sem obras disponíveis</p>
              <p className="type-body-sm text-muted">As obras serão adicionadas em breve.</p>
            </div>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {artworks.map((artwork, i) => (
              <FadeIn key={artwork.id} delay={(i % 6) * 60}>
                <ArtworkCard
                  slug={artwork.slug}
                  title={artwork.title}
                  year={artwork.year}
                  technique={artwork.technique}
                  dimensions={artwork.dimensions}
                  status={artwork.status}
                  imageUrl={artwork.featuredImage?.url}
                  imageAlt={artwork.featuredImage?.alt}
                />
              </FadeIn>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
