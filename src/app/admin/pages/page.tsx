import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function PagesPage() {
  return (
    <ModulePlaceholder
      title="Páginas"
      description="Edita o conteúdo das páginas Inicial e Sobre."
      features={[
        "Página inicial: obra/texto/imagem em destaque",
        "Destaques, notícias e exposições em destaque",
        "Sobre: biografia e percurso artístico",
        "Formação e influências",
        "Texto institucional",
        "Fotografia do artista",
      ]}
    />
  );
}
