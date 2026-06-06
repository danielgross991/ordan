'use client'

import { useEffect, useState } from 'react'

interface Tab {
  id: string
  label: string
}

export function SupplierSectionTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState<string | null>(tabs[0]?.id ?? null)

  useEffect(() => {
    if (tabs.length === 0) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
    )
    for (const tab of tabs) {
      const el = document.getElementById(tab.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [tabs])

  const onClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const headerOffset = 110
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  if (tabs.length === 0) return null

  return (
    <div
      role="tablist"
      aria-label="ניווט בדף הספק"
      className="sticky top-[60px] z-30 -mx-4 mb-4 bg-white/95 backdrop-blur border-b border-[var(--border)] md:top-[64px]"
    >
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 px-4 py-2">
          {tabs.map(tab => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onClick(tab.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors min-h-[36px] ${
                  isActive
                    ? 'bg-[var(--brand)] text-white'
                    : 'text-[var(--muted)] hover:bg-[var(--brand-light)] hover:text-[var(--brand)]'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
