'use client'

import { signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { normalizeImageUrl } from '@/lib/security/url'

interface Props {
  name: string
  image: string | null
  role: string
}

export function UserMenu({ name, image, role }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
  const imageUrl = normalizeImageUrl(image)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--brand-light)] transition-colors"
        aria-label="תפריט משתמש"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={28}
            height={28}
            className="rounded-full w-7 h-7 object-cover"
            unoptimized
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[var(--brand)] text-white text-xs font-bold flex items-center justify-center">
            {initials || '?'}
          </div>
        )}
        <svg className={`w-3 h-3 text-[var(--muted)] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-52 bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border)] shadow-xl py-2 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="font-semibold text-sm text-[var(--foreground)] truncate">{name}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {role === 'buyer' ? 'עסק / מסעדה' : role === 'supplier' ? 'ספק' : 'משתמש'}
            </p>
          </div>

          {/* Links */}
          <div className="py-1">
            {role === 'buyer' && (
              <MenuLink href="/my-suppliers" onClick={() => setOpen(false)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                הספקים שלי
              </MenuLink>
            )}
            {role === 'supplier' && (
              <MenuLink href="/dashboard" onClick={() => setOpen(false)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                הלוח שלי
              </MenuLink>
            )}
            <MenuLink href="/suppliers" onClick={() => setOpen(false)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              כל הספקים
            </MenuLink>
          </div>

          {/* Sign out */}
          <div className="border-t border-[var(--border)] pt-1 mt-1">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              יציאה
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MenuLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-body)] hover:bg-[var(--brand-light)] hover:text-[var(--brand)] transition-colors"
    >
      {children}
    </Link>
  )
}
