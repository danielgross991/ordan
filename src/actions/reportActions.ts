'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createReport, updateReportStatus } from '@/lib/db/reports'
import { ISSUE_TYPES, type CreateReportInput, type ReportStatus } from '@/lib/domain/report'
import { assertAdminSession } from '@/lib/security/authGuards'
import { checkRateLimit, getRateLimitKey } from '@/lib/security/rateLimit'
import { idSchema } from '@/lib/validation/supplierSchemas'

const reportSchema = z.object({
  supplierId: idSchema,
  supplierName: z.string().trim().min(1).max(160),
  issueType: z.enum(ISSUE_TYPES as [string, ...string[]]),
  description: z.string().trim().min(10, 'תיאור חייב להכיל לפחות 10 תווים').max(2000),
  reporterName: z.string().trim().max(120).optional(),
  reporterEmail: z.string().trim().email('כתובת מייל לא תקינה').max(254).optional().or(z.literal('')),
  website_url: z.string().optional(),
})

const reportStatusSchema = z.enum(['new', 'reviewed', 'resolved', 'dismissed'])

export async function submitReportAction(formData: FormData) {
  const raw = {
    supplierId: formData.get('supplierId') as string,
    supplierName: formData.get('supplierName') as string,
    issueType: formData.get('issueType') as string,
    description: formData.get('description') as string,
    reporterName: (formData.get('reporterName') as string) || undefined,
    reporterEmail: (formData.get('reporterEmail') as string) || undefined,
    website_url: (formData.get('website_url') as string) || undefined,
  }

  const parsed = reportSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  if (parsed.data.website_url) return { success: true }

  const rateKey = getRateLimitKey('report', `${parsed.data.supplierId}:${parsed.data.reporterEmail || 'anonymous'}`)
  if (!checkRateLimit(rateKey, 5, 60 * 60 * 1000)) {
    return { success: false, errors: { _form: ['נשלחו יותר מדי דיווחים. נסו שוב מאוחר יותר.'] } }
  }

  const input: CreateReportInput = {
    supplierId: parsed.data.supplierId,
    supplierName: parsed.data.supplierName,
    issueType: parsed.data.issueType as CreateReportInput['issueType'],
    description: parsed.data.description,
    reporterName: parsed.data.reporterName || undefined,
    reporterEmail: parsed.data.reporterEmail || undefined,
  }

  try {
    await createReport(input)
    return { success: true }
  } catch {
    console.error('[submitReportAction] failed')
    return { success: false, errors: { _form: ['שגיאה בשמירת הדיווח. נסו שוב.'] } }
  }
}

export async function updateReportStatusAction(id: string, status: ReportStatus, adminNotes?: string) {
  await assertAdminSession()
  const parsedId = idSchema.safeParse(id)
  const parsedStatus = reportStatusSchema.safeParse(status)
  const parsedNotes = z.string().trim().max(2000).optional().safeParse(adminNotes)

  if (!parsedId.success || !parsedStatus.success || !parsedNotes.success) {
    return { success: false, error: 'נתונים לא תקינים' }
  }

  await updateReportStatus(parsedId.data, parsedStatus.data, parsedNotes.data)
  revalidatePath('/admin/reports')
  return { success: true }
}
