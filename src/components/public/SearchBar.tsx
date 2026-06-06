'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { searchSuggestionsAction, type SearchSuggestions } from '@/actions/searchActions'

interface SearchBarProps {
  defaultValue?: string
  placeholder?: string
  size?: 'default' | 'large'
  autoFocus?: boolean
}

export function SearchBar({
  defaultValue = '',
  placeholder = 'חפש ספקים, קטגוריות, מוצרים...',
  size = 'default',
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({ suppliers: [], categories: [], regions: [] })
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isLarge = size === 'large'
  const trimmed = value.trim()
  const hasResults =
    suggestions.suppliers.length + suggestions.categories.length + suggestions.regions.length > 0

  // Debounced suggestions
  useEffect(() => {
    if (trimmed.length < 2) {
      setSuggestions({ suppliers: [], categories: [], regions: [] })
      return
    }
    const t = setTimeout(async () => {
      setLoading(true)
      const res = await searchSuggestionsAction(trimmed)
      setSuggestions(res)
      setLoading(false)
    }, 150)
    return () => clearTimeout(t)
  }, [trimmed])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (trimmed) params.set('q', trimmed)
    setOpen(false)
    router.push(`/suppliers?${params.toString()}`)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full" role="search">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="search"
            autoFocus={autoFocus}
            value={value}
            onChange={e => { setValue(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            aria-label="חיפוש ספקים, קטגוריות ואזורים"
            aria-autocomplete="list"
            aria-expanded={open && (hasResults || loading)}
            aria-controls="search-suggestions"
            className={`w-full bg-white border border-[var(--border)] rounded-2xl pe-4 ps-12 text-right
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent
              placeholder:text-[var(--muted-light)] text-[var(--text-body)]
              transition-shadow
              ${isLarge
                ? 'py-4 text-base shadow-[var(--shadow-soft)] focus:shadow-lg'
                : 'py-2.5 text-base md:text-sm shadow-sm'
              }
            `}
          />
          <button
            type="submit"
            className={`absolute start-2 flex items-center justify-center text-white rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-dark)] transition-colors
              ${isLarge ? 'w-10 h-10' : 'w-8 h-8'}
            `}
            aria-label="חפש"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {open && trimmed.length >= 2 && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute z-50 top-full mt-2 inset-x-0 bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-soft)] overflow-hidden max-h-[70vh] overflow-y-auto"
        >
          {loading && (
            <div className="px-4 py-3 text-sm text-[var(--muted)]">מחפש...</div>
          )}
          {!loading && !hasResults && (
            <div className="px-4 py-4 text-sm text-[var(--muted)] text-center">
              לא נמצאו תוצאות עבור &quot;{trimmed}&quot;
            </div>
          )}
          {suggestions.suppliers.length > 0 && (
            <SuggestionGroup label="ספקים">
              {suggestions.suppliers.map(s => (
                <SuggestionItem
                  key={s.id}
                  href={`/suppliers/${s.slug}`}
                  onSelect={() => setOpen(false)}
                  primary={s.name}
                  secondary={s.category}
                  icon="🏢"
                />
              ))}
            </SuggestionGroup>
          )}
          {suggestions.categories.length > 0 && (
            <SuggestionGroup label="קטגוריות">
              {suggestions.categories.map(c => (
                <SuggestionItem
                  key={c.slug}
                  href={`/suppliers?category=${encodeURIComponent(c.label)}`}
                  onSelect={() => setOpen(false)}
                  primary={c.label}
                  icon="📂"
                />
              ))}
            </SuggestionGroup>
          )}
          {suggestions.regions.length > 0 && (
            <SuggestionGroup label="אזורים">
              {suggestions.regions.map(r => (
                <SuggestionItem
                  key={r.slug}
                  href={`/suppliers?region=${encodeURIComponent(r.label)}`}
                  onSelect={() => setOpen(false)}
                  primary={r.label}
                  icon="📍"
                />
              ))}
            </SuggestionGroup>
          )}
        </div>
      )}
    </div>
  )
}

function SuggestionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--muted)] bg-[var(--surface)]">
        {label}
      </div>
      <div>{children}</div>
    </div>
  )
}

function SuggestionItem({
  href,
  onSelect,
  primary,
  secondary,
  icon,
}: {
  href: string
  onSelect: () => void
  primary: string
  secondary?: string
  icon: string
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      role="option"
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--brand-light)] transition-colors text-right"
    >
      <span className="text-lg flex-shrink-0">{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-[var(--foreground)] truncate">{primary}</span>
        {secondary && (
          <span className="block text-xs text-[var(--muted)] truncate">{secondary}</span>
        )}
      </span>
    </Link>
  )
}
