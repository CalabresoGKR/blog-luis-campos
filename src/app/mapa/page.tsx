import { getMapPins } from "@/lib/queries";
import { PublicLayout } from "@/components/public/PublicLayout";
import { FadeIn } from "@/components/public/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mapa das Obras — Luís Campos",
  description: "Mapa interativo com a localização das obras de Luís Campos no mundo.",
};

export default async function MapaPage() {
  const pins = await getMapPins();

  return (
    <PublicLayout>

      {/* Header */}
      <section className="pt-40 pb-12 px-6 lg:px-10 max-w-7xl mx-auto">
        <FadeIn>
          <span className="type-overline text-accent block mb-8">Localização</span>
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className="type-h1 text-ink">Mapa das Obras</h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="type-subtitle-lg text-muted mt-4 max-w-xl">
            Torres Novas, Portugal — sede do atelier e ponto de partida das obras de Luís Campos.
          </p>
        </FadeIn>
      </section>

      {/* Google Maps */}
      <section className="px-6 lg:px-10 pb-24 max-w-7xl mx-auto">
        <FadeIn>
          <div
            className="relative overflow-hidden rounded-2xl border border-line"
            style={{ height: "65vh", minHeight: 480 }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Torres+Novas,+Portugal&z=14&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do atelier — Torres Novas, Portugal"
            />
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="mt-5 flex items-center gap-2 type-caption text-muted">
            <div className="w-2.5 h-2.5 rounded-full bg-accent border-2 border-paper shadow-sm flex-shrink-0" />
            <span>Torres Novas, Portugal — atelier de Luís Campos</span>
          </div>
        </FadeIn>
      </section>

      {/* Pin list from database */}
      {pins.length > 0 && (
        <section className="bg-canvas py-20 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <h2 className="type-h3 text-ink mb-10">Obras pelo Mundo</h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pins.map((pin, i) => (
                <FadeIn key={pin.id} delay={(i % 6) * 40}>
                  <div className="bg-paper rounded-xl p-5 border border-line">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <div className="min-w-0">
                        {pin.artwork && (
                          <p className="type-h6 text-ink truncate">
                            {pin.artwork.title}
                            {pin.artwork.year && (
                              <span className="type-card-meta text-muted font-normal ml-1.5">
                                · {pin.artwork.year}
                              </span>
                            )}
                          </p>
                        )}
                        {(pin.city || pin.country) && (
                          <p className="type-card-meta text-muted mt-1">
                            {[pin.city, pin.country].filter(Boolean).join(", ")}
                          </p>
                        )}
                        {pin.artwork && (
                          <a
                            href={`/obras/${pin.artwork.slug}`}
                            className="type-caption text-accent hover:underline mt-1.5 inline-block"
                          >
                            Ver obra →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
