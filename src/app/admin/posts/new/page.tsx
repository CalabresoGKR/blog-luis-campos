import { PageHeader } from "@/components/admin/PageHeader";
import { PostForm } from "@/components/admin/PostForm";
import { createPost } from "@/actions/post";

export default function NewPostPage() {
  return (
    <div>
      <PageHeader
        title="Novo Artigo"
        description="Escreve o conteúdo e publica quando estiver pronto."
      />
      <div className="max-w-2xl bg-paper rounded-xl border border-line p-8">
        <PostForm action={createPost} submitLabel="Criar Artigo" />
      </div>
    </div>
  );
}
