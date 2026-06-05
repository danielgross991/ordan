'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { SupplierCard } from '@/lib/domain/supplier'
import { SupplierLogo } from './SupplierLogo'

type DeliveryArea = {
  label: string
  x: number
  y: number
}

const DELIVERY_AREAS: DeliveryArea[] = [
  { label: 'צפון', x: 55, y: 15 },
  { label: 'חיפה והקריות', x: 43, y: 26 },
  { label: 'שרון', x: 42, y: 38 },
  { label: 'מרכז', x: 51, y: 49 },
  { label: 'תל אביב והסביבה', x: 35, y: 51 },
  { label: 'ירושלים והסביבה', x: 61, y: 61 },
  { label: 'שפלה', x: 40, y: 64 },
  { label: 'דרום', x: 49, y: 78 },
  { label: 'אילת והערבה', x: 51, y: 91 },
]

interface Props {
  suppliers: SupplierCard[]
}

export function SuppliersMap({ suppliers }: Props) {
  const [selectedArea, setSelectedArea] = useState('')

  const countsByArea = useMemo(() => {
    const counts = new Map<string, number>()
    suppliers.forEach(supplier => {
      getDeliveryAreas(supplier).forEach(area => {
        counts.set(area, (counts.get(area) ?? 0) + 1)
      })
    })
    return counts
  }, [suppliers])

  const visibleSuppliers = useMemo(() => {
    if (!selectedArea) return []
    return suppliers.filter(supplier => getDeliveryAreas(supplier).includes(selectedArea))
  }, [selectedArea, suppliers])

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-[var(--border)] bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--accent)]">מפת אזורי משלוח</p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-[var(--foreground)] md:text-3xl">
              בחר לאיזה אזור אתה נמצא
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
              הספקים שמופיעים לאחר הבחירה הם ספקים שמספקים משלוח או שירות לאזור שבחרת.
            </p>
          </div>
          {selectedArea && (
            <button
              type="button"
              onClick={() => setSelectedArea('')}
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold text-[var(--muted)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              נקה בחירה
            </button>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm">
        <div className="relative min-h-[520px] md:min-h-[640px]">
          <iframe
            title="מפת ישראל"
            src="https://maps.google.com/maps?hl=he&q=%D7%99%D7%A9%D7%A8%D7%90%D7%9C&z=7&t=m&output=embed"
            className="absolute inset-0 z-10 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,#dbe8ef_0%,#eff2e8_32%,#f5eadb_58%,#e6d5bc_100%)]" />
          <div className="absolute left-[12%] top-[42%] h-[18%] w-[24%] rounded-full bg-[#b5d6e6]/80 blur-xl" />
          <div className="absolute right-[12%] top-[8%] h-[22%] w-[32%] rounded-full bg-[#d5e3c2]/80 blur-xl" />
          <div className="absolute bottom-[8%] right-[18%] h-[28%] w-[28%] rounded-full bg-[#e8d4b7]/80 blur-xl" />
          <div className="absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(245,243,238,0.18))] pointer-events-none" />

          <div className="absolute right-3 top-3 left-3 z-30 rounded-3xl border border-white/80 bg-white/90 p-3 shadow-lg backdrop-blur md:right-5 md:left-auto md:w-[360px] md:p-4">
            <h2 className="text-base font-black text-[var(--foreground)]">בחר אזור משלוח</h2>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
              {DELIVERY_AREAS.map(area => {
                const selected = selectedArea === area.label
                const count = countsByArea.get(area.label) ?? 0
                return (
                  <button
                    key={area.label}
                    type="button"
                    onClick={() => setSelectedArea(area.label)}
                    className={`flex-shrink-0 rounded-2xl border px-3 py-2 text-right text-xs font-bold transition-colors ${
                      selected
                        ? 'border-[var(--brand)] bg-[var(--brand)] !text-white'
                        : 'border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--brand)] hover:bg-[var(--brand-light)]'
                    }`}
                  >
                    <span className="block">{area.label}</span>
                    <span className={`block text-[10px] ${selected ? 'text-white/80' : 'text-[var(--muted)]'}`}>
                      {count} ספקים
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {DELIVERY_AREAS.map(area => {
            const selected = selectedArea === area.label
            const count = countsByArea.get(area.label) ?? 0
            return (
              <button
                key={area.label}
                type="button"
                onClick={() => setSelectedArea(area.label)}
                className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-xs font-black shadow-lg transition-all ${
                  selected
                    ? 'border-[var(--brand)] bg-[var(--brand)] !text-white scale-110'
                    : 'border-white bg-white/95 text-[var(--foreground)] hover:border-[var(--brand)] hover:bg-[var(--brand-light)]'
                }`}
                style={{ left: `${area.x}%`, top: `${area.y}%` }}
              >
                <span>{area.label}</span>
                <span className={`ms-1 font-bold ${selected ? 'text-white/80' : 'text-[var(--muted)]'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-[var(--foreground)]">
              {selectedArea ? `ספקים שמגיעים לאזור ${selectedArea}` : 'בחר אזור כדי לראות ספקים'}
            </h2>
            <p className="text-xs text-[var(--muted)]">
              {selectedArea
                ? `${visibleSuppliers.length} ספקים מספקים לאזור הזה`
                : 'הבחירה מתבצעת לפי אזורי משלוח/שירות, לא לפי מיקום העסק.'}
            </p>
          </div>
          {selectedArea && (
            <Link
              href={`/suppliers?region=${encodeURIComponent(selectedArea)}`}
              className="hidden rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-bold !text-white md:inline-flex"
            >
              פתח כרשימה
            </Link>
          )}
        </div>

        {!selectedArea ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center">
            <p className="text-sm font-bold text-[var(--foreground)]">בחר אזור מהמפה או מהרשימה למעלה.</p>
          </div>
        ) : visibleSuppliers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-center">
            <p className="text-sm font-bold text-[var(--foreground)]">אין ספקים שמספקים לאזור הזה כרגע</p>
            <Link href="/suppliers" className="mt-3 inline-flex rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-bold !text-white">
              לכל הספקים
            </Link>
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {visibleSuppliers.map(supplier => (
              <Link
                key={supplier.id}
                href={`/suppliers/${encodeURIComponent(supplier.slug)}`}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-3 transition-colors hover:border-[var(--brand)] hover:bg-[var(--brand-light)]"
              >
                <SupplierLogo
                  logoUrl={supplier.logoUrl}
                  businessName={supplier.businessName}
                  categoryIcon="•"
                  size={42}
                  className="h-11 w-11 flex-shrink-0 rounded-xl"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-black text-[var(--foreground)]">{supplier.businessName}</div>
                  <div className="truncate text-xs text-[var(--muted)]">
                    {[supplier.primaryCategory, deliverySummary(supplier)].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <span className="rounded-xl bg-[var(--brand)] px-3 py-2 text-xs font-bold !text-white">
                  פרופיל
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function getDeliveryAreas(supplier: SupplierCard): string[] {
  const areas = supplier.serviceAreas.length > 0 ? supplier.serviceAreas : [supplier.region ?? '']
  return Array.from(new Set(areas.map(normalizeArea).filter(Boolean)))
}

function normalizeArea(area: string): string {
  const value = area.trim()
  if (!value) return ''
  const match = DELIVERY_AREAS.find(item => {
    const label = item.label
    return value === label || value.includes(label) || label.includes(value)
  })
  return match?.label ?? value
}

function deliverySummary(supplier: SupplierCard): string {
  const areas = getDeliveryAreas(supplier)
  if (areas.length === 0) return ''
  if (areas.length === 1) return `משלוח ל${areas[0]}`
  return `משלוח ל-${areas.length} אזורים`
}
