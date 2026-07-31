import Image from "next/image";
import Link from "next/link";

interface ArtworkCardProps {
  slug: string;
  title: string;
  year?: number | null;
  technique?: string | null;
  dimensions?: string | null;
  status: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  size?: "default" | "large";
}

export function ArtworkCard({
  slug,
  title,
  year,
  technique,
  dimensions,
  status,
  imageUrl,
  imageAlt,
  size = "default",
}: ArtworkCardProps) {
  return (
    <Link
      href={`/obras/${slug}`}
      className="group block"
      aria-label={`Ver obra: ${title}`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-canvas ${
          size === "large" ? "aspect-[3/4]" : "aspect-[4/5]"
        }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-line">
            <span className="type-caption text-muted/40">Sem imagem</span>
          </div>
        )}

        {/* Exhibition badge */}
        {status === "ON_EXHIBITION" && (
          <div className="absolute top-3.5 left-3.5">
            <span className="type-label bg-accent text-paper px-3 py-1.5 rounded-full">
              Em Exposição
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/8 transition-colors duration-500" />
      </div>

      {/* Info */}
      <div className="mt-4 space-y-1.5">
        <h3 className="type-artwork-title text-ink group-hover:text-accent transition-colors duration-200">
          {title}
        </h3>
        <div className="flex items-center gap-2 type-card-meta text-muted">
          {year && <span>{year}</span>}
          {year && technique && <span className="text-line">·</span>}
          {technique && <span>{technique}</span>}
        </div>
        {dimensions && (
          <p className="type-caption text-muted/60">{dimensions}</p>
        )}
      </div>
    </Link>
  );
}
