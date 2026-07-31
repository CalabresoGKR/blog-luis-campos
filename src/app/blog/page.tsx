import { getPosts, getCategories } from "@/lib/queries";
import { PublicLayout } from "@/components/public/PublicLayout";
import { BlogCard } from "@/components/public/BlogCard";
import { FadeIn } from "@/components/public/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Luís Campos",
  description: "Artigos e publicações de Luís Campos sobre arte, xilogravura e exposições.",
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  const [featured, ...rest] = posts;

  return (
    <PublicLayout>

      {/* Header */}
      <section className="pt-40 pb-16 px-6 lg:px-10 max-w-7xl mx-auto">
        <FadeIn>
          <span className="type-overline text-accent block mb-8">Publicações</span>
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className="type-h1 text-ink">Blog</h1>
        </FadeIn>

        {categories.length > 0 && (
          <FadeIn delay={200}>
            <div className="flex flex-wrap gap-2 mt-8">
              <span className="type-label px-4 py-2 rounded-full bg-ink text-paper">Todos</span>
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="type-label px-4 py-2 rounded-full border border-line text-muted cursor-default"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </FadeIn>
        )}
      </section>

      {posts.length === 0 ? (
        <section className="px-6 lg:px-10 pb-40 max-w-7xl mx-auto">
          <FadeIn>
            <div className="py-32 text-center border border-dashed border-line rounded-2xl">
              <p className="type-h3 text-ink/25 mb-3">Sem publicações</p>
              <p className="type-body-sm text-muted">Os artigos serão publicados em breve.</p>
            </div>
          </FadeIn>
        </section>
      ) : (
        <>
          {featured && (
            <section className="px-6 lg:px-10 pb-16 max-w-7xl mx-auto">
              <FadeIn>
                <BlogCard
                  slug={featured.slug}
                  title={featured.title}
                  excerpt={featured.excerpt}
                  publishedAt={featured.publishedAt}
                  imageUrl={featured.featuredImage?.url}
                  imageAlt={featured.featuredImage?.alt}
                  authorName={featured.author?.name}
                  categories={featured.categories}
                  variant="featured"
                />
              </FadeIn>
            </section>
          )}

          {rest.length > 0 && (
            <section className="px-6 lg:px-10 pb-32 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {rest.map((post, i) => (
                  <FadeIn key={post.id} delay={(i % 3) * 80}>
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
            </section>
          )}
        </>
      )}
    </PublicLayout>
  );
}
