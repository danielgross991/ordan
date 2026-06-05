import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { redirect } from 'next/navigation'
import { getSupplierEventCounts } from '@/lib/db/events'
import { getSql } from '@/lib/db/client'
import Link from 'next/link'
import { normalizeImageUrl } from '@/lib/security/url'

export default async function SupplierDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) redirect('/login?callbackUrl=/dashboard')
  if (session.user.isAdmin) redirect('/admin')
  if (session.user.role === 'pending') redirect('/onboarding/role')
  if (session.user.role === 'buyer') redirect('/my-suppliers')

  // Find claimed supplier profile
  const claimedSupplier = await getClaimedSupplier(session.user.userId!)
  const counts = claimedSupplier ? await getSupplierEventCounts(claimedSupplier.id) : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-black text-[var(--foreground)] mb-1">הלוח שלי</h1>
        <p className="text-sm text-[var(--muted)]">ניהול הפרופיל שלך ומעקב אחרי עניין מסעדות</p>
      </div>

      {!claimedSupplier ? (
        <NoProfileLinked />
      ) : (
        <div className="space-y-6">
          {/* Profile card */}
          <div className="bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border)] shadow-sm p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {normalizeImageUrl(claimedSupplier.logoUrl) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={normalizeImageUrl(claimedSupplier.logoUrl) as string}
                  alt={claimedSupplier.businessName}
                  className="w-16 h-16 rounded-2xl object-contain bg-gray-50 border border-[var(--border)] p-1"
                />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-[var(--foreground)]">{claimedSupplier.businessName}</h2>
                <p className="text-sm text-[var(--muted)] mt-0.5">{claimedSupplier.primaryCategory}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link
                    href={`/suppliers/${claimedSupplier.slug}`}
                    target="_blank"
                    className="text-xs px-3 py-1.5 bg-[var(--brand-light)] text-[var(--brand)] rounded-lg font-medium hover:bg-[var(--brand)] hover:text-white transition-colors"
                  >
                    צפה בדף הציבורי ↗
                  </Link>
                  <span className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                    claimedSupplier.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {claimedSupplier.status === 'published' ? '✅ פעיל' : '📝 טיוטה'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement metrics */}
          {counts && (
            <div>
              <h3 className="font-semibold text-[var(--foreground)] mb-4">עניין ופעילות</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-3">
                <MetricCard icon="👁️" label="צפיות בפרופיל" value={counts.totalViews} />
                <MetricCard icon="📱" label="לחיצות טלפון" value={counts.totalPhoneClicks} />
                <MetricCard icon="💬" label="לחיצות WhatsApp" value={counts.totalWaClicks} />
                <MetricCard icon="🌐" label="לחיצות אתר" value={counts.totalWebsiteClicks} />
                <MetricCard icon="❤️" label="שמרו את הפרופיל" value={counts.totalSaves} />
                <MetricCard icon="🖱️" label="קליקי כרטיס" value={counts.totalCardClicks} />
              </div>
            </div>
          )}

          {/* Tip */}
          <div className="bg-[var(--accent-light)] rounded-2xl border border-[var(--accent)]/20 p-4 md:p-5">
            <p className="text-sm font-semibold text-[var(--accent-dark)] mb-1">💡 טיפ</p>
            <p className="text-sm text-[var(--text-body)] leading-relaxed">
              ספקים עם פרופיל מלא ולוגו מקבלים יותר צפיות. צור קשר עם צוות אורדן לעדכון הפרופיל שלך.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border)] shadow-sm p-3.5 md:p-4 text-center min-w-0">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl md:text-2xl font-black text-[var(--foreground)]">{value.toLocaleString('he-IL')}</div>
      <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
    </div>
  )
}

function NoProfileLinked() {
  return (
    <div className="bg-[var(--surface-elevated)] rounded-2xl md:rounded-3xl border border-[var(--border)] shadow-sm p-6 md:p-10 text-center">
      <div className="text-5xl mb-5">🏭</div>
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
        הפרופיל שלך עדיין לא מקושר
      </h3>
      <p className="text-sm text-[var(--muted)] max-w-sm mx-auto mb-6 leading-relaxed">
        צור קשר עם צוות אורדן כדי לקשר את חשבונך לפרופיל הספק שלך, או לפתוח פרופיל חדש.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/suppliers"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] rounded-xl text-sm font-medium hover:bg-[var(--brand-light)] transition-colors"
        >
          גלה ספקים
        </Link>
        <a
          href="mailto:hello@ordan.co.il"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-[var(--brand)] text-white rounded-xl text-sm font-medium hover:bg-[var(--brand-dark)] transition-colors"
        >
          צור קשר →
        </a>
      </div>
    </div>
  )
}

// Find the supplier claimed/linked to this user
async function getClaimedSupplier(userId: string) {
  const sql = getSql()
  if (!sql) return null
  try {
    const rows = await sql`
      SELECT s.id, s.slug, s.business_name, s.primary_category, s.logo_url, s.status
      FROM supplier_claims sc
      JOIN suppliers s ON s.id = sc.supplier_id
      WHERE sc.user_id = ${userId} AND sc.status = 'approved'
      LIMIT 1
    `
    if (!rows[0]) return null
    return {
      id: rows[0].id as string,
      slug: rows[0].slug as string,
      businessName: rows[0].business_name as string,
      primaryCategory: rows[0].primary_category as string,
      logoUrl: (rows[0].logo_url ?? null) as string | null,
      status: rows[0].status as string,
    }
  } catch {
    return null
  }
}
