import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { ArtworkForm } from "@/components/admin/ArtworkForm";
import { updateArtwork } from "@/actions/artwork";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArtworkPage({ params }: Props) {
  const { id } = await params;

  const artwork = await prisma.artwork.findUnique({
    where: { id },
    include: { featuredImage: { select: { url: true, alt: true } } },
  });

  if (!artwork) notFound();

  const action = updateArtwork.bind(null, id);

  return (
    <div>
      <PageHeader title="Editar Obra" description={artwork.title} />
      <div className="max-w-2xl bg-paper rounded-xl border border-line p-8">
        <ArtworkForm
          action={action}
          defaultValues={{
            title:           artwork.title,
            slug:            artwork.slug,
            year:            artwork.year,
            technique:       artwork.technique,
            dimensions:      artwork.dimensions,
            description:     artwork.description,
            status:          artwork.status,
            currentLocation: artwork.currentLocation,
            featuredImage:   artwork.featuredImage,
          }}
          submitLabel="Guardar Alterações"
        />
      </div>
    </div>
  );
}
