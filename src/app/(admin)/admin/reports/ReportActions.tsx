'use client'

import { useTransition } from 'react'
import { updateReportStatusAction } from '@/actions/reportActions'
import type { ReportStatus } from '@/lib/domain/report'

interface Props {
  reportId: string
  currentStatus: ReportStatus
}

export function ReportActions({ reportId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition()

  const setStatus = (status: ReportStatus) => {
    startTransition(async () => {
      await updateReportStatusAction(reportId, status)
    })
  }

  const allActions: { status: ReportStatus; label: string; cls: string }[] = [
    { status: 'reviewed', label: 'סמן כנבדק', cls: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
    { status: 'resolved', label: 'טופל', cls: 'bg-green-50 text-green-700 hover:bg-green-100' },
    { status: 'dismissed', label: 'דחה', cls: 'bg-gray-50 text-gray-600 hover:bg-gray-100' },
  ]
  const actions = allActions.filter(a => a.status !== currentStatus)

  return (
    <div className="flex flex-col gap-1 flex-shrink-0">
      <div className="flex gap-1">
        {actions.map(action => (
          <button
            key={action.status}
            onClick={() => setStatus(action.status)}
            disabled={isPending}
            className={`text-xs px-2 py-1 rounded-md transition-colors disabled:opacity-50 ${action.cls}`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
