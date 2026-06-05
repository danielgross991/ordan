'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

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
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (value.trim()) params.set('q', value.trim())
    router.push(`/suppliers?${params.toString()}`)
  }

  const isLarge = size === 'large'

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="search"
          autoFocus={autoFocus}
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
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
  )
}
