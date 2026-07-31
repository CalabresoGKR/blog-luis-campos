import Link from "next/link";
import { Plus, Pencil, Eye, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteExhibitionButton } from "@/components/admin/DeleteExhibitionButton";

function getYear(d: Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).getFullYear().toString();
}

function formatDate(d: Date | null | undefined) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" });
}

export default async function ExhibitionsAdminPage() {
  const exhibitions = await prisma.exhibition.findMany({
    orderBy: { startDate: "desc" },
  });

  const now = new Date();

  return (
    <div>
      <PageHeader
        title="Exposições"
        description={`${exhibitions.length} exposição${exhibitions.length !== 1 ? "ões" : ""}`}
        action={
          <Link
            href="/admin/exhibitions/new"
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Exposição
          </Link>
        }
      />

      {exhibitions.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-line bg-canvas p-20 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-paper border border-line">
            <Plus className="h-7 w-7 text-muted/40" />
          </div>
          <h3 className="font-display text-lg text-ink mb-2">Nenhuma exposição ainda</h3>
          <p className="text-sm text-muted mb-6 max-w-xs mx-auto">
            Adiciona a primeira exposição — aparece automaticamente em /exposicoes.
          </p>
          <Link
            href="/admin/exhibitions/new"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:bg-ink/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Exposição
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-paper overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted/60 w-16">Ano</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted/60">Título</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted/60 hidden md:table-cell">Local</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted/60 hidden lg:table-cell">Datas</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted/60 w-24">Estado</th>
                <th className="px-5 py-3 w-36"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {exhibitions.map((ex) => {
                const isPast    = ex.endDate && new Date(ex.endDate) < now;
                const isOngoing = !isPast && ex.startDate && new Date(ex.startDate) <= now;
                const isFuture  = !isPast && ex.startDate && new Date(ex.startDate) > now;

                return (
                  <tr key={ex.id} className="hover:bg-canvas/60 transition-colors group">
                    <td className="px-5 py-4 font-mono text-sm text-accent font-semibold">
                      {getYear(ex.startDate)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink leading-snug">{ex.title}</p>
                      {ex.city && (
                        <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {[ex.city, ex.country].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted hidden md:table-cell">
                      {ex.venue ?? <span className="text-muted/30">—</span>}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted hidden lg:table-cell">
                      {formatDate(ex.startDate) ?? "—"}
                      {ex.endDate && ex.endDate !== ex.startDate && (
                        <span className="text-muted/40"> → {formatDate(ex.endDate)}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {isPast ? (
                        <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-50 text-gray-500 border-gray-200">Passada</span>
                      ) : isOngoing ? (
                        <span className="text-xs px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">Em curso</span>
                      ) : isFuture ? (
                        <span className="text-xs px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">Futura</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full border border-line text-muted">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/exposicoes/${ex.slug}`}
                          target="_blank"
                          title="Ver no site"
                          className="p-2 rounded-lg hover:bg-canvas text-muted hover:text-ink transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/exhibitions/${ex.id}/edit`}
                          title="Editar"
                          className="p-2 rounded-lg hover:bg-canvas text-muted hover:text-ink transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <div className="[&_button]:p-2 [&_button]:rounded-lg [&_button]:!w-auto [&_button]:!py-2">
                          <DeleteExhibitionButton id={ex.id} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Rodapé — botão nova exposição */}
          <div className="border-t border-line px-5 py-4">
            <Link
              href="/admin/exhibitions/new"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
            >
              <Plus className="h-4 w-4" />
              Adicionar exposição
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
