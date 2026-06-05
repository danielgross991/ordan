import { v4 as uuidv4 } from 'uuid'
import { getSql } from './client'

export interface ImportLog {
  id: string
  importType: 'csv' | 'url'
  source: string
  recordsImported: number
  recordsSkipped: number
  importedBy: string
  importedAt: Date
  notes: string
}

export async function logImport(entry: Omit<ImportLog, 'id' | 'importedAt'>): Promise<void> {
  const sql = getSql()
  if (!sql) return
  const id = uuidv4()
  const now = new Date()
  await sql`
    INSERT INTO import_logs (id, import_type, source, records_imported, records_skipped, imported_by, imported_at, notes)
    VALUES (${id}, ${entry.importType}, ${entry.source}, ${entry.recordsImported},
            ${entry.recordsSkipped}, ${entry.importedBy}, ${now.toISOString()}, ${entry.notes})
  `
}

export async function getImportLogs(): Promise<ImportLog[]> {
  const sql = getSql()
  if (!sql) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[] = await sql`SELECT * FROM import_logs ORDER BY imported_at DESC`
  return rows.map(r => ({
    id: r.id,
    importType: r.import_type as 'csv' | 'url',
    source: r.source,
    recordsImported: r.records_imported,
    recordsSkipped: r.records_skipped,
    importedBy: r.imported_by,
    importedAt: new Date(r.imported_at),
    notes: r.notes ?? '',
  }))
}
