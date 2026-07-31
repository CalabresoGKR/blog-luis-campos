import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: Date | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  authorName?: string | null;
  categories?: Array<{ name: string; slug: string }>;
  variant?: "default" | "featured";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function BlogCard({
  slug,
  title,
  excerpt,
  publishedAt,
  imageUrl,
  imageAlt,
  authorName,
  categories,
  variant = "default",
}: BlogCardProps) {

  if (variant === "featured") {
    return (
      <Link href={`/blog/${slug}`} className="group grid md:grid-cols-2 gap-0 overflow-hidden">
        <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-canvas">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt ?? title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-line" />
          )}
        </div>
        <div className="flex flex-col justify-center p-8 lg:p-12 bg-canvas">
          {categories && categories.length > 0 && (
            <span className="type-overline text-accent mb-5">{categories[0].name}</span>
          )}
          <h3 className="type-h3 text-ink group-hover:text-accent transition-colors duration-200 mb-5">
            {title}
          </h3>
          {excerpt && (
            <p className="type-body-sm text-muted line-clamp-3 mb-6">{excerpt}</p>
          )}
          <div className="flex items-center gap-3 type-card-meta text-muted/60">
            {publishedAt && <span>{formatDate(publishedAt)}</span>}
            {authorName && publishedAt && <span>·</span>}
            {authorName && <span>{authorName}</span>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden bg-canvas mb-5">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-line" />
        )}
      </div>
      <div className="space-y-2">
        {categories && categories.length > 0 && (
          <span className="type-overline text-accent">{categories[0].name}</span>
        )}
        <h3 className="type-artwork-title text-ink group-hover:text-accent transition-colors duration-200">
          {title}
        </h3>
        {excerpt && (
          <p className="type-body-sm text-muted line-clamp-2">{excerpt}</p>
        )}
        <div className="flex items-center gap-2 type-card-meta text-muted/55 pt-1">
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
          {authorName && publishedAt && <span>·</span>}
          {authorName && <span>{authorName}</span>}
        </div>
      </div>
    </Link>
  );
}
