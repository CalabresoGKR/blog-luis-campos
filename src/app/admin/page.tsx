import { FileText, Frame, CalendarRange, MapPin, ImageIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";

export default async function DashboardPage() {
  const [posts, artworks, exhibitions, pins, media] = await Promise.all([
    prisma.post.count(),
    prisma.artwork.count(),
    prisma.exhibition.count(),
    prisma.mapPin.count(),
    prisma.media.count(),
  ]);

  return (
    <div>
      <PageHeader
        title="Painel"
        description="Visão geral do conteúdo do site."
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Publicações" value={posts} icon={FileText} />
        <StatCard label="Obras" value={artworks} icon={Frame} />
        <StatCard label="Exposições" value={exhibitions} icon={CalendarRange} />
        <StatCard label="Pinpoints" value={pins} icon={MapPin} />
        <StatCard label="Ficheiros" value={media} icon={ImageIcon} />
      </div>
    </div>
  );
}
