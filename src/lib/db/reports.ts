import { v4 as uuidv4 } from 'uuid'
import { getSql } from './client'
import type { IssueReport, CreateReportInput, IssueType, ReportStatus } from '@/lib/domain/report'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toReport(row: any): IssueReport {
  return {
    id: row.id,
    supplierId: row.supplier_id,
    supplierName: row.supplier_name,
    issueType: row.issue_type as IssueType,
    description: row.description,
    reporterName: row.reporter_name ?? null,
    reporterEmail: row.reporter_email ?? null,
    submittedAt: new Date(row.submitted_at),
    status: row.status as ReportStatus,
    adminNotes: row.admin_notes ?? null,
  }
}

export async function createReport(input: CreateReportInput): Promise<IssueReport> {
  const sql = getSql()
  if (!sql) throw new Error('Database not configured')
  const id = uuidv4()
  const now = new Date()
  await sql`
    INSERT INTO issue_reports
      (id, supplier_id, supplier_name, issue_type, description, reporter_name, reporter_email, submitted_at, status, admin_notes)
    VALUES
      (${id}, ${input.supplierId}, ${input.supplierName}, ${input.issueType}, ${input.description},
       ${input.reporterName ?? null}, ${input.reporterEmail ?? null}, ${now.toISOString()}, 'new', null)
  `
  return {
    id,
    supplierId: input.supplierId,
    supplierName: input.supplierName,
    issueType: input.issueType,
    description: input.description,
    reporterName: input.reporterName ?? null,
    reporterEmail: input.reporterEmail ?? null,
    submittedAt: now,
    status: 'new',
    adminNotes: null,
  }
}

export async function getAllReportsAdmin(statusFilter?: ReportStatus): Promise<IssueReport[]> {
  const sql = getSql()
  if (!sql) return []
  const rows = statusFilter
    ? await sql`SELECT * FROM issue_reports WHERE status = ${statusFilter} ORDER BY submitted_at DESC`
    : await sql`SELECT * FROM issue_reports ORDER BY submitted_at DESC`
  return rows.map(toReport)
}

export async function updateReportStatus(id: string, status: ReportStatus, adminNotes?: string): Promise<void> {
  const sql = getSql()
  if (!sql) return
  if (adminNotes !== undefined) {
    await sql`UPDATE issue_reports SET status = ${status}, admin_notes = ${adminNotes} WHERE id = ${id}`
  } else {
    await sql`UPDATE issue_reports SET status = ${status} WHERE id = ${id}`
  }
}
