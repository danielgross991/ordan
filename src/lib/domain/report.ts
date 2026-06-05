export type IssueType =
  | 'מידע שגוי'
  | 'פרטי קשר לא תקינים'
  | 'עסק סגור'
  | 'תמונה לא מתאימה'
  | 'אחר'

export const ISSUE_TYPES: IssueType[] = [
  'מידע שגוי',
  'פרטי קשר לא תקינים',
  'עסק סגור',
  'תמונה לא מתאימה',
  'אחר',
]

export type ReportStatus = 'new' | 'reviewed' | 'resolved' | 'dismissed'

export interface IssueReport {
  id: string
  supplierId: string
  supplierName: string
  issueType: IssueType
  description: string
  reporterName: string | null
  reporterEmail: string | null
  submittedAt: Date
  status: ReportStatus
  adminNotes: string | null
}

export interface CreateReportInput {
  supplierId: string
  supplierName: string
  issueType: IssueType
  description: string
  reporterName?: string
  reporterEmail?: string
}
