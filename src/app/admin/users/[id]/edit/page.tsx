import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { UserForm } from "@/components/admin/UserForm";
import { updateUser } from "@/actions/user";

interface Props {
  params:      Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditUserPage({ params, searchParams }: Props) {
  const { id }    = await params;
  const { error } = await searchParams;

  const user = await prisma.user.findUnique({
    where:  { id },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) notFound();

  const action = updateUser.bind(null, id);

  return (
    <div>
      <PageHeader title="Editar Utilizador" description={user.name} />
      <div className="max-w-lg bg-paper rounded-xl border border-line p-8">
        <UserForm
          action={action}
          defaultValues={{ name: user.name, email: user.email, role: user.role }}
          isEdit
          submitLabel="Guardar Alterações"
          error={error}
        />
      </div>
    </div>
  );
}
