import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { PostForm } from "@/components/admin/PostForm";
import { updatePost } from "@/actions/post";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: { featuredImage: { select: { url: true, alt: true } } },
  });

  if (!post) notFound();

  const action = updatePost.bind(null, id);

  return (
    <div>
      <PageHeader title="Editar Artigo" description={post.title} />
      <div className="max-w-2xl bg-paper rounded-xl border border-line p-8">
        <PostForm
          action={action}
          defaultValues={{
            title:        post.title,
            slug:         post.slug,
            excerpt:      post.excerpt,
            content:      post.content,
            status:       post.status,
            featuredImage: post.featuredImage,
          }}
          submitLabel="Guardar Alterações"
        />
      </div>
    </div>
  );
}
