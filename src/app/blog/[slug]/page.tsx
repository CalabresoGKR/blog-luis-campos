import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getPosts } from "@/lib/queries";
import { PublicLayout } from "@/components/public/PublicLayout";
import { BlogCard } from "@/components/public/BlogCard";
import { FadeIn } from "@/components/public/FadeIn";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artigo não encontrado" };
  return {
    title: `${post.title} — Luís Campos`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.featuredImage ? [post.featuredImage.url] : [],
      type: "article",
    },
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date(date));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [post, recentPosts] = await Promise.all([
    getPostBySlug(slug),
    getPosts({ take: 4 }),
  ]);

  if (!post) notFound();

  const relatedPosts = recentPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <PublicLayout>

      {/* Back */}
      <div className="pt-28 pb-8 px-6 lg:px-10 max-w-7xl mx-auto">
        <Link
          href="/blog"
          className="type-breadcrumb inline-flex items-center gap-2 text-muted hover:text-ink transition-colors duration-200"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Todos os artigos
        </Link>
      </div>

      {/* Article header */}
      <header className="px-6 lg:px-10 pb-12 max-w-4xl mx-auto">
        {post.categories.length > 0 && (
          <FadeIn>
            <span className="type-overline text-accent block mb-7">
              {post.categories[0].name}
            </span>
          </FadeIn>
        )}
        <FadeIn delay={100}>
          <h1 className="type-h1 text-ink mb-7">{post.title}</h1>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="flex items-center gap-4 type-card-meta text-muted/60">
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
            {post.author?.name && (
              <>
                <span className="text-line">·</span>
                <span>{post.author.name}</span>
              </>
            )}
          </div>
        </FadeIn>
      </header>

      {/* Hero image */}
      {post.featuredImage && (
        <FadeIn>
          <div className="relative w-full max-w-6xl mx-auto px-6 lg:px-10 mb-16">
            <div className="relative aspect-[16/7] overflow-hidden">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt ?? post.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </FadeIn>
      )}

      {/* Content */}
      <article className="px-6 lg:px-10 pb-24 max-w-3xl mx-auto">
        {post.excerpt && (
          <FadeIn>
            <p className="type-subtitle-lg text-ink/75 pb-10 mb-10 border-b border-line">
              {post.excerpt}
            </p>
          </FadeIn>
        )}

        <FadeIn delay={100}>
          <div
            className="prose-nexa"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </FadeIn>

        {/* Tags */}
        {post.tags.length > 0 && (
          <FadeIn delay={200}>
            <div className="mt-12 pt-8 border-t border-line flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="type-label px-3.5 py-1.5 rounded-full border border-line text-muted"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </FadeIn>
        )}
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-canvas py-20 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="type-h3 text-ink mb-12">Outros Artigos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {relatedPosts.map((p, i) => (
                <FadeIn key={p.id} delay={i * 60}>
                  <BlogCard
                    slug={p.slug}
                    title={p.title}
                    excerpt={p.excerpt}
                    publishedAt={p.publishedAt}
                    imageUrl={p.featuredImage?.url}
                    imageAlt={p.featuredImage?.alt}
                    authorName={p.author?.name}
                    categories={p.categories}
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
