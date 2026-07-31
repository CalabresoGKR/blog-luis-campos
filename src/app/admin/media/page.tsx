import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function MediaPage() {
  return (
    <ModulePlaceholder
      title="Ficheiros"
      description="Biblioteca central de imagens, PDFs e documentos."
      features={[
        "Upload de imagens e fotografias",
        "Upload de PDFs e catálogos",
        "Documentos diversos",
        "Reutilização em todos os módulos",
      ]}
    />
  );
}
