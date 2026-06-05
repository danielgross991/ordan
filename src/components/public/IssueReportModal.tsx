'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ISSUE_TYPES } from '@/lib/domain/report'
import { submitReportAction } from '@/actions/reportActions'

interface IssueReportModalProps {
  supplierId: string
  supplierName: string
  open: boolean
  onClose: () => void
}

export function IssueReportModal({ supplierId, supplierName, open, onClose }: IssueReportModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await submitReportAction(formData)

    setLoading(false)
    if (result.success) {
      setSuccess(true)
    } else {
      setError('אירעה שגיאה. אנא נסה שוב.')
    }
  }

  const handleClose = () => {
    setSuccess(false)
    setError(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="דיווח על שגיאה / הצעת תיקון" size="md">
      {success ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-lg font-semibold mb-2">תודה על הדיווח!</h3>
          <p className="text-sm text-[var(--muted)] mb-4">נבדוק את הדיווח בהקדם ונעדכן את הנתונים אם נדרש.</p>
          <Button onClick={handleClose} variant="secondary">סגור</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hidden fields */}
          <input type="hidden" name="supplierId" value={supplierId} />
          <input type="hidden" name="supplierName" value={supplierName} />
          {/* Honeypot */}
          <input type="text" name="website_url" className="hidden" tabIndex={-1} autoComplete="off" />

          <p className="text-sm text-[var(--muted)]">
            מדווח על: <strong className="text-gray-800">{supplierName}</strong>
          </p>

          <Select
            name="issueType"
            label="סוג הבעיה"
            required
            placeholder="בחר סוג בעיה"
            options={ISSUE_TYPES.map(t => ({ value: t, label: t }))}
          />

          <Textarea
            name="description"
            label="תיאור הבעיה"
            required
            placeholder="פרט את הבעיה או השגיאה שמצאת..."
            rows={3}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              name="reporterName"
              label="שמך (אופציונלי)"
              placeholder="ישראל ישראלי"
            />
            <Input
              name="reporterEmail"
              type="email"
              label="מייל (אופציונלי)"
              placeholder="email@example.com"
              className="ltr-only"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <Button type="submit" loading={loading} className="flex-1">
              שלח דיווח
            </Button>
            <Button type="button" variant="ghost" onClick={handleClose}>
              ביטול
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
