import Link from 'next/link'
import { getAllSuppliersAdmin } from '@/lib/db/suppliers'
import { getAllReportsAdmin } from '@/lib/db/reports'

export default async function AdminDashboard() {
  const [suppliers, reports] = await Promise.all([
    getAllSuppliersAdmin(),
    getAllReportsAdmin(),
  ])

  const published = suppliers.filter(s => s.status === 'published').length
  const drafts = suppliers.filter(s => s.status === 'draft').length
  const hidden = suppliers.filter(s => s.status === 'hidden').length
  const newReports = reports.filter(r => r.status === 'new').length

  return (
    <div className="max-w-4xl space-y-5 md:space-y-6">
      <h1 className="text-2xl font-bold">לוח בקרה</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          href="/admin/suppliers"
          label="ספקים פעילים"
          value={published}
          icon="✅"
          color="green"
        />
        <StatCard
          href="/admin/suppliers?status=draft"
          label="טיוטות"
          value={drafts}
          icon="📝"
          color="amber"
        />
        <StatCard
          href="/admin/suppliers?status=hidden"
          label="מוסתרים"
          value={hidden}
          icon="🙈"
          color="gray"
        />
        <StatCard
          href="/admin/reports"
          label="דיווחים חדשים"
          value={newReports}
          icon="⚠️"
          color={newReports > 0 ? 'red' : 'gray'}
        />
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-[var(--border)] p-4 md:p-5">
        <h2 className="font-semibold mb-4">פעולות מהירות</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
          <QuickAction href="/admin/suppliers/new" icon="➕" label="הוסף ספק" />
          <QuickAction href="/admin/import/csv" icon="📁" label="יבוא CSV" />
          <QuickAction href="/admin/import/url" icon="🔗" label="יבוא מ-URL" />
          <QuickAction href="/admin/reports" icon="⚠️" label="בדוק דיווחים" />
        </div>
      </div>

      {/* Recent suppliers */}
      {suppliers.length > 0 && (
        <div className="bg-white rounded-2xl border border-[var(--border)] p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">ספקים אחרונים</h2>
            <Link href="/admin/suppliers" className="text-sm text-[var(--brand)] hover:underline">כל הספקים →</Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {suppliers.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center justify-between gap-3 py-2.5 px-2 -mx-2 rounded-lg hover:bg-[var(--background)] transition-colors">
                <div className="min-w-0">
                  <Link
                    href={`/admin/suppliers/${s.id}`}
                    className="block text-sm font-medium text-gray-800 hover:text-[var(--brand)] truncate"
                  >
                    {s.businessName}
                  </Link>
                  <p className="text-xs text-[var(--muted)]">{s.primaryCategory}</p>
                </div>
                <StatusPill status={s.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  href,
  label,
  value,
  icon,
  color,
}: {
  href: string
  label: string
  value: number
  icon: string
  color: 'green' | 'amber' | 'red' | 'gray'
}) {
  const colors = {
    green: 'bg-green-50 border-green-100',
    amber: 'bg-amber-50 border-amber-100',
    red: 'bg-red-50 border-red-100',
    gray: 'bg-gray-50 border-gray-100',
  }

  return (
    <Link
      href={href}
      className={`rounded-2xl border p-3.5 md:p-4 flex flex-col gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all min-w-0 ${colors[color]}`}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-[var(--muted)]">{label}</p>
      </div>
    </Link>
  )
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 p-3 md:p-4 bg-white border border-[var(--border)] rounded-xl hover:bg-[var(--brand-light)] hover:text-[var(--brand)] hover:border-[var(--brand)] hover:shadow-sm transition-all text-center text-sm font-medium min-w-0"
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    published: { label: 'פעיל', cls: 'bg-green-50 text-green-700' },
    draft: { label: 'טיוטה', cls: 'bg-amber-50 text-amber-700' },
    hidden: { label: 'מוסתר', cls: 'bg-gray-50 text-gray-500' },
  }
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-gray-50 text-gray-500' }
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
}
