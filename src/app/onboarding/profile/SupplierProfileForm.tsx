'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { saveSupplierProfileAction, skipProfileAction } from '@/actions/profileActions'

export function SupplierProfileForm({ categories }: { categories: string[] }) {
  const router = useRouter()
  const { update } = useSession()
  const [businessName, setBusinessName] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggle(cat: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else if (next.size < 8) next.add(cat)
      return next
    })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selected.size === 0) { setError('בחר לפחות קטגוריה אחת'); return }
    setLoading(true)
    setError(null)
    const result = await saveSupplierProfileAction({
      businessName: businessName.trim(),
      categories: [...selected],
    })
    setLoading(false)
    if (!result.success) { setError(result.error); return }
    await update({ onboardingComplete: true })
    router.push('/dashboard')
    router.refresh()
  }

  async function onSkip() {
    setLoading(true)
    const result = await skipProfileAction()
    setLoading(false)
    if (!result.success) { setError(result.error); return }
    await update({ onboardingComplete: true })
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" dir="rtl">
      <div>
        <h1 className="text-xl font-black text-[var(--foreground)] mb-1">פרטי העסק שלך</h1>
        <p className="text-sm text-[var(--muted)]">כך נדע איזה לקוחות לחבר אליך</p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--foreground)]">
          שם העסק <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          placeholder="לדוגמה: ספקי הפלא"
          className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <label className="block text-sm font-semibold text-[var(--foreground)]">
            קטגוריות <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-[var(--muted)]">{selected.size}/8 נבחרו</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-xs text-[var(--muted)]">לא נמצאו קטגוריות במערכת.</p>
          ) : (
            categories.map(cat => {
              const isSelected = selected.has(cat)
              const isDisabled = !isSelected && selected.size >= 8
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggle(cat)}
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  className={`px-3 py-2 rounded-full text-sm font-semibold border transition-all min-h-[36px] ${
                    isSelected
                      ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                      : isDisabled
                        ? 'bg-[var(--surface)] text-[var(--muted-light)] border-[var(--border)] cursor-not-allowed'
                        : 'bg-white text-[var(--text-body)] border-[var(--border)] hover:border-[var(--brand)] hover:text-[var(--brand)]'
                  }`}
                >
                  {isSelected && '✓ '}{cat}
                </button>
              )
            })
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-col gap-2 pt-2">
        <button
          type="submit"
          disabled={loading || !businessName.trim() || selected.size === 0}
          className="w-full py-3.5 bg-[var(--brand)] text-white rounded-2xl font-bold text-sm hover:bg-[var(--brand-dark)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
        >
          {loading ? 'שומר...' : 'שמור והמשך'}
        </button>
        <button
          type="button"
          onClick={onSkip}
          disabled={loading}
          className="w-full py-2.5 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors min-h-[44px]"
        >
          דלג כרגע
        </button>
      </div>
    </form>
  )
}
