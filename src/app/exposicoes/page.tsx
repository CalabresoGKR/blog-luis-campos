import { getExhibitions } from "@/lib/queries";
import { PublicLayout } from "@/components/public/PublicLayout";
import { ExhibitionCard } from "@/components/public/ExhibitionCard";
import { FadeIn } from "@/components/public/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exposições — Luís Campos",
  description: "Exposições passadas e futuras de Luís Campos, artista plástico e xilografista.",
};

export default async function ExposicoesPage() {
  const exhibitions = await getExhibitions();
  const now = new Date();
  const upcoming = exhibitions.filter((e) => !e.endDate || new Date(e.endDate) >= now);
  const past = exhibitions.filter((e) => e.endDate && new Date(e.endDate) < now);

  return (
    <PublicLayout>

      {/* Header */}
      <section className="pt-40 pb-16 px-6 lg:px-10 max-w-7xl mx-auto">
        <FadeIn>
          <span className="type-overline text-accent block mb-8">Agenda</span>
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className="type-h1 text-ink">Exposições</h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="type-subtitle-lg text-muted mt-4">
            {exhibitions.length > 0
              ? `${exhibitions.length} exposições registadas`
              : "Exposições em breve."}
          </p>
        </FadeIn>
      </section>

      <div className="px-6 lg:px-10 pb-32 max-w-7xl mx-auto">

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="mb-20">
            <FadeIn>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="type-h3 text-ink">Próximas & Em Curso</h2>
                <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
              </div>
            </FadeIn>
            {upcoming.map((e) => (
              <FadeIn key={e.id}>
                <ExhibitionCard
                  slug={e.slug}
                  title={e.title}
                  venue={e.venue}
                  city={e.city}
                  country={e.country}
                  startDate={e.startDate}
                  endDate={e.endDate}
                  imageUrl={e.images[0]?.media.url}
                  imageAlt={e.images[0]?.media.alt}
                  isPast={false}
                />
              </FadeIn>
            ))}
          </section>
        )}

        {/* Past */}
        {past.length > 0 && (
          <section>
            <FadeIn>
              <h2 className="type-h3 text-ink/40 mb-2">Exposições Anteriores</h2>
            </FadeIn>
            {past.map((e) => (
              <FadeIn key={e.id}>
                <ExhibitionCard
                  slug={e.slug}
                  title={e.title}
                  venue={e.venue}
                  city={e.city}
                  country={e.country}
                  startDate={e.startDate}
                  endDate={e.endDate}
                  imageUrl={e.images[0]?.media.url}
                  imageAlt={e.images[0]?.media.alt}
                  isPast
                />
              </FadeIn>
            ))}
          </section>
        )}

        {exhibitions.length === 0 && (
          <FadeIn>
            <div className="py-32 text-center">
              <p className="type-h3 text-ink/30 mb-3">Sem exposições registadas</p>
              <p className="type-body-sm text-muted">As exposições serão adicionadas em breve.</p>
            </div>
          </FadeIn>
        )}
      </div>
    </PublicLayout>
  );
}
