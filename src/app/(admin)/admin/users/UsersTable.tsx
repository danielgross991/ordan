'use client'

import { useState, useTransition } from 'react'
import type { UserListRow } from '@/lib/db/users'
import { deleteUserAction, resetUserOnboardingAction } from '@/actions/adminUserActions'

const ROLE_LABEL: Record<string, string> = {
  pending: 'ממתין',
  buyer: 'לקוח',
  supplier: 'ספק',
}
const ROLE_COLOR: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  buyer: 'bg-blue-100 text-blue-700',
  supplier: 'bg-emerald-100 text-emerald-700',
}

export function UsersTable({ users }: { users: UserListRow[] }) {
  const [query, setQuery] = useState('')
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  const filtered = users.filter(u => {
    if (!query.trim()) return true
    const q = query.trim().toLowerCase()
    return (
      u.email.toLowerCase().includes(q) ||
      (u.name ?? '').toLowerCase().includes(q)
    )
  })

  function handleReset(user: UserListRow) {
    if (!confirm(`לאפס את ה-onboarding של ${user.email}? המשתמש יעבור שוב על הרישום בכניסה הבאה.`)) return
    startTransition(async () => {
      const result = await resetUserOnboardingAction(user.id)
      setMessage(result.success ? `✅ ${user.email} אופס` : `❌ ${result.error}`)
    })
  }

  function handleDelete(user: UserListRow) {
    if (!confirm(`למחוק את ${user.email} לחלוטין? פעולה זו לא הפיכה.`)) return
    if (!confirm('אישור אחרון: כל ההיסטוריה (favorites, profiles) תימחק. להמשיך?')) return
    startTransition(async () => {
      const result = await deleteUserAction(user.id)
      setMessage(result.success ? `✅ ${user.email} נמחק` : `❌ ${result.error}`)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="חיפוש לפי אימייל או שם..."
          className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        />
        <span className="text-sm text-[var(--muted)] self-center">
          {filtered.length} / {users.length}
        </span>
      </div>

      {message && (
        <div className="bg-[var(--brand-light)] border border-[var(--brand)] text-[var(--brand)] rounded-xl px-4 py-2.5 text-sm font-semibold">
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface)] text-[var(--muted)] text-xs uppercase">
              <tr>
                <th className="text-right px-4 py-3 font-semibold">משתמש</th>
                <th className="text-right px-4 py-3 font-semibold">תפקיד</th>
                <th className="text-right px-4 py-3 font-semibold hidden md:table-cell">Onboarding</th>
                <th className="text-right px-4 py-3 font-semibold hidden lg:table-cell">מועדפים</th>
                <th className="text-right px-4 py-3 font-semibold hidden lg:table-cell">נוצר</th>
                <th className="text-right px-4 py-3 font-semibold">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[var(--foreground)] truncate">{user.name ?? '—'}</div>
                    <div className="text-xs text-[var(--muted)] truncate">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLOR[user.role] ?? 'bg-gray-100 text-gray-700'}`}>
                      {ROLE_LABEL[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {user.onboardingComplete ? (
                      <span className="text-emerald-700 text-xs font-semibold">✓ הושלם</span>
                    ) : (
                      <span className="text-amber-700 text-xs font-semibold">⌛ בתהליך</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">{user.favoriteCount}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--muted)]">
                    {user.createdAt.toLocaleDateString('he-IL')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleReset(user)}
                        disabled={pending}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:border-[var(--brand)] disabled:opacity-50"
                      >
                        אפס
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        disabled={pending}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        מחק
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
