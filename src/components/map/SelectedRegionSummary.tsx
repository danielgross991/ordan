import type { DeliveryRegion } from '@/lib/map/supplierTypes'

interface SelectedRegionSummaryProps {
  selectedRegion: DeliveryRegion | null
  supplierCount: number
}

export function SelectedRegionSummary({ selectedRegion, supplierCount }: SelectedRegionSummaryProps) {
  if (!selectedRegion) return null

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold text-[var(--accent)]">האזור שנבחר</p>
          <h2 className="mt-1 text-xl font-black text-[var(--foreground)]">{selectedRegion.nameHebrew}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {selectedRegion.cities.join(', ')}
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--brand-light)] px-4 py-3 text-sm font-black text-[var(--brand)]">
          {supplierCount} ספקים זמינים
        </div>
      </div>
    </div>
  )
}
