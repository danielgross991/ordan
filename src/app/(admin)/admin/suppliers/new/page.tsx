import Link from 'next/link'
import { SupplierForm } from '@/components/admin/SupplierForm'
import { getActiveCategories } from '@/lib/db/categories'
import { getActiveRegions } from '@/lib/db/regions'

export default async function NewSupplierPage() {
  const [categories, regions] = await Promise.all([
    getActiveCategories(),
    getActiveRegions(),
  ])

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/suppliers" className="text-[var(--muted)] hover:text-gray-700 text-sm">
          ← חזרה לספקים
        </Link>
        <span className="text-[var(--muted)]">/</span>
        <h1 className="text-xl font-bold">הוספת ספק חדש</h1>
      </div>
      <SupplierForm categories={categories} regions={regions} mode="create" />
    </div>
  )
}
