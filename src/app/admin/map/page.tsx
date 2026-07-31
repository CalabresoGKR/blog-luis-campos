import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function MapPage() {
  return (
    <ModulePlaceholder
      title="Mapa"
      description="Gere os pinpoints e a sua localização no mapa."
      features={[
        "Adicionar / editar / remover pinpoints",
        "Definir localização no mapa",
        "Associar uma obra",
        "Imagem e descrição",
        "Cidade, país e data da exposição",
      ]}
    />
  );
}
