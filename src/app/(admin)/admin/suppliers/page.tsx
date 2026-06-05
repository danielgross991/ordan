import Link from 'next/link'
import { getAllSuppliersAdmin } from '@/lib/db/suppliers'
import { StatusBadge } from '@/components/ui/Badge'
import { getPublicReadiness } from '@/lib/domain/supplier'
import { AdminSupplierActions } from './AdminSupplierActions'
import type { SupplierStatus } from '@/lib/domain/supplier'

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default async function AdminSuppliersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const suppliers = await getAllSuppliersAdmin()
  const status = ['draft', 'published', 'hidden'].includes(params.status ?? '') ? (params.status as SupplierStatus) : ''
  const query = (params.q ?? '').trim().slice(0, 120).toLowerCase()

  const filtered = suppliers.filter(s => {
    if (status && s.status !== status) return false
    if (query) {
      return (
        s.businessName.toLowerCase().includes(query) ||
        s.primaryCategory.toLowerCase().includes(query) ||
        (s.city ?? '').toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">ספקים</h1>
        <Link
          href="/admin/suppliers/new"
          className="inline-flex items-center justify-center bg-[var(--brand)] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--brand-dark)] hover:shadow-md transition-all"
        >
          + הוסף ספק
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-3 md:p-4 flex flex-col sm:flex-row sm:flex-wrap gap-3">
        <form className="flex gap-2 flex-1 min-w-0 sm:min-w-48">
          <input
            name="q"
            defaultValue={query}
            placeholder="חפש ספקים..."
            className="flex-1 min-w-0 border border-[var(--border)] rounded-lg px-3 py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          />
          <button type="submit" className="bg-[var(--brand)] text-white px-3 py-2 rounded-lg text-sm">
            חפש
          </button>
        </form>
        <div className="flex gap-1 overflow-x-auto scrollbar-hide touch-scroll pb-1 sm:pb-0">
          {[
            { label: 'הכל', value: '' },
            { label: 'פעיל', value: 'published' },
            { label: 'טיוטה', value: 'draft' },
            { label: 'מוסתר', value: 'hidden' },
          ].map(opt => (
            <Link
              key={opt.value}
              href={opt.value ? `/admin/suppliers?status=${opt.value}` : '/admin/suppliers'}
              className={`flex-shrink-0 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-colors ${
                status === opt.value
                  ? 'bg-[var(--brand)] text-white'
                  : 'bg-[var(--surface)] text-[var(--text-body)] border border-[var(--border)] hover:bg-[var(--brand-light)] hover:text-[var(--brand)] hover:border-[var(--brand)]'
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center text-[var(--muted)]">
          <div className="text-4xl mb-3">🏪</div>
          <p className="font-medium">אין ספקים להצגה</p>
          {!query && !status && (
            <p className="text-sm mt-1">הוסף את הספק הראשון!</p>
          )}
        </div>
      ) : (
        <>
        <div className="md:hidden space-y-3">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-[var(--border)] p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <Link
                    href={`/admin/suppliers/${s.id}`}
                    className="block font-semibold text-gray-900 truncate"
                  >
                    {s.businessName}
                  </Link>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    {[s.primaryCategory, s.city].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <ReadinessBadge score={getPublicReadiness(s).score} />
                <AdminSupplierActions id={s.id} status={s.status} />
              </div>
            </div>
          ))}
          <div className="px-1 py-1 text-xs text-[var(--muted)]">
            ׳׳•׳¦׳’׳™׳ {filtered.length} ׳׳×׳•׳ך {suppliers.length} ׳¡׳₪׳§׳™׳
          </div>
        </div>

        <div className="hidden md:block bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-[var(--border)] text-right">
                <th className="px-4 py-3 font-semibold text-gray-600">שם עסק</th>
                <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">קטגוריה</th>
                <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">עיר</th>
                <th className="px-4 py-3 font-semibold text-gray-600">סטטוס</th>
                <th className="px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">מוכנות</th>
                <th className="px-4 py-3 font-semibold text-gray-600">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-[var(--background)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{s.businessName}</div>
                    {s.supplierType && (
                      <div className="text-xs text-[var(--muted)]">{s.supplierType}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{s.primaryCategory}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{s.city ?? '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                    {s.featured && (
                      <span className="mr-1 text-xs text-amber-600">⭐</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <ReadinessBadge score={getPublicReadiness(s).score} />
                  </td>
                  <td className="px-4 py-3">
                    <AdminSupplierActions id={s.id} status={s.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 bg-gray-50 border-t border-[var(--border)] text-xs text-[var(--muted)]">
            מוצגים {filtered.length} מתוך {suppliers.length} ספקים
          </div>
        </div>
        </>
      )}
    </div>
  )
}

function ReadinessBadge({ score }: { score: number }) {
  const color =
    score >= 100
      ? 'bg-green-100 text-green-700'
      : score >= 50
      ? 'bg-amber-50 text-amber-700'
      : 'bg-red-50 text-red-600'
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {score}%{score === 100 ? ' ✓' : ''}
    </span>
  )
}
