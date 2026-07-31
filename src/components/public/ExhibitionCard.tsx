import Image from "next/image";
import Link from "next/link";

interface ExhibitionCardProps {
  slug: string;
  title: string;
  venue?: string | null;
  city?: string | null;
  country?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  isPast?: boolean;
}

function formatExhibitionDate(start?: Date | null, end?: Date | null) {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(d));
  if (start && end) return `${fmt(start)} — ${fmt(end)}`;
  if (start) return `A partir de ${fmt(start)}`;
  return null;
}

export function ExhibitionCard({
  slug,
  title,
  venue,
  city,
  country,
  startDate,
  endDate,
  imageUrl,
  imageAlt,
  isPast,
}: ExhibitionCardProps) {
  const dateStr = formatExhibitionDate(startDate, endDate);
  const location = [venue, city, country].filter(Boolean).join(", ");

  return (
    <Link
      href={`/exposicoes/${slug}`}
      className="group flex gap-6 items-start py-7 border-b border-line"
    >
      {/* Thumbnail */}
      <div className="relative w-24 h-16 sm:w-32 sm:h-20 flex-shrink-0 overflow-hidden bg-canvas">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            sizes="140px"
          />
        ) : (
          <div className="absolute inset-0 bg-line" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {isPast !== undefined && (
          <span
            className={`type-label mb-2 block ${
              isPast ? "text-muted/50" : "text-accent"
            }`}
          >
            {isPast ? "Anterior" : "Em Curso"}
          </span>
        )}
        <h3 className="type-exhibition-title text-ink group-hover:text-accent transition-colors duration-200 line-clamp-2">
          {title}
        </h3>
        {location && (
          <p className="type-card-meta text-muted mt-1.5">{location}</p>
        )}
        {dateStr && (
          <p className="type-caption text-muted/55 mt-1">{dateStr}</p>
        )}
      </div>

      <span className="hidden sm:block type-body text-muted/25 group-hover:text-accent transition-colors duration-200 mt-0.5 flex-shrink-0">
        →
      </span>
    </Link>
  );
}
