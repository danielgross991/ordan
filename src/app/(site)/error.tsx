'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[site error]', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-[var(--border)] p-8 shadow-sm">
        <div className="text-5xl mb-4">😕</div>
        <h1 className="text-xl font-black text-[var(--foreground)] mb-2">משהו השתבש</h1>
        <p className="text-sm text-[var(--muted)] mb-6 leading-relaxed">
          התרחשה תקלה בטעינת הדף. ניתן לנסות שוב או לחזור לדף הבית.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--brand-dark)] min-h-[44px]"
          >
            נסה שוב
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] px-5 py-2.5 text-sm font-bold text-[var(--foreground)] transition-colors hover:bg-[var(--brand-light)] min-h-[44px]"
          >
            לדף הבית
          </Link>
        </div>
      </div>
    </div>
  )
}
