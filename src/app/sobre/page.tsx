import Image from "next/image";
import { getAboutPage, getExhibitions } from "@/lib/queries";
import { PublicLayout } from "@/components/public/PublicLayout";
import { FadeIn } from "@/components/public/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre — Luís Campos",
  description: "Biografia e percurso artístico de Luís Campos, artista plástico e xilografista.",
};

function formatYear(date: Date) {
  return new Date(date).getFullYear();
}

export default async function SobrePage() {
  const [about, exhibitions] = await Promise.all([getAboutPage(), getExhibitions()]);

  const bioParagraphs = (about?.biography ?? "").split("\n\n").filter(Boolean);
  const educationItems = (about?.education ?? "").split("\n").filter(Boolean);

  const timeline = exhibitions
    .filter((e) => e.startDate)
    .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());

  return (
    <PublicLayout>

      {/* ── HERO ── */}
      <section className="pt-40 pb-20 px-6 lg:px-10 max-w-7xl mx-auto">
        <FadeIn>
          <span className="type-overline text-accent block mb-8">Sobre o Artista</span>
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className="type-display-lg text-ink leading-none">Luís<br />Campos</h1>
        </FadeIn>
        {(about?.heroSubtitle) && (
          <FadeIn delay={200}>
            <p className="type-subtitle text-muted mt-6 max-w-sm whitespace-pre-line">
              {about.heroSubtitle}
            </p>
          </FadeIn>
        )}
      </section>

      {/* ── BIOGRAFIA + FOTO ── */}
      <section className="px-6 lg:px-10 pb-28 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_380px] gap-16 lg:gap-24 items-start">

          {/* Texto */}
          <div>
            {bioParagraphs.length > 0 ? (
              <div className="space-y-6">
                {bioParagraphs.map((para, i) => (
                  <FadeIn key={i} delay={i * 80}>
                    <p className={i === 0 ? "type-body-lg text-ink leading-relaxed" : "type-body-lg text-muted leading-relaxed"}>
                      {para}
                    </p>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <FadeIn>
                <p className="type-body-lg text-muted">
                  Artista plástico nascido em Torres Novas, Portugal, dedicado à arte da xilogravura.
                </p>
              </FadeIn>
            )}

            {about?.artisticJourney && (
              <FadeIn delay={200}>
                <div className="mt-10 pt-10 border-t border-line">
                  <p className="type-body text-muted leading-relaxed">{about.artisticJourney}</p>
                </div>
              </FadeIn>
            )}
          </div>

          {/* Foto + factos */}
          <div className="lg:sticky lg:top-28 space-y-5">
            {about?.artistPhoto?.url ? (
              <FadeIn>
                <div className="relative aspect-square overflow-hidden bg-canvas">
                  <Image
                    src={about.artistPhoto.url}
                    alt={about.artistPhoto.alt ?? "Luís Campos"}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 380px"
                    priority
                  />
                </div>
              </FadeIn>
            ) : (
              <div className="aspect-square bg-canvas flex items-center justify-center">
                <span className="type-caption text-muted/40">Fotografia do artista</span>
              </div>
            )}

            <FadeIn delay={100}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Nascimento", value: about?.birthplace    ?? "1985, Zibreira" },
                  { label: "Técnica",    value: about?.mainTechnique ?? "Xilogravura" },
                  { label: "Exposições", value: `${exhibitions.length}` },
                  { label: "Curador",    value: about?.curatorRole   ?? "H. dos Cavaleiros" },
                ].map((item) => (
                  <div key={item.label} className="bg-canvas p-4 rounded-xl">
                    <p className="type-overline text-muted/50 mb-1">{item.label}</p>
                    <p className="type-body-sm font-bold text-ink">{item.value}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FORMAÇÃO + INFLUÊNCIAS ── */}
      {(educationItems.length > 0 || about?.influences) && (
        <section className="bg-canvas py-24 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24">

            {educationItems.length > 0 && (
              <FadeIn>
                <span className="type-overline text-accent block mb-6">Formação</span>
                <ul className="space-y-4">
                  {educationItems.map((item, i) => {
                    const [label, year] = item.split(" — ");
                    return (
                      <li key={i} className="flex items-start gap-4 border-b border-line pb-4 last:border-0">
                        <span className="type-caption text-muted/50 mt-0.5 whitespace-nowrap min-w-[80px] text-right">
                          {year ?? ""}
                        </span>
                        <span className="type-body text-ink">{label}</span>
                      </li>
                    );
                  })}
                </ul>
              </FadeIn>
            )}

            {about?.influences && (
              <FadeIn delay={100}>
                <span className="type-overline text-accent block mb-6">Influências</span>
                <p className="type-body text-muted leading-relaxed">{about.influences}</p>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {/* ── TIMELINE DE EXPOSIÇÕES ── */}
      {timeline.length > 0 && (
        <section className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
          <FadeIn>
            <span className="type-overline text-accent block mb-4">Percurso</span>
            <h2 className="type-h2 text-ink mb-16">Exposições</h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0">
            {timeline.map((item, i) => (
              <FadeIn key={item.id} delay={(i % 6) * 40}>
                <div className="flex items-baseline gap-4 border-b border-line py-4">
                  <span className="type-caption text-accent whitespace-nowrap min-w-[36px]">
                    {item.startDate ? formatYear(item.startDate) : ""}
                  </span>
                  <div className="min-w-0">
                    <p className="type-body-sm font-bold text-ink truncate">{item.title}</p>
                    {(item.venue || item.city) && (
                      <p className="type-caption text-muted truncate">
                        {[item.venue, item.city].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* ── CITAÇÃO FINAL ── */}
      {about?.institutionalText && (
        <section className="bg-ink py-28 px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <p className="type-display-lg text-paper/80 leading-tight">
                &ldquo;{about.institutionalText}&rdquo;
              </p>
              <p className="type-caption text-paper/30 mt-8">— Luís Campos</p>
            </FadeIn>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
