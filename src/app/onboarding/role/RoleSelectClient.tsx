'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { selectRoleAction } from '@/actions/userActions'

const ROLES = [
  {
    id: 'buyer' as const,
    icon: '🍽️',
    title: 'עסק / מסעדה',
    description: 'מסעדה, בית קפה, מלון, קייטרינג, מוסד — מחפש ספקים',
    examples: ['מסעדה', 'בית קפה', 'מלון', 'קייטרינג', 'מאפייה'],
  },
  {
    id: 'supplier' as const,
    icon: '🏭',
    title: 'ספק / יצרן',
    description: 'מספק שירותים, מוצרים, ציוד, מזון לעסקי המסעדנות',
    examples: ['ספק מזון', 'ציוד מטבח', 'ניקיון', 'אריזות', 'בשר'],
  },
]

export function RoleSelectClient() {
  const [selected, setSelected] = useState<'buyer' | 'supplier' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { update } = useSession()

  const handleContinue = async () => {
    if (!selected) return
    setLoading(true)
    setError(null)

    try {
      const result = await selectRoleAction(selected)
      if (!result.success) {
        setError(result.error ?? 'שגיאה. נסה שוב.')
        setLoading(false)
        return
      }

      // Update session token with new role
      await update({ role: selected, onboardingComplete: false })

      router.push(selected === 'supplier' ? '/dashboard' : '/')
    } catch {
      setError('שגיאה. נסה שוב.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {ROLES.map(role => (
        <button
          key={role.id}
          onClick={() => setSelected(role.id)}
          className={`w-full text-right p-5 rounded-2xl border-2 transition-all duration-150 ${
            selected === role.id
              ? 'border-[var(--brand)] bg-[var(--brand-light)]'
              : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-mid)] hover:bg-[var(--brand-light)]/50'
          }`}
        >
          <div className="flex items-start gap-4">
            <span className="text-2xl flex-shrink-0 mt-0.5">{role.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[var(--foreground)]">{role.title}</span>
                {selected === role.id && (
                  <span className="text-[var(--brand)] flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--muted)] mt-1 leading-snug">{role.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {role.examples.map(ex => (
                  <span key={ex} className="text-[10px] px-2 py-0.5 bg-[var(--border)] text-[var(--text-body)] rounded-full">
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </button>
      ))}

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      <button
        onClick={handleContinue}
        disabled={!selected || loading}
        className="w-full py-3.5 bg-[var(--brand)] text-white rounded-2xl font-semibold text-sm hover:bg-[var(--brand-dark)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'שומר...' : 'המשך →'}
      </button>

      <p className="text-xs text-[var(--muted)] text-center">
        ניתן לשנות זאת מאוחר יותר בהגדרות
      </p>
    </div>
  )
}
