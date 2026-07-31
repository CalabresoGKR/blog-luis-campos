import {
  LayoutDashboard,
  FileText,
  Frame,
  CalendarRange,
  MapPin,
  ImageIcon,
  FileEdit,
  Phone,
  Users,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import type { Capability } from "@/lib/permissions";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  capability: Capability | null;
};

export const navItems: NavItem[] = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard, capability: null },
  { href: "/admin/posts", label: "Blog", icon: FileText, capability: "posts.manage" },
  { href: "/admin/artworks", label: "Obras", icon: Frame, capability: "artworks.manage" },
  { href: "/admin/exhibitions", label: "Exposições", icon: CalendarRange, capability: "exhibitions.manage" },
  { href: "/admin/map", label: "Mapa", icon: MapPin, capability: "map.manage" },
  { href: "/admin/media", label: "Ficheiros", icon: ImageIcon, capability: "media.manage" },
  { href: "/admin/pages", label: "Páginas", icon: FileEdit, capability: "pages.manage" },
  { href: "/admin/contacts", label: "Contactos", icon: Phone, capability: "contacts.manage" },
  { href: "/admin/messages", label: "Mensagens", icon: Inbox, capability: "contacts.manage" },
  { href: "/admin/users", label: "Utilizadores", icon: Users, capability: "users.manage" },
];
