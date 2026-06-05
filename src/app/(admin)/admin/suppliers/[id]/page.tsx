import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSupplierByIdAdmin } from '@/lib/db/suppliers'
import { getActiveCategories } from '@/lib/db/categories'
import { getActiveRegions } from '@/lib/db/regions'
import { SupplierForm } from '@/components/admin/SupplierForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditSupplierPage({ params }: PageProps) {
  const { id } = await params

  const [supplier, categories, regions] = await Promise.all([
    getSupplierByIdAdmin(id),
    getActiveCategories(),
    getActiveRegions(),
  ])

  if (!supplier) notFound()

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/suppliers" className="text-[var(--muted)] hover:text-gray-700 text-sm">
          ← חזרה לספקים
        </Link>
        <span className="text-[var(--muted)]">/</span>
        <h1 className="text-xl font-bold">עריכת ספק — {supplier.businessName}</h1>
      </div>

      {/* Quick status row */}
      <div className="flex items-center gap-3 mb-4 text-sm">
        <span className="text-[var(--muted)]">סטטוס נוכחי:</span>
        <span className={`font-medium ${supplier.status === 'published' ? 'text-green-700' : supplier.status === 'hidden' ? 'text-red-600' : 'text-amber-600'}`}>
          {supplier.status === 'published' ? '✅ פעיל' : supplier.status === 'hidden' ? '🙈 מוסתר' : '📝 טיוטה'}
        </span>
        {supplier.slug && (
          <Link
            href={`/suppliers/${supplier.slug}`}
            target="_blank"
            className="text-[var(--brand)] hover:underline"
          >
            צפה בדף ציבורי ↗
          </Link>
        )}
      </div>

      <SupplierForm supplier={supplier} categories={categories} regions={regions} mode="edit" />
    </div>
  )
}
