'use client'

import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: '📊 לוח בקרה' },
  { href: '/admin/suppliers', label: '🏪 ספקים' },
  { href: '/admin/categories', label: '🗂 קטגוריות' },
  { href: '/admin/regions', label: '📍 אזורים' },
  { href: '/admin/import/csv', label: '📁 יבוא CSV' },
  { href: '/admin/import/url', label: '🔗 יבוא מ-URL' },
  { href: '/admin/reports', label: '⚠️ דיווחים' },
]

export function AdminMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="text-white p-2 -m-1 rounded hover:bg-white/10 transition-colors"
        aria-label="תפריט ניהול"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed top-14 right-3 left-3 z-50 bg-white rounded-xl shadow-xl border border-[var(--border)] py-2 max-h-[calc(100dvh-4.5rem)] overflow-y-auto">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--brand)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
