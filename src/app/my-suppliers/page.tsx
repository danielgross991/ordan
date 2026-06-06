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

  const userName = session.user.name?.split(' ')[0] ?? ''

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-[var(--foreground)] mb-1">
          {userName ? `שלום ${userName}` : 'הלוח שלי'}
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {suppliers.length > 0
            ? `${suppliers.length} ספקים שמורים בלוח שלך`
            : 'נהל את הספקים האהובים והפעולות שלך במקום אחד'}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <QuickAction href="/suppliers" icon="🔍" label="גלה ספקים" />
        <QuickAction href="/map" icon="🗺️" label="מפת אזורים" />
        <QuickAction href="/suppliers?featured=true" icon="✦" label="מובחרים" />
        <QuickAction href="mailto:hello@ordan.co.il" icon="✉️" label="צור קשר" />
      </div>

      {/* Favorites section */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)]">
            ספקים שמורים
          </h2>
          {suppliers.length > 0 && (
            <Link href="/suppliers" className="text-sm text-[var(--accent)] font-medium hover:text-[var(--accent-dark)]">
              גלה עוד →
            </Link>
          )}
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
      </section>
    </div>
  )
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 bg-white border border-[var(--border)] rounded-2xl px-3 py-3 shadow-sm hover:border-[var(--accent)] hover:shadow-[var(--shadow-soft)] active:scale-95 transition-all min-h-[56px]"
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      <span className="text-sm font-semibold text-[var(--foreground)] truncate">{label}</span>
    </Link>
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
