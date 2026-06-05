'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Supplier } from '@/lib/map/supplierTypes'
import { normalizeImageUrl } from '@/lib/security/url'

interface SupplierCardProps {
  supplier: Supplier
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const router = useRouter()
  const profileHref = `/suppliers/${supplier.slug}`
  const logoUrl = normalizeImageUrl(supplier.logoUrl)

  function openProfile() {
    router.push(profileHref)
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openProfile}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openProfile()
        }
      }}
      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          {logoUrl ? (
            <Image src={logoUrl} alt={supplier.name} fill className="object-contain p-1.5" sizes="48px" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-lg font-black text-[var(--brand)]">
              {supplier.name.slice(0, 1)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {supplier.isRecommended && (
              <span className="rounded-full bg-[var(--accent-light)] px-2 py-0.5 text-[11px] font-bold text-[var(--accent-dark)]">
                מומלץ
              </span>
            )}
            {supplier.isVerified && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                מאומת
              </span>
            )}
          </div>
          <h3 className="mt-1 truncate text-lg font-black text-[var(--foreground)] group-hover:text-[var(--brand)]">
            {supplier.name}
          </h3>
          <div className="mt-1 flex flex-wrap gap-1">
            {supplier.categories.slice(0, 3).map(category => (
              <span key={category} className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[11px] font-bold text-[var(--muted)]">
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 min-h-[44px] text-sm leading-relaxed text-[var(--muted)]">{supplier.description}</p>

      <div className="mt-4 space-y-2 rounded-2xl bg-[var(--surface)] p-3 text-xs text-[var(--muted)]">
        <div>
          <span className="font-bold text-[var(--foreground)]">אזורי חלוקה: </span>
          {supplier.cityCoverage.join(', ')}
        </div>
        <div>
          <span className="font-bold text-[var(--foreground)]">ימי אספקה: </span>
          {supplier.deliveryDays.join(', ')}
        </div>
        <div>
          <span className="font-bold text-[var(--foreground)]">מינימום הזמנה: </span>
          {supplier.minimumOrder ? `${supplier.minimumOrder.toLocaleString('he-IL')} ₪` : 'ללא מינימום'}
        </div>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
        <a
          href={supplier.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={event => event.stopPropagation()}
          className="inline-flex items-center justify-center rounded-xl bg-[var(--wa-green)] px-2 py-2.5 text-xs font-bold !text-white transition hover:bg-[var(--wa-green-dark)]"
        >
          WhatsApp
        </a>
        <a
          href={`tel:${supplier.phone.replace(/[^\d+]/g, '')}`}
          onClick={event => event.stopPropagation()}
          className="inline-flex items-center justify-center rounded-xl bg-[var(--phone-cta)] px-2 py-2.5 text-xs font-bold !text-white transition hover:bg-[var(--phone-cta-dark)]"
        >
          התקשר
        </a>
        <Link
          href={profileHref}
          onClick={event => event.stopPropagation()}
          className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-2 py-2.5 text-xs font-bold !text-white transition hover:bg-[var(--brand-dark)]"
        >
          מעבר לדף העסק
        </Link>
      </div>
    </article>
  )
}
