import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { ExhibitionForm } from "@/components/admin/ExhibitionForm";
import { updateExhibition } from "@/actions/exhibition";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditExhibitionPage({ params }: Props) {
  const { id } = await params;

  const exhibition = await prisma.exhibition.findUnique({ where: { id } });
  if (!exhibition) notFound();

  const action = updateExhibition.bind(null, id);

  return (
    <div>
      <PageHeader title="Editar Exposição" description={exhibition.title} />
      <div className="max-w-2xl bg-paper rounded-xl border border-line p-8">
        <ExhibitionForm
          action={action}
          defaultValues={{
            title:       exhibition.title,
            slug:        exhibition.slug,
            venue:       exhibition.venue,
            city:        exhibition.city,
            country:     exhibition.country,
            description: exhibition.description,
            startDate:   exhibition.startDate,
            endDate:     exhibition.endDate,
          }}
          submitLabel="Guardar Alterações"
        />
      </div>
    </div>
  );
}
