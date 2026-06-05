'use client'

import { useState } from 'react'
import { extractFromUrlAction, confirmUrlImportAction } from '@/actions/importActions'
import type { ExtractedFields } from '@/lib/import/urlExtractor'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { SUPPLIER_TYPES } from '@/lib/domain/supplier'
import type { CreateSupplierInput, SupplierType } from '@/lib/domain/supplier'

type Step = 'input' | 'loading' | 'review' | 'done'

export function UrlImportClient() {
  const [step, setStep] = useState<Step>('input')
  const [url, setUrl] = useState('')
  const [extracted, setExtracted] = useState<ExtractedFields | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  // Editable review form state
  const [form, setForm] = useState({
    businessName: '',
    shortDescription: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    region: '',
    logoUrl: '',
    primaryCategory: '',
    supplierType: '',
    keywords: '',
  })

  const setField = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleExtract = async () => {
    if (!url.trim()) return
    setStep('loading')
    const result = await extractFromUrlAction(url.trim())
    setExtracted(result)

    if (result.extractionError) {
      setStep('review') // Still show form but with error message
    } else {
      setForm({
        businessName: result.businessName ?? '',
        shortDescription: result.shortDescription ?? '',
        phone: result.phone ?? '',
        email: result.email ?? '',
        website: result.website ?? url,
        address: result.address ?? '',
        city: result.city ?? '',
        region: '',
        logoUrl: result.logoUrl ?? '',
        primaryCategory: '',
        supplierType: '',
        keywords: result.keywords?.join('|') ?? '',
      })
      setStep('review')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    const input: CreateSupplierInput = {
      businessName: form.businessName,
      shortDescription: form.shortDescription,
      fullDescription: '',
      primaryCategory: form.primaryCategory || 'מזון',
      subcategories: [],
      supplierType: (SUPPLIER_TYPES.includes(form.supplierType as SupplierType) ? form.supplierType : null) as SupplierType | null,
      businessFit: [],
      phone: form.phone || null,
      whatsapp: null,
      email: form.email || null,
      website: form.website || null,
      address: form.address || null,
      city: form.city || null,
      region: form.region || null,
      serviceAreas: [],
      openingHours: null,
      logoUrl: form.logoUrl || null,
      coverImageUrl: null,
      galleryUrls: [],
      keywords: form.keywords.split('|').map(k => k.trim()).filter(Boolean),
      status: 'draft',
      featured: false,
      kashrut: null,
      catalogEnabled: false,
      catalogSummary: null,
      sourceType: 'url_import',
      sourceUrl: url,
      forcePublish: false,
      lastVerifiedAt: null,
    }
    const result = await confirmUrlImportAction(input)
    setSavedId(result.id ?? null)
    setSaving(false)
    setStep('done')
  }

  const typeOptions = SUPPLIER_TYPES.map(t => ({ value: t, label: t }))

  if (step === 'input') {
    return (
      <div className="bg-white rounded-2xl border border-[var(--border)] p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">URL של העסק</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleExtract() }}
              placeholder="https://example.co.il"
              className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              style={{ direction: 'ltr' }}
            />
            <Button onClick={handleExtract} disabled={!url.trim()}>
              חלץ נתונים
            </Button>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
          <strong>שים לב:</strong> המערכת מנסה לחלץ נתונים מהדף. חלק מהאתרים חוסמים גישה אוטומטית.
          לאחר החילוץ תוכל לבדוק ולערוך את כל הנתונים לפני שמירה.
        </div>
      </div>
    )
  }

  if (step === 'loading') {
    return (
      <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-[var(--brand)] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[var(--muted)]">מאחזר וסורק את הדף...</p>
        <p className="text-xs text-gray-400 mt-1 font-mono break-all">{url}</p>
      </div>
    )
  }

  if (step === 'review' && extracted) {
    return (
      <div className="space-y-4">
        {/* Extraction notes */}
        {extracted.extractionError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-medium text-red-700">שגיאה בחילוץ נתונים</p>
            <p className="text-xs text-red-600 mt-1">{extracted.extractionError}</p>
            <p className="text-xs text-red-500 mt-2">ניתן להזין את הנתונים ידנית בטופס למטה ולשמור כטיוטה.</p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm font-medium text-green-700">נתונים חולצו — בדוק ואשר</p>
            <ul className="text-xs text-green-600 mt-1 list-disc list-inside">
              {extracted.extractionNotes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        )}

        {/* Review form */}
        <div className="bg-white rounded-2xl border border-[var(--border)] p-5 space-y-4">
          <h2 className="font-semibold">בדוק ועדכן לפני שמירה</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="שם עסק" required value={form.businessName} onChange={e => setField('businessName', e.target.value)} />
            <Input label="עיר" value={form.city} onChange={e => setField('city', e.target.value)} />
          </div>

          <Textarea label="תיאור קצר" value={form.shortDescription} onChange={e => setField('shortDescription', e.target.value)} rows={2} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="טלפון" value={form.phone} onChange={e => setField('phone', e.target.value)} />
            <Input label="מייל" type="email" value={form.email} onChange={e => setField('email', e.target.value)} />
            <Input label="אתר" type="url" value={form.website} onChange={e => setField('website', e.target.value)} />
            <Input label="כתובת" value={form.address} onChange={e => setField('address', e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="קטגוריה ראשית"
              value={form.primaryCategory}
              onChange={e => setField('primaryCategory', e.target.value)}
              placeholder="בחר קטגוריה"
              options={[
                { value: 'מזון', label: 'מזון' },
                { value: 'ירקות ופירות', label: 'ירקות ופירות' },
                { value: 'בשר ודגים', label: 'בשר ודגים' },
                { value: 'חד״פ ואריזות', label: 'חד״פ ואריזות' },
                { value: 'ציוד מטבח', label: 'ציוד מטבח' },
                { value: 'ניקיון', label: 'ניקיון' },
                { value: 'שירותים לעסקים', label: 'שירותים לעסקים' },
              ]}
            />
            <Select
              label="סוג ספק"
              value={form.supplierType}
              onChange={e => setField('supplierType', e.target.value)}
              placeholder="בחר סוג"
              options={typeOptions}
            />
          </div>

          <Input
            label="URL לוגו"
            type="url"
            value={form.logoUrl}
            onChange={e => setField('logoUrl', e.target.value)}
          />
          <Input
            label="מילות מפתח"
            value={form.keywords}
            onChange={e => setField('keywords', e.target.value)}
            hint="הפרד ב-|"
          />

          <div className="bg-gray-50 rounded-lg p-3 text-xs text-[var(--muted)]">
            <span className="font-medium">מקור:</span>{' '}
            <span className="font-mono break-all">{url}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} loading={saving} disabled={!form.businessName.trim()}>
            שמור כטיוטה
          </Button>
          <Button variant="ghost" onClick={() => setStep('input')}>
            חזור
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="bg-white rounded-2xl border border-[var(--border)] p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-xl font-bold mb-2">הספק נשמר כטיוטה</h2>
        <p className="text-[var(--muted)] mb-6">
          כעת ניתן לערוך את הפרטים ולפרסם.
        </p>
        <div className="flex gap-3 justify-center">
          {savedId && (
            <a
              href={`/admin/suppliers/${savedId}`}
              className="px-4 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-dark)] transition-colors"
            >
              ערוך ספק זה
            </a>
          )}
          <Button variant="secondary" onClick={() => { setStep('input'); setUrl('') }}>
            יבא URL נוסף
          </Button>
        </div>
      </div>
    )
  }

  return null
}
