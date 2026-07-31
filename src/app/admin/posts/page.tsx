import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import { formatDate } from "@/lib/utils";

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  DRAFT:     { label: "Rascunho",  cls: "bg-gray-100 text-gray-500 border-gray-200" },
  SCHEDULED: { label: "Agendado", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  PUBLISHED: { label: "Publicado", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { featuredImage: { select: { url: true, alt: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Blog"
        description={`${posts.length} artigo${posts.length !== 1 ? "s" : ""}`}
        action={
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo Artigo
          </Link>
        }
      />

      {posts.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-line bg-canvas p-20 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-paper border border-line">
            <Plus className="h-7 w-7 text-muted/40" />
          </div>
          <h3 className="font-display text-lg text-ink mb-2">Nenhum artigo ainda</h3>
          <p className="text-sm text-muted mb-6 max-w-xs mx-auto">
            Cria o primeiro artigo do blog — aparece automaticamente em /blog.
          </p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:bg-ink/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Criar Artigo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => {
            const badge = STATUS_BADGE[post.status] ?? STATUS_BADGE.DRAFT;
            return (
              <div
                key={post.id}
                className="group rounded-2xl border border-line bg-paper overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Imagem */}
                <div className="relative aspect-[16/9] bg-canvas overflow-hidden">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt ?? post.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-canvas">
                      <span className="text-muted/20 text-5xl font-display">{post.title[0]}</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-display text-base text-ink font-medium line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  )}
                  {post.publishedAt && (
                    <p className="text-xs text-muted/50 mt-3">{formatDate(post.publishedAt)}</p>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center border-t border-line divide-x divide-line">
                  {post.status === "PUBLISHED" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-muted hover:text-ink hover:bg-canvas transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Ver
                    </Link>
                  )}
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-muted hover:text-ink hover:bg-canvas transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Link>
                  <div className="flex-1">
                    <DeletePostButton id={post.id} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Card Novo Artigo */}
          <Link
            href="/admin/posts/new"
            className="rounded-2xl border-2 border-dashed border-line hover:border-ink/30 hover:bg-canvas transition-colors aspect-[16/9] flex flex-col items-center justify-center gap-3 text-muted hover:text-ink group"
          >
            <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Novo Artigo</span>
          </Link>
        </div>
      )}
    </div>
  );
}
