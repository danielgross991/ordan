import { listAllUsers } from '@/lib/db/users'
import { isDbConfigured } from '@/lib/db/client'
import { UsersTable } from './UsersTable'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = isDbConfigured() ? await listAllUsers() : []

  return (
    <div className="p-4 md:p-6" dir="rtl">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-[var(--foreground)]">משתמשים</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {users.length} משתמשים רשומים. ניתן לאפס onboarding או למחוק.
        </p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--border)] p-10 text-center">
          <p className="text-sm text-[var(--muted)]">אין משתמשים רשומים עדיין</p>
        </div>
      ) : (
        <UsersTable users={users} />
      )}
    </div>
  )
}
