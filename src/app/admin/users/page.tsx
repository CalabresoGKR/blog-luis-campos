import Link from "next/link";
import { Plus, Pencil, ShieldCheck, UserCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";

interface Props {
  searchParams: Promise<{ created?: string; saved?: string; error?: string }>;
}

export default async function UsersAdminPage({ searchParams }: Props) {
  const { created, saved, error } = await searchParams;
  const session = await auth();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div>
      <PageHeader
        title="Utilizadores"
        description={`${users.length} conta${users.length !== 1 ? "s" : ""}`}
        action={
          <Link href="/admin/users/new"
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90 transition-colors">
            <Plus className="h-4 w-4" /> Novo Utilizador
          </Link>
        }
      />

      {(created || saved) && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm text-emerald-700">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          {created ? "Utilizador criado com sucesso." : "Alterações guardadas."}
        </div>
      )}
      {error === "self" && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          Não podes apagar a tua própria conta.
        </div>
      )}

      <div className="rounded-2xl border border-line bg-paper overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-canvas">
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted/60">Utilizador</th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted/60 hidden sm:table-cell">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted/60 w-28">Função</th>
              <th className="px-5 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((user) => {
              const isSelf = session?.user?.id === user.id;
              return (
                <tr key={user.id} className="hover:bg-canvas/60 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-canvas border border-line flex items-center justify-center flex-shrink-0">
                        <UserCircle className="h-4 w-4 text-muted/50" />
                      </div>
                      <div>
                        <p className="font-medium text-ink text-sm">
                          {user.name}
                          {isSelf && <span className="ml-2 text-[10px] text-muted/50">(tu)</span>}
                        </p>
                        <p className="text-xs text-muted sm:hidden">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted hidden sm:table-cell">{user.email}</td>
                  <td className="px-5 py-4">
                    {user.role === "ADMIN" ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border bg-ink/5 text-ink border-ink/15">
                        <ShieldCheck className="h-3 w-3" /> Admin
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full border border-line text-muted">Editor</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/users/${user.id}/edit`}
                        className="p-2 rounded-lg hover:bg-canvas text-muted hover:text-ink transition-colors">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteUserButton id={user.id} isSelf={isSelf} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="border-t border-line px-5 py-4">
          <Link href="/admin/users/new" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors">
            <Plus className="h-4 w-4" /> Adicionar utilizador
          </Link>
        </div>
      </div>
    </div>
  );
}
