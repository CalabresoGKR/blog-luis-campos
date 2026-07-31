"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function Sidebar({ role }: { role?: Role }) {
  const pathname = usePathname();

  const visible = navItems.filter(
    (item) => item.capability === null || can(role, item.capability),
  );

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-paper md:flex">
      <div className="border-b border-line px-6 py-6">
        <span className="font-display text-xl text-ink">Atelier</span>
        <p className="mt-0.5 text-xs text-muted">Gestão de conteúdo</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {visible.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent-soft font-medium text-accent"
                  : "text-ink/70 hover:bg-canvas",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
