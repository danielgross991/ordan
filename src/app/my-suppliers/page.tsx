import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { redirect } from 'next/navigation'
import { getFavoriteSuppliers } from '@/lib/db/favorites'
import { SupplierCardComponent } from '@/components/public/SupplierCard'
import Link from 'next/link'

export default async function MySupplersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) redirect('/login?callbackUrl=/my-suppliers')
  if (session.user.isAdmin) redirect('/admin')
  if (session.user.role === 'pending') redirect('/onboarding/role')

  const suppliers = await getFavoriteSuppliers(session.user.userId!)

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] mb-1">הספקים שלי</h1>
          <p className="text-sm text-[var(--muted)]">
            {suppliers.length > 0
              ? `${suppliers.length} ספקים שמורים`
              : 'ספקים שתשמור יופיעו כאן'}
          </p>
        </div>
        <Link
          href="/suppliers"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-[var(--brand)] text-white rounded-xl text-sm font-medium hover:bg-[var(--brand-dark)] transition-colors"
        >
          גלה ספקים
        </Link>
      </div>

      {suppliers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {suppliers.map(s => (
            <SupplierCardComponent key={s.id} supplier={s} />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 md:py-20 bg-[var(--surface)] rounded-2xl md:rounded-3xl border border-[var(--border)] px-5">
      <div className="text-5xl mb-5">🔖</div>
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
        עדיין לא שמרת ספקים
      </h3>
      <p className="text-sm text-[var(--muted)] max-w-xs mx-auto mb-6 leading-relaxed">
        לחץ על לב ❤️ בכל כרטיס ספק כדי לשמור אותו כאן לגישה מהירה
      </p>
      <Link
        href="/suppliers"
        className="inline-block px-6 py-3 bg-[var(--brand)] text-white rounded-xl font-medium text-sm hover:bg-[var(--brand-dark)] transition-colors"
      >
        גלה ספקים →
      </Link>
    </div>
  )
}
