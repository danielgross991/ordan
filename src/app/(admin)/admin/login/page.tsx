'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { OrdanLogo } from '@/components/public/OrdanLogo'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })

    setLoading(false)
    if (result?.error) {
      setError('שם משתמש או סיסמה שגויים')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <OrdanLogo size="lg" />
          </div>
          <p className="text-sm text-[var(--muted)] mt-1">כניסה לממשק הניהול</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6 space-y-4"
        >
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">שם משתמש</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)] ltr-only"
              style={{ direction: 'ltr' }}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)] ltr-only"
              style={{ direction: 'ltr' }}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--brand)] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[var(--brand-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'מתחבר...' : 'כניסה'}
          </button>
        </form>
      </div>
    </div>
  )
}
