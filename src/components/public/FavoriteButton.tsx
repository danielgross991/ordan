'use client'

import { useState, useEffect, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { toggleFavoriteAction } from '@/actions/favoriteActions'
import Link from 'next/link'

// ── localStorage helpers (anonymous users) ───────────────────────────────────
const STORAGE_KEY = 'ordan_favorites'

function getLocalFavorites(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveLocalFavorites(favorites: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  supplierId: string
  /** Pre-loaded server-side favorite state (for logged-in users) */
  initialIsFavorite?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function FavoriteButton({
  supplierId,
  initialIsFavorite,
  size = 'sm',
  className = '',
}: Props) {
  const { data: session } = useSession()
  const isLoggedIn = !!(session?.user && !session.user.isAdmin)

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite ?? false)
  const [showLoginHint, setShowLoginHint] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Hydrate from localStorage for anonymous users
  useEffect(() => {
    if (!isLoggedIn && initialIsFavorite === undefined) {
      queueMicrotask(() => setIsFavorite(getLocalFavorites().has(supplierId)))
    }
  }, [supplierId, isLoggedIn, initialIsFavorite])

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      // Anonymous: use localStorage + show hint
      const favs = getLocalFavorites()
      if (favs.has(supplierId)) {
        favs.delete(supplierId)
      } else {
        favs.add(supplierId)
        setShowLoginHint(true)
        setTimeout(() => setShowLoginHint(false), 3000)
      }
      saveLocalFavorites(favs)
      setIsFavorite(favs.has(supplierId))
      return
    }

    // Logged-in: DB-backed
    startTransition(async () => {
      const result = await toggleFavoriteAction(supplierId)
      if (result.success) {
        setIsFavorite(result.isFavorite ?? false)
      }
    })
  }

  const iconSize = size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
  const btnSize = size === 'md' ? 'p-2' : 'p-1'

  return (
    <div className="relative">
      <button
        onClick={toggle}
        disabled={isPending}
        className={`flex-shrink-0 ${btnSize} rounded-full hover:bg-red-50 transition-colors group/fav disabled:opacity-60 ${className}`}
        aria-label={isFavorite ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
        title={isFavorite ? 'הסר מהמועדפים' : 'שמור לאחר כך'}
      >
        <svg
          className={`${iconSize} transition-all ${
            isFavorite
              ? 'text-red-500 fill-red-500'
              : 'text-[var(--muted-light)] fill-none group-hover/fav:text-red-400'
          }`}
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Login nudge for anonymous saves */}
      {showLoginHint && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-[var(--brand)] text-white text-xs rounded-xl px-3 py-2 shadow-lg text-center z-20 pointer-events-none">
          <Link
            href="/login"
            className="font-bold text-white underline pointer-events-auto"
            onClick={e => e.stopPropagation()}
          >
            כנס
          </Link>{' '}
          כדי לשמור לחשבון שלך
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--brand)]" />
        </div>
      )}
    </div>
  )
}
