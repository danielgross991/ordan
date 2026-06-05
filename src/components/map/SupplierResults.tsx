import type { DeliveryRegion, Supplier } from '@/lib/map/supplierTypes'
import { EmptyState } from './EmptyState'
import { SupplierCard } from './SupplierCard'

interface SupplierResultsProps {
  selectedRegion: DeliveryRegion | null
  suppliers: Supplier[]
  hasFilters: boolean
  selectedByLocation: boolean
}

export function SupplierResults({ selectedRegion, suppliers, hasFilters, selectedByLocation }: SupplierResultsProps) {
  if (!selectedRegion) {
    return <EmptyState title="בחרו אזור במפה כדי לראות ספקים שמספקים אליו" />
  }

  if (suppliers.length === 0) {
    return (
      <EmptyState
        title={hasFilters ? 'לא נמצאו ספקים שתואמים לסינון שבחרתם' : 'כרגע לא נמצאו ספקים שמספקים לאזור זה'}
        description={hasFilters ? 'אפשר לנקות חיפוש או לבחור קטגוריה אחרת.' : 'נסו לבחור אזור סמוך או לחפש לפי קטגוריה אחרת.'}
      />
    )
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-2xl font-black text-[var(--foreground)]">
          {selectedByLocation ? 'ספקים שמספקים לאזור שלך' : `ספקים שמספקים לאזור ${selectedRegion.nameHebrew}`}
        </h2>
        <p className="text-sm text-[var(--muted)]">{suppliers.length} ספקים רלוונטיים לפי אזור החלוקה שבחרת.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {suppliers.map(supplier => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </section>
  )
}
