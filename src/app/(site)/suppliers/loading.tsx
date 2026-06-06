import { SupplierRailSkeleton } from '@/components/ui/Skeleton'

export default function SuppliersLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-5 md:py-8">
      <div className="mb-5 bg-white border border-[var(--border)] rounded-2xl px-4 py-4 shadow-sm">
        <div className="h-6 w-1/3 bg-[var(--surface)] rounded animate-pulse mb-2" />
        <div className="h-4 w-1/4 bg-[var(--surface)] rounded animate-pulse" />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <aside className="hidden md:block w-60 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[var(--border)] p-4 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 bg-[var(--surface)] rounded animate-pulse" />
                <div className="h-10 bg-[var(--surface)] rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <SupplierRailSkeleton count={6} />
        </div>
      </div>
    </div>
  )
}
