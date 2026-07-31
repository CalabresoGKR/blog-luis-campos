import { PageHeader } from "@/components/admin/PageHeader";
import { ArtworkForm } from "@/components/admin/ArtworkForm";
import { createArtwork } from "@/actions/artwork";

export default function NewArtworkPage() {
  return (
    <div>
      <PageHeader
        title="Nova Obra"
        description="Preenche os campos e guarda — a obra fica imediatamente disponível no site."
      />
      <div className="max-w-2xl bg-paper rounded-xl border border-line p-8">
        <ArtworkForm action={createArtwork} submitLabel="Criar Obra" />
      </div>
    </div>
  );
}
