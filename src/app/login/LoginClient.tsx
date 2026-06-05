'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

interface Props {
  callbackUrl?: string
  error?: string
}

export function LoginClient({ callbackUrl, error }: Props) {
  const [loading, setLoading] = useState(false)

  const handleGoogle = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl: callbackUrl ?? '/' })
  }

  const errorMessages: Record<string, string> = {
    OAuthSignin: 'שגיאה בהתחברות עם גוגל. נסה שוב.',
    OAuthCallback: 'שגיאה בחזרה מגוגל. נסה שוב.',
    OAuthCreateAccount: 'לא ניתן ליצור חשבון. נסה שוב.',
    Default: 'שגיאת כניסה. נסה שוב.',
  }

  const errorMessage = error ? (errorMessages[error] ?? errorMessages.Default) : null

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 text-center">
          {errorMessage}
        </div>
      )}

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white border border-[var(--border-strong)] rounded-2xl text-sm font-semibold text-[var(--foreground)] hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <GoogleIcon />
        )}
        {loading ? 'מתחבר...' : 'כניסה עם Google'}
      </button>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-xs text-[var(--muted)]">מהיר ומאובטח</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: '🔒', label: 'מאובטח' },
          { icon: '⚡', label: 'מהיר' },
          { icon: '🏪', label: 'לעסקים' },
        ].map(item => (
          <div key={item.label} className="bg-[var(--surface)] rounded-xl py-2.5 px-1">
            <div className="text-base mb-0.5">{item.icon}</div>
            <div className="text-[10px] font-medium text-[var(--muted)]">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
