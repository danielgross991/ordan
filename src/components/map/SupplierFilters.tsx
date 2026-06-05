import type { Supplier, SupplierSort } from '@/lib/map/supplierTypes'

interface SupplierFiltersProps {
  suppliers: Supplier[]
  search: string
  category: string
  sort: SupplierSort
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSortChange: (value: SupplierSort) => void
}

export function SupplierFilters({
  suppliers,
  search,
  category,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: SupplierFiltersProps) {
  const categories = Array.from(new Set(suppliers.flatMap(supplier => supplier.categories))).sort((a, b) =>
    a.localeCompare(b, 'he')
  )

  return (
    <div className="grid gap-3 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-sm md:grid-cols-[1fr_220px_220px]">
      <label className="block">
        <span className="mb-1 block text-xs font-bold text-[var(--muted)]">חיפוש ספק</span>
        <input
          type="search"
          value={search}
          onChange={event => onSearchChange(event.target.value)}
          placeholder="שם ספק, קטגוריה או עיר..."
          className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-light)]"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-bold text-[var(--muted)]">קטגוריה</span>
        <select
          value={category}
          onChange={event => onCategoryChange(event.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-light)]"
        >
          <option value="">כל הקטגוריות</option>
          {categories.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-bold text-[var(--muted)]">מיון</span>
        <select
          value={sort}
          onChange={event => onSortChange(event.target.value as SupplierSort)}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-light)]"
        >
          <option value="recommended">מומלצים קודם</option>
          <option value="alphabetical">א-ב</option>
          <option value="minimumOrder">מינימום הזמנה נמוך קודם</option>
        </select>
      </label>
    </div>
  )
}
