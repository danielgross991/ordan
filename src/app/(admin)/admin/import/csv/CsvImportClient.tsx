'use client'

import { useState } from 'react'
import { parseCsvAction, confirmCsvImportAction } from '@/actions/importActions'
import type { CsvParseResult } from '@/lib/import/csvParser'
import type { CreateSupplierInput } from '@/lib/domain/supplier'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

type Step = 'upload' | 'preview' | 'done'

interface ImportResult {
  created: number
  errors: number
  errorDetails: { businessName: string; message: string }[]
}

export function CsvImportClient() {
  const [step, setStep] = useState<Step>('upload')
  const [loading, setLoading] = useState(false)
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError(null)
    const text = await file.text()
    const result = await parseCsvAction(text)
    setParseResult(result)
    setSelected(new Set(result.rows.filter(r => r.status !== 'error').map(r => r.index)))
    setStep('preview')
    setLoading(false)
  }

  const toggleRow = (index: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const handleConfirm = async () => {
    if (!parseResult) return
    setLoading(true)
    const toImport = parseResult.rows
      .filter(r => selected.has(r.index) && r.data !== null)
      .map(r => r.data as CreateSupplierInput)
    const result = await confirmCsvImportAction(toImport)
    setImportResult(result)
    setStep('done')
    setLoading(false)
  }

  if (step === 'upload') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6">
          <h2 className="font-semibold mb-4">׳”׳¢׳׳” ׳§׳•׳‘׳¥ CSV</h2>

          <label className="block border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-[var(--brand)] transition-colors">
            <div className="text-4xl mb-3">נ“</div>
            <p className="font-medium text-gray-700 mb-1">׳׳—׳¥ ׳׳‘׳—׳™׳¨׳× ׳§׳•׳‘׳¥ CSV</p>
            <p className="text-sm text-[var(--muted)]">
              ׳§׳•׳‘׳¥ CSV ׳¢׳ ׳©׳•׳¨׳× ׳›׳•׳×׳¨׳•׳×. ׳©׳“׳•׳× ׳ ׳“׳¨׳©׳™׳: business_name, primary_category
            </p>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {loading && (
            <div className="mt-4 text-center text-sm text-[var(--muted)]">׳׳ ׳×׳— ׳§׳•׳‘׳¥...</div>
          )}
          {error && (
            <p className="mt-4 text-sm text-red-500">{error}</p>
          )}
        </div>

        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4">
          <h3 className="font-medium text-sm mb-2">׳¢׳׳•׳“׳•׳× CSV ׳׳₪׳©׳¨׳™׳•׳×</h3>
          <code className="text-xs text-gray-600 block leading-relaxed">
            business_name, primary_category, short_description, full_description, supplier_type, business_fit, phone, whatsapp, email, website, address, city, region, service_areas, opening_hours, logo_url, keywords, status, featured
          </code>
          <p className="text-xs text-[var(--muted)] mt-2">
            * ׳ ׳™׳×׳ ׳׳”׳©׳×׳׳© ׳’׳ ׳‘׳›׳•׳×׳¨׳•׳× ׳¢׳‘׳¨׳™׳×: ׳©׳ ׳¢׳¡׳§, ׳§׳˜׳’׳•׳¨׳™׳”, ׳˜׳׳₪׳•׳ ׳•׳›׳•׳³<br />
            * ׳©׳“׳•׳× ׳¢׳ ׳׳¡׳₪׳¨ ׳¢׳¨׳›׳™׳ ׳׳•׳₪׳¨׳“׳™׳ ׳‘-| (׳׳׳©׳ business_fit: ׳׳¡׳¢׳“׳•׳×|׳‘׳×׳™ ׳§׳₪׳”)
          </p>
        </div>
      </div>
    )
  }

  if (step === 'preview' && parseResult) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-3 text-center">
            <div className="text-2xl font-bold text-gray-800">{parseResult.totalRows}</div>
            <div className="text-xs text-[var(--muted)]">׳©׳•׳¨׳•׳× ׳‘׳§׳•׳‘׳¥</div>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
            <div className="text-2xl font-bold text-green-700">{parseResult.validRows}</div>
            <div className="text-xs text-green-600">׳×׳§׳™׳ ׳•׳×</div>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-100 p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{parseResult.errorRows}</div>
            <div className="text-xs text-red-500">׳¢׳ ׳©׳’׳™׳׳•׳×</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="font-semibold">׳×׳¦׳•׳’׳” ׳׳§׳“׳™׳׳”</h2>
            <div className="text-sm text-[var(--muted)]">{selected.size} ׳©׳•׳¨׳•׳× ׳ ׳‘׳—׳¨׳• ׳׳™׳™׳‘׳•׳</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-[var(--border)] text-right">
                  <th className="px-3 py-2 font-semibold text-gray-600 w-8"></th>
                  <th className="px-3 py-2 font-semibold text-gray-600">#</th>
                  <th className="px-3 py-2 font-semibold text-gray-600">׳©׳ ׳¢׳¡׳§</th>
                  <th className="px-3 py-2 font-semibold text-gray-600">׳§׳˜׳’׳•׳¨׳™׳”</th>
                  <th className="px-3 py-2 font-semibold text-gray-600">׳¢׳™׳¨</th>
                  <th className="px-3 py-2 font-semibold text-gray-600">׳¡׳˜׳˜׳•׳¡</th>
                  <th className="px-3 py-2 font-semibold text-gray-600">׳”׳¢׳¨׳•׳×</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {parseResult.rows.map(row => (
                  <tr
                    key={row.index}
                    className={`${row.status === 'error' ? 'bg-red-50' : row.status === 'warning' ? 'bg-amber-50/50' : ''}`}
                  >
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selected.has(row.index)}
                        disabled={row.status === 'error'}
                        onChange={() => toggleRow(row.index)}
                        className="accent-[var(--brand)]"
                      />
                    </td>
                    <td className="px-3 py-2 text-[var(--muted)]">{row.index + 1}</td>
                    <td className="px-3 py-2 font-medium">
                      {row.data?.businessName ?? row.rawData.businessName ?? 'ג€”'}
                    </td>
                    <td className="px-3 py-2 text-gray-600">
                      {row.data?.primaryCategory ?? row.rawData.primaryCategory ?? 'ג€”'}
                    </td>
                    <td className="px-3 py-2 text-gray-600">{row.data?.city ?? 'ג€”'}</td>
                    <td className="px-3 py-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        row.status === 'valid' ? 'bg-green-100 text-green-700' :
                        row.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {row.status === 'valid' ? '׳×׳§׳™׳' : row.status === 'warning' ? '׳׳–׳”׳¨׳”' : '׳©׳’׳™׳׳”'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-[var(--muted)]">
                      {row.errors.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleConfirm} loading={loading} disabled={selected.size === 0}>
            ׳™׳‘׳ {selected.size} ׳¡׳₪׳§׳™׳
          </Button>
          <Button variant="ghost" onClick={() => setStep('upload')}>׳—׳–׳•׳¨</Button>
        </div>
      </div>
    )
  }

  if (step === 'done' && importResult) {
    const allFailed = importResult.created === 0 && importResult.errors > 0
    const partialSuccess = importResult.created > 0 && importResult.errors > 0
    const fullSuccess = importResult.created > 0 && importResult.errors === 0
    const nothingDone = importResult.created === 0 && importResult.errors === 0

    // Detect migration-related errors (column not found)
    const hasMigrationError = importResult.errorDetails.some(
      e => e.message.includes('force_publish') || e.message.includes('column') || e.message.includes('does not exist')
    )

    return (
      <div className="space-y-4">
        {/* Result header */}
        <div className={`bg-white rounded-2xl border shadow-sm p-8 text-center ${
          allFailed ? 'border-red-200' : partialSuccess ? 'border-amber-200' : 'border-[var(--border)]'
        }`}>
          <div className="text-4xl mb-4">
            {allFailed ? 'ג' : partialSuccess ? 'ג ן¸' : fullSuccess ? 'ג…' : 'ג€”'}
          </div>
          <h2 className="text-xl font-bold mb-2">
            {allFailed ? '׳”׳™׳™׳‘׳•׳ ׳ ׳›׳©׳' : partialSuccess ? '׳™׳™׳‘׳•׳ ׳—׳׳§׳™' : fullSuccess ? '׳”׳™׳™׳‘׳•׳ ׳”׳•׳©׳׳' : '׳׳ ׳™׳•׳‘׳׳• ׳©׳•׳¨׳•׳×'}
          </h2>
          <p className="text-[var(--muted)]">
            {importResult.created > 0 && (
              <span className="text-green-700 font-medium">{importResult.created} ׳¡׳₪׳§׳™׳ ׳™׳•׳‘׳׳• ׳‘׳”׳¦׳׳—׳”. </span>
            )}
            {importResult.errors > 0 && (
              <span className="text-red-600 font-medium">{importResult.errors} ׳©׳•׳¨׳•׳× ׳ ׳›׳©׳׳•.</span>
            )}
            {nothingDone && '׳׳ ׳ ׳‘׳—׳¨׳• ׳©׳•׳¨׳•׳× ׳׳™׳™׳‘׳•׳.'}
          </p>
        </div>

        {/* Migration warning */}
        {hasMigrationError && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-amber-800 mb-2">ג ן¸ ׳ ׳“׳¨׳©׳× ׳׳™׳’׳¨׳¦׳™׳™׳× ׳׳¡׳“ ׳ ׳×׳•׳ ׳™׳</p>
            <p className="text-sm text-amber-700 mb-3">
              ׳¢׳׳•׳“׳” ׳—׳¡׳¨׳” ׳–׳•׳”׳×׳” ׳‘׳˜׳‘׳׳× ׳”׳¡׳₪׳§׳™׳. ׳”׳₪׳¢׳ ׳׳× ׳”׳₪׳§׳•׳“׳” ׳”׳‘׳׳” ׳‘׳˜׳¨׳׳™׳ ׳ ׳•׳׳׳—׳¨ ׳׳›׳ ׳ ׳¡׳” ׳׳™׳™׳‘׳ ׳©׳•׳‘:
            </p>
            <code className="block bg-amber-100 text-amber-900 text-xs font-mono px-4 py-2 rounded-lg">
              npm run migrate
            </code>
          </div>
        )}

        {/* Row-level error details */}
        {importResult.errorDetails.length > 0 && !hasMigrationError && (
          <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
            <h3 className="font-semibold text-red-700 text-sm mb-3">
              ׳₪׳¨׳˜׳™ ׳©׳’׳™׳׳•׳× ({importResult.errorDetails.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {importResult.errorDetails.map((e, i) => (
                <div key={i} className="flex items-start gap-3 text-xs py-1.5 border-b border-red-100 last:border-0">
                  <span className="font-semibold text-red-700 flex-shrink-0 min-w-[140px]">{e.businessName}</span>
                  <span className="text-red-600 font-mono break-all">{e.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All errors with migration notice */}
        {importResult.errorDetails.length > 0 && hasMigrationError && (
          <details className="bg-gray-50 rounded-xl border border-[var(--border)] p-4">
            <summary className="text-xs font-medium text-gray-600 cursor-pointer">
              ׳”׳¦׳’ ׳©׳’׳™׳׳•׳× ׳’׳•׳׳׳™׳•׳× ({importResult.errorDetails.length})
            </summary>
            <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
              {importResult.errorDetails.map((e, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <span className="font-medium text-gray-700 flex-shrink-0 min-w-[140px]">{e.businessName}</span>
                  <span className="text-gray-500 font-mono">{e.message}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        <div className="flex gap-3">
          <Button onClick={() => setStep('upload')} variant="secondary">׳™׳‘׳ ׳§׳•׳‘׳¥ ׳ ׳•׳¡׳£</Button>
          {importResult.created > 0 && (
            <Link
              href="/admin/suppliers"
              className="px-4 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-dark)] transition-colors"
            >
              ׳¢׳‘׳•׳¨ ׳׳¡׳₪׳§׳™׳
            </Link>
          )}
        </div>
      </div>
    )
  }

  return null
}
