'use client'

import { useState } from 'react'
import { IssueReportModal } from '@/components/public/IssueReportModal'

interface Props {
  supplierId: string
  supplierName: string
}

export function SupplierReportButton({ supplierId, supplierName }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[var(--muted)] hover:text-red-500 transition-colors underline underline-offset-2"
      >
        ⚠️ דווח על שגיאה / הצע תיקון
      </button>
      <IssueReportModal
        supplierId={supplierId}
        supplierName={supplierName}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
