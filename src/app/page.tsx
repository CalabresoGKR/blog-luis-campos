import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedArtworks, getPosts, getExhibitions, getHomePage } from "@/lib/queries";
import { PublicLayout } from "@/components/public/PublicLayout";
import { SectionTitle } from "@/components/public/SectionTitle";
import { ArtworkCard } from "@/components/public/ArtworkCard";
import { BlogCard } from "@/components/public/BlogCard";
import { ExhibitionCard } from "@/components/public/ExhibitionCard";
import { FadeIn } from "@/components/public/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luís Campos — Artista Plástico e Xilografista",
  description:
    "Portfólio oficial de Luís Campos, artista plástico e xilografista de Torres Novas, Portugal.",
  openGraph: {
    title: "Luís Campos — Artista Plástico e Xilografista",
    description: "Portfólio oficial de Luís Campos, artista plástico e xilografista de Torres Novas, Portugal.",
    type: "website",
  },
};

export default async function HomePage() {
  const [homePage, artworks, posts, exhibitions] = await Promise.all([
    getHomePage(),
    getFeaturedArtworks(6),
    getPosts({ take: 3 }),
    getExhibitions(),
  ]);

  const upcomingExhibitions = exhibitions
    .filter((e) => !e.endDate || new Date(e.endDate) >= new Date())
    .slice(0, 3);

  const heroImage = homePage?.mainImage?.url;

  return (
    <PublicLayout>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] max-h-[1080px] flex items-end">

        {/* Background */}
        <div className="absolute inset-0 bg-ink">
          {heroImage && (
            <Image
              src={heroImage}
              alt={homePage?.mainImage?.alt ?? "Obra de Luís Campos"}
              fill
              className="object-cover opacity-55"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/25 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10 pb-20 lg:pb-28">
          <div className="max-w-4xl">

            <p className="type-overline text-paper/50 mb-8">
              Torres Novas · Portugal
            </p>

            <h1 className="type-display-xl text-paper mb-7 tracking-tightest">
              Luís<br />Campos
            </h1>

            <p className="type-subtitle-lg text-paper/65 max-w-lg mb-10">
              {homePage?.mainText ??
                "Artista plástico e xilografista. Uma vida dedicada à arte da gravura em madeira e à exploração das formas e texturas naturais."}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/obras"
                className="type-btn inline-flex items-center gap-2.5 bg-paper text-ink px-7 py-4 rounded-full hover:bg-paper/92 transition-colors duration-200"
              >
                Explorar Obras
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
              <Link
                href="/sobre"
                className="type-btn inline-flex items-center gap-2 border border-paper/25 text-paper px-7 py-4 rounded-full hover:border-paper/60 transition-colors duration-200"
              >
                Sobre o Artista
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-10 hidden lg:flex flex-col items-center gap-3">
          <div className="w-px h-14 bg-gradient-to-b from-paper/40 to-transparent" />
          <span className="type-caption text-paper/35 rotate-90 translate-y-5 origin-center tracking-widest">
            Scroll
          </span>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────── */}
      {(homePage?.marqueeText) && (
        <div className="bg-accent text-paper py-3.5 overflow-hidden select-none">
          <div className="flex animate-marquee">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="type-label shrink-0 px-10 opacity-75">
                {homePage.marqueeText} &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── OBRAS EM DESTAQUE ─────────────────────────────────────────── */}
      {artworks.length > 0 && (
        <section className="py-24 lg:py-32 px-6 lg:px-10 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
            <SectionTitle eyebrow="Portfólio" title="Obras em Destaque" align="left" />
            <FadeIn>
              <Link
                href="/obras"
                className="type-nav inline-flex items-center gap-2 text-muted hover:text-ink transition-colors duration-200 whitespace-nowrap"
              >
                Ver todas as obras <ArrowRight size={14} />
              </Link>
            </FadeIn>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {artworks.map((artwork, i) => (
              <FadeIn key={artwork.id} delay={i * 80}>
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
        </section>
      )}

      {/* ── CITAÇÃO ───────────────────────────────────────────────────── */}
      {homePage?.quote && (
        <section className="bg-canvas py-24 lg:py-32 px-6 lg:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <span className="type-display-lg text-accent/20 leading-none select-none">&ldquo;</span>
            </FadeIn>
            <FadeIn delay={100}>
              <blockquote className="type-quote text-ink mt-[-1rem]">
                {homePage.quote}
              </blockquote>
            </FadeIn>
            <FadeIn delay={200}>
              <cite className="type-overline text-muted not-italic mt-6 block">Luís Campos</cite>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── EXPOSIÇÕES ───────────────────────────────────────────────── */}
      {upcomingExhibitions.length > 0 && (
        <section className="py-24 lg:py-32 px-6 lg:px-10 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-4">
            <SectionTitle eyebrow="Agenda" title="Exposições" align="left" />
            <FadeIn>
              <Link
                href="/exposicoes"
                className="type-nav inline-flex items-center gap-2 text-muted hover:text-ink transition-colors duration-200 whitespace-nowrap"
              >
                Ver todas <ArrowRight size={14} />
              </Link>
            </FadeIn>
          </div>
          {upcomingExhibitions.map((exhibition) => (
            <FadeIn key={exhibition.id}>
              <ExhibitionCard
                slug={exhibition.slug}
                title={exhibition.title}
                venue={exhibition.venue}
                city={exhibition.city}
                country={exhibition.country}
                startDate={exhibition.startDate}
                endDate={exhibition.endDate}
                imageUrl={exhibition.images[0]?.media.url}
                imageAlt={exhibition.images[0]?.media.alt}
              />
            </FadeIn>
          ))}
        </section>
      )}

      {/* ── BLOG ─────────────────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="bg-canvas py-24 lg:py-32 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
              <SectionTitle eyebrow="Publicações" title="Últimos Artigos" align="left" />
              <FadeIn>
                <Link
                  href="/blog"
                  className="type-nav inline-flex items-center gap-2 text-muted hover:text-ink transition-colors duration-200 whitespace-nowrap"
                >
                  Ver todos os artigos <ArrowRight size={14} />
                </Link>
              </FadeIn>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post, i) => (
                <FadeIn key={post.id} delay={i * 80}>
                  <BlogCard
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    publishedAt={post.publishedAt}
                    imageUrl={post.featuredImage?.url}
                    imageAlt={post.featuredImage?.alt}
                    authorName={post.author?.name}
                    categories={post.categories}
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA MAPA ─────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-ink">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <span className="type-overline text-paper/40 block mb-8">Mapa das Obras</span>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="type-h2 text-paper mb-6">
              Descubra onde as obras<br className="hidden sm:block" /> estão pelo mundo.
            </h2>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="type-body-lg text-paper/55 mb-10">
              Explore o mapa interativo e descubra em que museus, galerias e coleções privadas se encontram as obras de Luís Campos.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <Link
              href="/mapa"
              className="type-btn inline-flex items-center gap-2.5 bg-paper text-ink px-8 py-4 rounded-full hover:bg-paper/92 transition-colors duration-200"
            >
              Explorar o Mapa <ArrowRight size={15} strokeWidth={2} />
            </Link>
          </FadeIn>
        </div>
      </section>

    </PublicLayout>
  );
}
