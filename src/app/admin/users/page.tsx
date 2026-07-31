import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function UsersPage() {
  return (
    <ModulePlaceholder
      title="Utilizadores"
      description="Gere as contas e os níveis de permissão (apenas Administradores)."
      features={[
        "Criar / editar / desativar contas",
        "Atribuir papéis (Administrador, Editor)",
        "Matriz de permissões extensível",
      ]}
    />
  );
}
