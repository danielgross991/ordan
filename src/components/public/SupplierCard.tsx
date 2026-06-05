'use client'

import Link from 'next/link'
import type { SupplierCard } from '@/lib/domain/supplier'
import { telLink, waLink } from '@/lib/utils/formatters'
import { SupplierLogo } from './SupplierLogo'
import { FavoriteButton } from './FavoriteButton'

interface SupplierCardProps {
  supplier: SupplierCard
}

export function SupplierCardComponent({ supplier }: SupplierCardProps) {
  const callHref = telLink(supplier.phone)
  const waHref = waLink(supplier.whatsapp ?? supplier.phone)
  const hasSlug = !!supplier.slug?.trim()
  const isVerified = !!supplier.lastVerifiedAt
  const trustItems = [
    isVerified ? 'מאומת' : null,
    supplier.phone || supplier.whatsapp ? 'קשר ישיר' : null,
    supplier.city || supplier.region ? [supplier.city, supplier.region].filter(Boolean)[0] : null,
  ].filter(Boolean)

  const cardBody = (
    <div className="flex h-full flex-col p-4">
      {/* Header: Logo + Name + Favorite */}
      <div className="flex min-h-[72px] items-start gap-3 mb-3">
        <SupplierLogo
          logoUrl={supplier.logoUrl}
          businessName={supplier.businessName}
          categoryIcon={categoryEmoji(supplier.primaryCategory)}
          size={44}
          className="w-11 h-11 rounded-xl flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5 mb-1.5">
            <h3 className="font-bold text-[var(--foreground)] text-base leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-150">
              {supplier.businessName}
            </h3>
            <FavoriteButton supplierId={supplier.id} />
          </div>
          <div className="flex min-h-[24px] flex-wrap items-center gap-1">
            {supplier.supplierType && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--brand)] text-white font-semibold">
                {supplier.supplierType}
              </span>
            )}
            {supplier.featured && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent-dark)] font-semibold">
                ✦ מובחר
              </span>
            )}
            {isVerified && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium inline-flex items-center gap-0.5">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                מאומת
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {supplier.shortDescription && (
        <p className="min-h-[44px] text-sm text-[var(--muted)] mb-3 line-clamp-2 leading-relaxed">
          {supplier.shortDescription}
        </p>
      )}
      {!supplier.shortDescription && <div className="mb-3 min-h-[44px]" />}

      {/* Meta: location + category */}
      <div className="min-h-[20px] flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)] mb-1 min-w-0">
        {(supplier.city || supplier.region) && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 text-[var(--accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {[supplier.city, supplier.region].filter(Boolean).join(', ')}
          </span>
        )}
        {supplier.primaryCategory && (
          <span className="flex items-center gap-1 text-[var(--muted-light)]">
            <span className="text-[var(--border-strong)]">·</span>
            {supplier.primaryCategory}
          </span>
        )}
      </div>

      {/* Business fit tags */}
      {supplier.businessFit.length > 0 && (
        <div className="min-h-[54px] flex flex-wrap content-start gap-1 mt-2">
          {supplier.businessFit.slice(0, 3).map(fit => (
            <span
              key={fit}
              className="text-xs px-2.5 py-1 rounded-full bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]"
            >
              {fit}
            </span>
          ))}
          {supplier.businessFit.length > 3 && (
            <span className="text-xs text-[var(--muted-light)] py-0.5">
              +{supplier.businessFit.length - 3}
            </span>
          )}
        </div>
      )}
      {supplier.businessFit.length === 0 && <div className="mt-2 min-h-[54px]" />}

      {trustItems.length > 0 && (
        <div className="mt-auto flex min-h-[43px] flex-wrap content-start gap-1.5 border-t border-[var(--border)] pt-3">
          {trustItems.slice(0, 3).map(item => (
            <span
              key={item}
              className="inline-flex items-center rounded-full bg-[var(--brand)] px-2.5 py-1 text-[11px] font-semibold text-white"
            >
              {item}
            </span>
          ))}
        </div>
      )}
      {trustItems.length === 0 && <div className="mt-auto min-h-[43px] border-t border-[var(--border)] pt-3" />}
    </div>
  )

  return (
    <div className="h-full min-h-[356px] bg-white rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:border-[var(--accent)] transition-all duration-200 overflow-hidden group flex flex-col">
      {/* Card body */}
      <div className="flex-1">
        {hasSlug ? (
          <Link href={`/suppliers/${encodeURIComponent(supplier.slug)}`} className="block h-full">
            {cardBody}
          </Link>
        ) : (
          cardBody
        )}
      </div>

      {/* CTA buttons — filled, high-contrast */}
      {(hasSlug || callHref || waHref) && (
        <div className="px-3 pb-3 flex gap-2">
          {hasSlug && (
            <Link
              href={`/suppliers/${encodeURIComponent(supplier.slug)}`}
              onClick={e => e.stopPropagation()}
              className="flex-1 min-w-0 py-3 sm:py-2.5 bg-[var(--brand)] hover:bg-[var(--brand-dark)] active:scale-[0.97] !text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150 [&_*]:!text-white"
            >
              <span className="!text-white">פרופיל</span>
            </Link>
          )}
          {callHref && (
            <a
              href={callHref}
              onClick={e => e.stopPropagation()}
              className="flex-1 min-w-0 py-3 sm:py-2.5 bg-[var(--phone-cta)] hover:bg-[var(--phone-cta-dark)] active:scale-[0.97] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="hidden min-[380px]:inline">התקשר</span>
            </a>
          )}
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex-1 min-w-0 py-3 sm:py-2.5 bg-[var(--wa-green)] hover:bg-[var(--wa-green-dark)] active:scale-[0.97] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'מזון': '🥗',
    'ירקות ופירות': '🥦',
    'בשר ודגים': '🥩',
    'חד״פ ואריזות': '📦',
    'ציוד מטבח': '🍳',
    'ניקיון': '🧹',
    'שירותים לעסקים': '💼',
  }
  return map[category] ?? '🏪'
}
