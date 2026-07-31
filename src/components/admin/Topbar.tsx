import { LogOut } from "lucide-react";
import { logout } from "@/actions/auth";

type TopbarUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export function Topbar({ user }: { user: TopbarUser }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-line bg-paper px-6">
      <div className="font-display text-lg text-ink md:hidden">Atelier</div>

      <div className="ml-auto flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium leading-tight text-ink">
            {user.name ?? user.email}
          </p>
          {user.role && (
            <p className="text-xs capitalize text-muted">
              {user.role.toLowerCase()}
            </p>
          )}
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm text-ink/70 transition-colors hover:bg-canvas"
            aria-label="Terminar sessão"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </form>
      </div>
    </header>
  );
}
