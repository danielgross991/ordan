'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { PlacesAutocomplete, type PlaceSelection } from '@/components/public/PlacesAutocomplete'
import { saveBuyerProfileAction, skipProfileAction } from '@/actions/profileActions'

export function BuyerProfileForm() {
  const router = useRouter()
  const { update } = useSession()
  const [businessName, setBusinessName] = useState('')
  const [place, setPlace] = useState<PlaceSelection | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await saveBuyerProfileAction({
      businessName: businessName.trim(),
      address: place?.address ?? '',
      placeId: place?.placeId ?? '',
      city: place?.city ?? '',
      region: '',
      lat: place?.lat ?? null,
      lng: place?.lng ?? null,
    })
    setLoading(false)
    if (!result.success) { setError(result.error); return }
    await update({ onboardingComplete: true })
    router.push('/')
    router.refresh()
  }

  async function onSkip() {
    setLoading(true)
    const result = await skipProfileAction()
    setLoading(false)
    if (!result.success) { setError(result.error); return }
    await update({ onboardingComplete: true })
    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" dir="rtl">
      <div>
        <h1 className="text-xl font-black text-[var(--foreground)] mb-1">פרטי המסעדה</h1>
        <p className="text-sm text-[var(--muted)]">נתאים את החוויה למיקום ולסוג העסק שלך</p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--foreground)]">
          שם המסעדה / בית העסק <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          placeholder="לדוגמה: מסעדת ג׳ויה"
          className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--foreground)]">
          כתובת
        </label>
        <PlacesAutocomplete
          onSelect={setPlace}
          placeholder="התחל להקליד עיר או כתובת..."
        />
        {place?.city && (
          <p className="text-xs text-[var(--accent)] font-medium">✓ זוהתה עיר: {place.city}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-col gap-2 pt-2">
        <button
          type="submit"
          disabled={loading || !businessName.trim()}
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
