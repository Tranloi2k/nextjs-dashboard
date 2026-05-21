export function ProductCardSkeleton() {
  return (
    <div className="shop-card overflow-hidden">
      <div className="aspect-[4/5] animate-pulse bg-shop-surface-muted" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded-sm bg-shop-surface-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded-sm bg-shop-surface-muted" />
        <div className="h-5 w-1/3 animate-pulse rounded-sm bg-shop-surface-muted" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        <div className="aspect-square rounded-shop-lg bg-shop-surface-muted" />
        <div className="mt-8 space-y-4 lg:mt-0">
          <div className="h-8 w-2/3 rounded-sm bg-shop-surface-muted" />
          <div className="h-4 w-1/3 rounded-sm bg-shop-surface-muted" />
          <div className="h-20 rounded-sm bg-shop-surface-muted" />
          <div className="h-12 rounded-shop bg-shop-surface-muted" />
        </div>
      </div>
    </div>
  );
}
