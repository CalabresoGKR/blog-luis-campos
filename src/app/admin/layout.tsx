import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";

// Camada de proteção no servidor (além do middleware): garante
// que nenhuma página de /admin renderiza sem sessão válida.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar role={session.user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={session.user} />
        <main className="mx-auto w-full max-w-6xl flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
