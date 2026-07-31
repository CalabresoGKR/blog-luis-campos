import type { Role } from "@prisma/client";

// ── Matriz de permissões ──────────────────────────────────────
// Estrutura preparada para crescer: basta acrescentar papéis e
// capacidades. Cada papel herda um conjunto de capacidades.

export type Capability =
  | "posts.manage"
  | "artworks.manage"
  | "exhibitions.manage"
  | "map.manage"
  | "media.manage"
  | "pages.manage"
  | "contacts.manage"
  | "users.manage";

const ROLE_CAPABILITIES: Record<Role, Capability[]> = {
  ADMIN: [
    "posts.manage",
    "artworks.manage",
    "exhibitions.manage",
    "map.manage",
    "media.manage",
    "pages.manage",
    "contacts.manage",
    "users.manage",
  ],
  EDITOR: [
    "posts.manage",
    "artworks.manage",
    "exhibitions.manage",
    "map.manage",
    "media.manage",
  ],
};

export function can(role: Role | undefined, capability: Capability): boolean {
  if (!role) return false;
  return ROLE_CAPABILITIES[role]?.includes(capability) ?? false;
}
