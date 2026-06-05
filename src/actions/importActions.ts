'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { bulkCreateSuppliers, createSupplier } from '@/lib/db/suppliers'
import { logImport } from '@/lib/db/importLogs'
import { isDbConfigured } from '@/lib/db/client'
import { parseCsvText } from '@/lib/import/csvParser'
import { extractFromUrl } from '@/lib/import/urlExtractor'
import type { CreateSupplierInput } from '@/lib/domain/supplier'
import { requireAdminSession } from '@/lib/security/authGuards'
import { normalizeExternalUrl } from '@/lib/security/url'
import { supplierInputSchema } from '@/lib/validation/supplierSchemas'

const MAX_CSV_BYTES = 750_000
const MAX_IMPORT_ROWS = 500

export async function parseCsvAction(csvText: string) {
  await requireAdminSession()
  if (typeof csvText !== 'string' || Buffer.byteLength(csvText, 'utf8') > MAX_CSV_BYTES) {
    return { rows: [], totalRows: 0, validRows: 0, errorRows: 1 }
  }
  return parseCsvText(csvText)
}

export async function confirmCsvImportAction(rows: CreateSupplierInput[]) {
  await requireAdminSession()

  if (!isDbConfigured()) {
    return { created: 0, errors: rows.length, errorDetails: [{ businessName: '-', message: 'מסד הנתונים לא מחובר' }] }
  }

  if (!Array.isArray(rows) || rows.length === 0) return { created: 0, errors: 0, errorDetails: [] }
  if (rows.length > MAX_IMPORT_ROWS) {
    return { created: 0, errors: rows.length, errorDetails: [{ businessName: '-', message: 'יותר מדי רשומות בייבוא אחד' }] }
  }

  const parsedRows = rows.map(row => supplierInputSchema.safeParse(row))
  const validRows = parsedRows.filter(row => row.success).map(row => row.data as CreateSupplierInput)
  if (validRows.length !== rows.length) {
    return {
      created: 0,
      errors: rows.length,
      errorDetails: [{ businessName: '-', message: 'אחת או יותר מהרשומות אינן תקינות' }],
    }
  }

  const result = await bulkCreateSuppliers(validRows)

  try {
    await logImport({
      importType: 'csv',
      source: 'csv_upload',
      recordsImported: result.created,
      recordsSkipped: result.errors,
      importedBy: 'admin',
      notes: `${result.created} ספקים יובאו, ${result.errors} שגיאות`,
    })
  } catch {
    console.warn('[confirmCsvImportAction] import log failed')
  }

  if (result.created > 0) {
    revalidatePath('/admin/suppliers')
    revalidatePath('/suppliers')
  }

  return result
}

export async function extractFromUrlAction(url: string) {
  await requireAdminSession()
  const parsed = z.string().trim().max(500).transform(value => normalizeExternalUrl(value)).safeParse(url)
  if (!parsed.success || !parsed.data) {
    return { extractionNotes: [], extractionError: 'כתובת URL לא תקינה' }
  }
  return extractFromUrl(parsed.data)
}

export async function confirmUrlImportAction(input: CreateSupplierInput) {
  await requireAdminSession()

  if (!isDbConfigured()) return { success: false, error: 'מסד הנתונים לא מחובר' }

  try {
    const parsed = supplierInputSchema.safeParse(input)
    if (!parsed.success) return { success: false, error: 'נתוני הספק אינם תקינים' }

    const supplier = await createSupplier({
      ...parsed.data,
      sourceType: parsed.data.sourceType ?? 'url_import',
    } as CreateSupplierInput)

    try {
      await logImport({
        importType: 'url',
        source: parsed.data.sourceUrl ?? 'unknown',
        recordsImported: 1,
        recordsSkipped: 0,
        importedBy: 'admin',
        notes: `יובא: ${supplier.businessName}`,
      })
    } catch {
      console.warn('[confirmUrlImportAction] import log failed')
    }

    revalidatePath('/admin/suppliers')
    return { success: true, id: supplier.id }
  } catch {
    console.error('[confirmUrlImportAction] failed')
    return { success: false, error: 'שגיאה בשמירת הספק' }
  }
}
