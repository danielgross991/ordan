import { Suspense } from 'react'
import Link from 'next/link'
import { getPublishedSuppliers } from '@/lib/db/suppliers'
import { getActiveCategories } from '@/lib/db/categories'
import { getActiveRegions } from '@/lib/db/regions'
import { SupplierCardComponent } from '@/components/public/SupplierCard'
import { FilterBar } from '@/components/public/FilterBar'
import { CategoryIcon } from '@/components/public/CategoryIcon'
import { QuickFilterChips } from '@/components/public/QuickFilterChips'
import type { SupplierFilters } from '@/lib/domain/supplier'
import type { Metadata } from 'next'

export const revalidate = 180

interface PageProps {
  searchParams: Promise<Record<string, string>>
}

function cleanParam(value: string | undefined, max = 120): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const query = cleanParam(params.q)
  const category = cleanParam(params.category)
  const title = query
    ? `${query} – ספקים | אורדן`
    : category
    ? `${category} | ספקים | אורדן`
    : 'כל הספקים | אורדן'
  return { title }
}

export default async function SuppliersPage({ searchParams }: PageProps) {
  const params = await searchParams

  const filters: SupplierFilters = {
    query: cleanParam(params.q),
    category: cleanParam(params.category),
    region: cleanParam(params.region),
    supplierType: cleanParam(params.supplierType),
    businessFit: cleanParam(params.businessFit),
  }

  const [suppliers, categories, regions] = await Promise.all([
    getPublishedSuppliers(filters),
    getActiveCategories(),
    getActiveRegions(),
  ])

  const activeFilterCount = [
    filters.category,
    filters.region,
    filters.supplierType,
    filters.businessFit,
  ].filter(Boolean).length

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 md:py-8">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="mb-5 md:mb-6">
        {/* Category context banner */}
        {filters.category ? (
          <div className="flex items-center gap-3 mb-4 bg-white rounded-2xl border border-[var(--border)] px-4 md:px-5 py-4 shadow-sm">
            <span className="text-[var(--accent)] flex-shrink-0">
              <CategoryIcon category={filters.category} className="w-8 h-8" />
            </span>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-[var(--foreground)] leading-tight">{filters.category}</h1>
              <p className="text-sm text-[var(--muted)]">
                {suppliers.length > 0
                  ? `${suppliers.length} ספקים בקטגוריה זו`
                  : 'לא נמצאו ספקים'}
                {activeFilterCount > 1 && ` · ${activeFilterCount - 1} פילטרים נוספים פעילים`}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-2 bg-white border border-[var(--border)] rounded-2xl px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[var(--foreground)] leading-tight">
                  {filters.query ? `תוצאות עבור "${filters.query}"` : 'כל הספקים'}
                </h1>
                <p className="text-sm text-[var(--muted)] mt-0.5">
                  {suppliers.length > 0
                    ? `${suppliers.length} ספקים נמצאו`
                    : 'לא נמצאו ספקים'}
                  {activeFilterCount > 0 && ` · ${activeFilterCount} פילטרים פעילים`}
                </p>
              </div>
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-bold !text-white transition-colors hover:bg-[var(--brand-dark)]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v15M15 6v15" />
                </svg>
                מעבר למפה
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Quick category chips (mobile only) ──────────────── */}
      <Suspense fallback={null}>
        <QuickFilterChips
          categories={categories.map(c => c.labelHe)}
          activeCategory={filters.category ?? ''}
        />
      </Suspense>

      <div className="mb-5 grid gap-2 rounded-2xl border border-[var(--border)] bg-white p-2 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="px-2 py-1">
          <div className="text-sm font-bold text-[var(--foreground)]">לא מצאת התאמה מדויקת?</div>
          <div className="text-xs text-[var(--muted)]">שלח צורך קצר ונחבר אותך לספקים רלוונטיים.</div>
        </div>
        <a
          href="mailto:hello@ordan.co.il?subject=בקשה לחיבור לספקים&body=שלום, אני מחפש ספק עבור:%0Aקטגוריה:%0Aאזור:%0Aכמות/צורך:%0Aטלפון לחזרה:"
          className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--brand-dark)]"
        >
          שלח בקשה
        </a>
      </div>

      <div className="flex flex-col md:flex-row gap-5 md:gap-6">
        {/* ── Sidebar / mobile filter bar ──────────────────── */}
        <aside className="w-full md:w-60 flex-shrink-0">
          <Suspense fallback={null}>
            <FilterBar categories={categories} regions={regions} />
          </Suspense>
        </aside>

        {/* ── Results ──────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {suppliers.length === 0 ? (
            <EmptyResults hasQuery={!!filters.query} hasFilters={activeFilterCount > 0} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
              {suppliers.map(s => (
                <SupplierCardComponent key={s.id} supplier={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyResults({
  hasQuery,
  hasFilters,
}: {
  hasQuery: boolean
  hasFilters: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-20 bg-white rounded-2xl md:rounded-3xl border border-[var(--border)] text-center px-6 shadow-sm">
      <div className="text-5xl mb-5">🔍</div>
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">לא נמצאו ספקים</h3>
      <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed">
        {hasQuery
          ? 'לא מצאנו ספקים התואמים לחיפוש שלך. נסה מילות חיפוש אחרות או הסר פילטרים.'
          : hasFilters
          ? 'לא נמצאו ספקים עם הפילטרים הנבחרים. נסה לשנות את הסינון.'
          : 'אין ספקים פעילים כרגע. נסה שוב מאוחר יותר.'}
      </p>
    </div>
  )
}
