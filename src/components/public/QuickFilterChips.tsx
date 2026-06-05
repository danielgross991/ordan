'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CategoryIcon } from './CategoryIcon'

interface Props {
  categories: string[]
  activeCategory: string
}

export function QuickFilterChips({ categories, activeCategory }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) {
      params.set('category', cat)
    } else {
      params.delete('category')
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="md:hidden -mx-4 px-4 mb-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide touch-scroll pb-1">
        <button
          onClick={() => setCategory('')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-95 ${
            !activeCategory
              ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-sm'
                : 'bg-white text-[var(--text-body)] border-[var(--border)] hover:border-[var(--brand)]'
          }`}
        >
          הכל
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-95 ${
              activeCategory === cat
                ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                : 'bg-white text-[var(--text-body)] border-[var(--border)] hover:border-[var(--accent)]'
            }`}
          >
            <span className="w-3.5 h-3.5 flex-shrink-0">
              <CategoryIcon category={cat} className="w-3.5 h-3.5" />
            </span>
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
