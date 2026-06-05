'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { SupplierCard } from '@/lib/domain/supplier'
import { normalizeImageUrl } from '@/lib/security/url'

interface Props {
  suppliers: SupplierCard[]
}

export function LogoMarquee({ suppliers }: Props) {
  const [isPaused, setIsPaused] = useState(false)
  const logos = suppliers
    .map(s => ({ ...s, logoUrl: normalizeImageUrl(s.logoUrl) }))
    .filter(s => s.logoUrl)
  if (logos.length < 1) return null

  const displayLogos = logos.length >= 8
    ? logos
    : Array.from({ length: Math.ceil(8 / logos.length) }, () => logos).flat()
  const items = [...displayLogos, ...displayLogos]

  const pause = () => setIsPaused(true)
  const resume = () => setIsPaused(false)

  return (
    <section className="border-y border-[var(--border)] bg-white/55 py-7 md:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-4">
          <div>
            <p className="text-xs font-bold text-[var(--foreground)]">ספקים בפלטפורמה</p>
            <p className="text-xs text-[var(--muted)]">נע אוטומטית, אפשר לגרור כדי לשלוט</p>
          </div>
        </div>

        <div
          className="overflow-x-auto scroll-smooth scrollbar-hide touch-scroll"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onPointerDown={pause}
          onPointerUp={resume}
          onPointerCancel={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
        >
          <div className={`logo-rail-track flex w-max gap-3 pb-2 pt-1 ${isPaused ? 'is-paused' : ''}`}>
            {items.map((s, i) => (
              <div
                key={`${s.id}-${i}`}
                className="group flex h-24 w-24 flex-shrink-0 snap-start flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow-soft)] md:h-28 md:w-28"
                title={s.businessName}
              >
                <div className="flex h-12 w-12 items-center justify-center md:h-14 md:w-14">
                  <Image
                    src={s.logoUrl!}
                    alt={s.businessName}
                    width={56}
                    height={56}
                    className="h-full w-full object-contain"
                    unoptimized
                  />
                </div>
                <span className="mt-2 line-clamp-1 max-w-full text-center text-[11px] font-semibold text-[var(--muted)] group-hover:text-[var(--foreground)]">
                  {s.businessName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
