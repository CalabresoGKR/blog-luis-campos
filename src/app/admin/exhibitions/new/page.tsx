import { PageHeader } from "@/components/admin/PageHeader";
import { ExhibitionForm } from "@/components/admin/ExhibitionForm";
import { createExhibition } from "@/actions/exhibition";

export default function NewExhibitionPage() {
  return (
    <div>
      <PageHeader
        title="Nova Exposição"
        description="Regista uma exposição passada, em curso ou futura."
      />
      <div className="max-w-2xl bg-paper rounded-xl border border-line p-8">
        <ExhibitionForm action={createExhibition} submitLabel="Criar Exposição" />
      </div>
    </div>
  );
}
