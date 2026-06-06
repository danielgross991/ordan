export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse bg-[var(--surface)] rounded-xl ${className}`}
    />
  )
}

export function SupplierCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-4 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-5/6 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

export function SupplierRailSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SupplierCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CategoryRailSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="w-[88px] h-[104px] flex-shrink-0 rounded-2xl" />
      ))}
    </div>
  )
}

export function SupplierPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-5 md:py-8 space-y-5">
      <Skeleton className="h-3 w-40 mb-4" />
      <Skeleton className="h-48 md:h-64 rounded-2xl" />
      <div className="bg-white rounded-2xl border border-[var(--border)] p-4 md:p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
