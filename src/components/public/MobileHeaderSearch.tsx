'use client'

import { useEffect, useState } from 'react'
import { SearchBar } from './SearchBar'

export function MobileHeaderSearch() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className={`p-2 rounded-lg transition-colors ${
          open
            ? 'bg-[var(--brand)] !text-white'
            : 'text-[var(--muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)]'
        }`}
        aria-label={open ? 'סגור חיפוש' : 'חיפוש'}
        aria-expanded={open}
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </button>

      <div
        className={`absolute inset-x-0 top-full overflow-hidden border-b border-[var(--border)] bg-white/95 shadow-sm backdrop-blur transition-[max-height,opacity,transform] duration-300 ease-out ${
          open ? 'max-h-24 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-6xl px-3 py-3">
          <SearchBar placeholder="חפש ספק, קטגוריה או מוצר..." autoFocus={open} />
        </div>
      </div>
    </div>
  )
}
