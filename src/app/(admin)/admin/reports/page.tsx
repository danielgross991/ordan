import { getAllReportsAdmin } from '@/lib/db/reports'
import { StatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import Link from 'next/link'
import { ReportActions } from './ReportActions'
import { formatDateStr } from '@/lib/utils/formatters'
import type { ReportStatus } from '@/lib/domain/report'

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

const allowedStatuses = new Set<ReportStatus>(['new', 'reviewed', 'resolved', 'dismissed'])

export default async function ReportsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const status = allowedStatuses.has(params.status as ReportStatus) ? (params.status as ReportStatus) : undefined
  const reports = await getAllReportsAdmin(status)

  const statusTabs = [
    { value: '', label: 'הכל' },
    { value: 'new', label: 'חדשים' },
    { value: 'reviewed', label: 'נבדקו' },
    { value: 'resolved', label: 'טופלו' },
    { value: 'dismissed', label: 'נדחו' },
  ]

  return (
    <div className="max-w-4xl space-y-5">
      <h1 className="text-2xl font-bold">דיווחים מהציבור</h1>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide touch-scroll pb-1">
        {statusTabs.map(tab => (
          <Link
            key={tab.value}
            href={tab.value ? `/admin/reports?status=${tab.value}` : '/admin/reports'}
            className={`flex-shrink-0 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-colors ${
              (params.status ?? '') === tab.value
                ? 'bg-[var(--brand)] text-white'
                : 'bg-white border border-[var(--border)] text-gray-600 hover:bg-[var(--brand-light)] hover:text-[var(--brand)] hover:border-[var(--brand)]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {reports.length === 0 ? (
        <EmptyState icon="📋" title="אין דיווחים" description="לא נמצאו דיווחים בסטטוס זה." />
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <div key={report.id} className="bg-white rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{report.issueType}</span>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    <Link
                      href={`/admin/suppliers/${report.supplierId}`}
                      className="hover:text-[var(--brand)]"
                    >
                      {report.supplierName}
                    </Link>
                    {' · '}
                    {formatDateStr(report.submittedAt)}
                    {report.reporterName && ` · ${report.reporterName}`}
                  </p>
                </div>
                <ReportActions reportId={report.id} currentStatus={report.status} />
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{report.description}</p>
              {report.adminNotes && (
                <p className="text-xs text-[var(--muted)] mt-2 pr-3 border-r-2 border-gray-200">
                  הערת מנהל: {report.adminNotes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
