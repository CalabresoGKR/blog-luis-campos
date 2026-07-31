import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { getExhibitionBySlug } from "@/lib/queries";
import { PublicLayout } from "@/components/public/PublicLayout";
import { FadeIn } from "@/components/public/FadeIn";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exhibition = await getExhibitionBySlug(slug);
  if (!exhibition) return { title: "Exposição não encontrada" };
  return {
    title: `${exhibition.title} — Luís Campos`,
    description: exhibition.description ?? undefined,
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date(date));
}

export default async function ExhibitionPage({ params }: Props) {
  const { slug } = await params;
  const exhibition = await getExhibitionBySlug(slug);
  if (!exhibition) notFound();

  const location = [exhibition.venue, exhibition.city, exhibition.country].filter(Boolean).join(", ");
  const isUpcoming = !exhibition.endDate || new Date(exhibition.endDate) >= new Date();
  const images = exhibition.images.map((i) => i.media);

  return (
    <PublicLayout>

      {/* Back */}
      <div className="pt-28 pb-8 px-6 lg:px-10 max-w-7xl mx-auto">
        <Link
          href="/exposicoes"
          className="type-breadcrumb inline-flex items-center gap-2 text-muted hover:text-ink transition-colors duration-200"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Todas as exposições
        </Link>
      </div>

      {/* Hero image */}
      {images[0] && (
        <FadeIn>
          <div className="relative aspect-[16/7] w-full max-w-7xl mx-auto px-6 lg:px-10 mb-12">
            <div className="relative h-full overflow-hidden">
              <Image
                src={images[0].url}
                alt={images[0].alt ?? exhibition.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </FadeIn>
      )}

      {/* Header */}
      <header className="px-6 lg:px-10 pb-12 max-w-4xl mx-auto">
        <FadeIn>
          <span className={`type-label block mb-7 ${isUpcoming ? "text-accent" : "text-muted/50"}`}>
            {isUpcoming ? "Em Curso / Próxima" : "Exposição Anterior"}
          </span>
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className="type-h1 text-ink mb-8">{exhibition.title}</h1>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="flex flex-col sm:flex-row gap-5 type-body-sm text-muted">
            {(exhibition.startDate || exhibition.endDate) && (
              <div className="flex items-center gap-2.5">
                <Calendar size={15} className="text-accent flex-shrink-0" />
                <span>
                  {exhibition.startDate && formatDate(exhibition.startDate)}
                  {exhibition.endDate && ` — ${formatDate(exhibition.endDate)}`}
                </span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-accent flex-shrink-0" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </FadeIn>
      </header>

      {/* Description */}
      {exhibition.description && (
        <section className="px-6 lg:px-10 pb-16 max-w-3xl mx-auto">
          <FadeIn>
            <p className="type-body-lg text-muted">{exhibition.description}</p>
          </FadeIn>
        </section>
      )}

      {/* Gallery */}
      {images.length > 1 && (
        <section className="px-6 lg:px-10 pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.slice(1).map((img, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="relative aspect-[4/3] overflow-hidden bg-canvas">
                  <Image
                    src={img.url}
                    alt={img.alt ?? ""}
                    fill
                    className="object-cover hover:scale-[1.04] transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-canvas py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="type-h4 text-ink">Interessado em visitar?</p>
          <Link
            href="/contactos"
            className="type-btn inline-flex items-center gap-2 bg-ink text-paper px-7 py-4 rounded-full hover:bg-ink/90 transition-colors duration-200"
          >
            Contactar o Artista
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
