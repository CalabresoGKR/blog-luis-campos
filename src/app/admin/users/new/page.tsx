import { PageHeader } from "@/components/admin/PageHeader";
import { UserForm } from "@/components/admin/UserForm";
import { createUser } from "@/actions/user";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewUserPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <div>
      <PageHeader title="Novo Utilizador" description="Cria uma conta de acesso ao painel." />
      <div className="max-w-lg bg-paper rounded-xl border border-line p-8">
        <UserForm action={createUser} submitLabel="Criar Utilizador" error={error} />
      </div>
    </div>
  );
}
