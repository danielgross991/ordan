'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import type { Category } from '@/lib/domain/category'
import type { Region } from '@/lib/domain/region'
import { SUPPLIER_TYPES, BUSINESS_FIT_OPTIONS } from '@/lib/domain/supplier'

interface FilterBarProps {
  categories: Category[]
  regions: Region[]
}

export function FilterBar({ categories, regions }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const clearAll = () => {
    const q = searchParams.get('q')
    router.push(`${pathname}${q ? `?q=${encodeURIComponent(q)}` : ''}`)
    setMobileOpen(false)
  }

  const activeFilters = ['category', 'region', 'supplierType', 'businessFit'].filter(k =>
    searchParams.get(k)
  )
  const hasActiveFilters = activeFilters.length > 0

  // Body scroll lock when sheet is open
  useEffect(() => {
    if (mobileOpen) {
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [mobileOpen])

  const filterSelects = (
    <div className="space-y-4 md:space-y-5">
      <FilterSection label="קטגוריה">
        <select
          value={searchParams.get('category') ?? ''}
          onChange={e => updateFilter('category', e.target.value)}
          className="filter-select"
        >
          <option value="">כל הקטגוריות</option>
          {categories.map(c => (
            <option key={c.id} value={c.labelHe}>
              {c.icon ? `${c.icon} ${c.labelHe}` : c.labelHe}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection label="אזור">
        <select
          value={searchParams.get('region') ?? ''}
          onChange={e => updateFilter('region', e.target.value)}
          className="filter-select"
        >
          <option value="">כל האזורים</option>
          {regions.map(r => (
            <option key={r.id} value={r.labelHe}>
              {r.labelHe}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection label="סוג ספק">
        <select
          value={searchParams.get('supplierType') ?? ''}
          onChange={e => updateFilter('supplierType', e.target.value)}
          className="filter-select"
        >
          <option value="">כל הסוגים</option>
          {SUPPLIER_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection label="מתאים ל–">
        <select
          value={searchParams.get('businessFit') ?? ''}
          onChange={e => updateFilter('businessFit', e.target.value)}
          className="filter-select"
        >
          <option value="">כל העסקים</option>
          {BUSINESS_FIT_OPTIONS.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* ── Mobile trigger row ───────────────────────────────── */}
      <div className="md:hidden mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--border)] rounded-xl text-sm font-semibold text-[var(--foreground)] shadow-sm hover:border-[var(--brand)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            סינון
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-[var(--accent)] text-white rounded-full">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Active filter chips */}
          <div className="flex gap-1.5 flex-1 min-w-0 overflow-x-auto scrollbar-hide touch-scroll pb-1">
            {activeFilters.map(key => {
              const val = searchParams.get(key)
              return (
                <button
                  key={key}
                  onClick={() => updateFilter(key, '')}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 bg-[var(--brand-light)] text-[var(--brand)] text-xs font-medium rounded-full border border-[var(--brand-light)] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  {val}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile bottom sheet ──────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className={`md:hidden fixed bottom-0 inset-x-0 z-50 bg-[var(--surface-elevated)] rounded-t-3xl shadow-2xl transition-transform duration-300 ${mobileOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
        aria-modal="true"
        role="dialog"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--border-strong)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
          <h3 className="font-bold text-base text-[var(--foreground)]">סינון ספקים</h3>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-sm text-[var(--accent)] hover:text-[var(--accent-dark)] font-medium transition-colors"
              >
                נקה הכל
              </button>
            )}
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl hover:bg-[var(--background)] text-[var(--muted)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[65dvh] px-5 py-5">
          {filterSelects}
        </div>

        {/* Footer CTA */}
        <div className="px-5 pt-3 border-t border-[var(--border)]">
          <button
            onClick={() => setMobileOpen(false)}
            className="w-full py-3.5 bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white rounded-xl text-sm font-bold transition-colors active:scale-[0.98]"
          >
            הצג תוצאות
          </button>
        </div>
      </div>

      {/* ── Desktop sidebar ──────────────────────────────────── */}
      <div className="hidden md:block bg-white rounded-2xl border border-[var(--border)] p-4 shadow-sm sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-[var(--foreground)]">סינון ספקים</h3>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-[var(--accent)] hover:text-[var(--accent-dark)] font-medium transition-colors"
            >
              נקה הכל
            </button>
          )}
        </div>
        {filterSelects}
      </div>
    </>
  )
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}
