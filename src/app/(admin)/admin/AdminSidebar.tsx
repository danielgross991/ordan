'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: '📊 לוח בקרה', exact: true },
  { href: '/admin/suppliers', label: '🏪 ספקים' },
  { href: '/admin/users', label: '👥 משתמשים' },
  { href: '/admin/categories', label: '🗂 קטגוריות' },
  { href: '/admin/regions', label: '📍 אזורים' },
  { href: '/admin/import/csv', label: '📁 יבוא CSV' },
  { href: '/admin/import/url', label: '🔗 יבוא מ-URL' },
  { href: '/admin/reports', label: '⚠️ דיווחים' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-52 bg-white border-l border-[var(--border)] flex-shrink-0 hidden md:block">
      <div className="p-3 space-y-1 sticky top-14">
        {navItems.map(item => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--brand-light)] text-[var(--brand)]'
                  : 'text-gray-700 hover:bg-[var(--brand-light)] hover:text-[var(--brand)]'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
