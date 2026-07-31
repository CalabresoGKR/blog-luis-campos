export function ArtworkSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-line rounded" />
      <div className="mt-4 space-y-2">
        <div className="h-5 bg-line rounded w-3/4" />
        <div className="h-4 bg-line rounded w-1/2" />
      </div>
    </div>
  );
}

export function BlogSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[16/10] bg-line rounded mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-line rounded w-1/4" />
        <div className="h-5 bg-line rounded w-5/6" />
        <div className="h-4 bg-line rounded w-full" />
        <div className="h-4 bg-line rounded w-2/3" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-8 py-20 px-6 max-w-4xl mx-auto">
      <div className="h-10 bg-line rounded w-1/3 mx-auto" />
      <div className="space-y-3">
        <div className="h-4 bg-line rounded" />
        <div className="h-4 bg-line rounded w-5/6" />
        <div className="h-4 bg-line rounded w-4/6" />
      </div>
    </div>
  );
}
