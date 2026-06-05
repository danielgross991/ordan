'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import {
  SUPPLIER_TYPES,
  BUSINESS_FIT_OPTIONS,
  getPublicReadiness,
  type Supplier,
  type SupplierStatus,
  type SupplierType,
} from '@/lib/domain/supplier'
import type { Category } from '@/lib/domain/category'
import type { Region } from '@/lib/domain/region'
import { createSupplierAction, updateSupplierAction } from '@/actions/supplierActions'

interface SupplierFormProps {
  supplier?: Partial<Supplier>
  categories: Category[]
  regions: Region[]
  mode: 'create' | 'edit'
}

export function SupplierForm({ supplier, categories, regions, mode }: SupplierFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    businessName: supplier?.businessName ?? '',
    shortDescription: supplier?.shortDescription ?? '',
    fullDescription: supplier?.fullDescription ?? '',
    primaryCategory: supplier?.primaryCategory ?? '',
    subcategories: supplier?.subcategories?.join('|') ?? '',
    supplierType: supplier?.supplierType ?? '',
    businessFit: supplier?.businessFit ?? [] as string[],
    phone: supplier?.phone ?? '',
    whatsapp: supplier?.whatsapp ?? '',
    email: supplier?.email ?? '',
    website: supplier?.website ?? '',
    address: supplier?.address ?? '',
    city: supplier?.city ?? '',
    region: supplier?.region ?? '',
    serviceAreas: supplier?.serviceAreas?.join('|') ?? '',
    openingHours: supplier?.openingHours ?? '',
    logoUrl: supplier?.logoUrl ?? '',
    coverImageUrl: supplier?.coverImageUrl ?? '',
    galleryUrls: supplier?.galleryUrls?.join('\n') ?? '',
    keywords: supplier?.keywords?.join('|') ?? '',
    lastVerifiedAt: supplier?.lastVerifiedAt
      ? supplier.lastVerifiedAt.toISOString().slice(0, 10)
      : '',
    status: (supplier?.status ?? 'draft') as SupplierStatus,
    featured: supplier?.featured ?? false,
    forcePublish: supplier?.forcePublish ?? false,
  })

  const set = (key: string, value: string | boolean | string[]) =>
    setForm(f => ({ ...f, [key]: value }))

  const toggleFit = (fit: string) => {
    const current = form.businessFit
    set('businessFit', current.includes(fit) ? current.filter(f => f !== fit) : [...current, fit])
  }

  const parsePipe = (s: string) => s.split('|').map(x => x.trim()).filter(Boolean)

  // Live readiness computed from current form state
  const readiness = getPublicReadiness({
    businessName: form.businessName,
    shortDescription: form.shortDescription,
    fullDescription: form.fullDescription,
    primaryCategory: form.primaryCategory,
    supplierType: (form.supplierType as SupplierType) || null,
    businessFit: form.businessFit,
    phone: form.phone || null,
    whatsapp: form.whatsapp || null,
    email: form.email || null,
    website: form.website || null,
    address: form.address || null,
    city: form.city || null,
    region: form.region || null,
    serviceAreas: parsePipe(form.serviceAreas),
    openingHours: form.openingHours || null,
    logoUrl: form.logoUrl || null,
    keywords: parsePipe(form.keywords),
    lastVerifiedAt: form.lastVerifiedAt ? new Date(form.lastVerifiedAt) : null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const input = {
      businessName: form.businessName,
      shortDescription: form.shortDescription,
      fullDescription: form.fullDescription,
      primaryCategory: form.primaryCategory,
      subcategories: parsePipe(form.subcategories),
      supplierType: (form.supplierType as SupplierType) || null,
      businessFit: form.businessFit,
      phone: form.phone || null,
      whatsapp: form.whatsapp || null,
      email: form.email || null,
      website: form.website || null,
      address: form.address || null,
      city: form.city || null,
      region: form.region || null,
      serviceAreas: parsePipe(form.serviceAreas),
      openingHours: form.openingHours || null,
      logoUrl: form.logoUrl || null,
      coverImageUrl: form.coverImageUrl || null,
      galleryUrls: form.galleryUrls.split('\n').map(u => u.trim()).filter(Boolean),
      keywords: parsePipe(form.keywords),
      status: form.status,
      featured: form.featured,
      forcePublish: form.forcePublish,
      lastVerifiedAt: form.lastVerifiedAt ? new Date(form.lastVerifiedAt) : null,
      kashrut: supplier?.kashrut ?? null,
      catalogEnabled: supplier?.catalogEnabled ?? false,
      catalogSummary: supplier?.catalogSummary ?? null,
      sourceType: supplier?.sourceType ?? null,
      sourceUrl: supplier?.sourceUrl ?? null,
    }

    try {
      if (mode === 'create') {
        const result = await createSupplierAction(input)
        if (result.success) {
          router.push('/admin/suppliers')
        } else {
          setError('שגיאה ביצירת הספק')
        }
      } else {
        const result = await updateSupplierAction(supplier!.id!, input)
        if (result.success) {
          router.push('/admin/suppliers')
        } else {
          setError(result.error ?? 'שגיאה בעדכון הספק')
        }
      }
    } catch {
      setError('שגיאה לא צפויה. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  const categoryOptions = categories.map(c => ({ value: c.labelHe, label: c.labelHe }))
  const regionOptions = regions.map(r => ({ value: r.labelHe, label: r.labelHe }))
  const typeOptions = SUPPLIER_TYPES.map(t => ({ value: t, label: t }))
  const statusOptions: { value: string; label: string }[] = [
    { value: 'draft', label: 'טיוטה' },
    { value: 'published', label: 'פעיל (מפורסם)' },
    { value: 'hidden', label: 'מוסתר' },
  ]

  const scoreColor =
    readiness.score >= 80 ? 'bg-green-500' : readiness.score >= 50 ? 'bg-amber-400' : 'bg-red-400'
  const scoreLabelColor =
    readiness.score >= 80 ? 'text-green-700' : readiness.score >= 50 ? 'text-amber-700' : 'text-red-600'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 max-w-3xl">

      {/* ── Readiness indicator ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h2 className="font-semibold text-sm">מוכנות לפרסום</h2>
          <span className={`text-sm font-bold ${scoreLabelColor}`}>
            {readiness.score}%
            {readiness.isReady
              ? ' ✅ מוכן לפרסום'
              : ` — ${readiness.missingFields.length} שדות חסרים`}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-300 ${scoreColor}`}
            style={{ width: `${readiness.score}%` }}
          />
        </div>
        {readiness.missingFields.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {readiness.missingFields.map(f => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-full"
              >
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {f.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Section 1: Basic Info ───────────────────────────── */}
      <FormSection title="פרטי עסק" requiredKeys={['businessName', 'shortDescription', 'fullDescription']} readiness={readiness}>
        <Input
          label="שם עסק *"
          required
          value={form.businessName}
          onChange={e => set('businessName', e.target.value)}
          placeholder="שם העסק כפי שיופיע לציבור"
        />
        <Textarea
          label="תיאור קצר *"
          value={form.shortDescription}
          onChange={e => set('shortDescription', e.target.value)}
          placeholder="1-2 משפטים על העסק"
          rows={2}
        />
        <Textarea
          label="תיאור מלא *"
          value={form.fullDescription}
          onChange={e => set('fullDescription', e.target.value)}
          placeholder="תיאור מפורט יותר של השירות, המוצרים, והיתרונות"
          rows={4}
        />
      </FormSection>

      {/* ── Section 2: Category & Type ─────────────────────── */}
      <FormSection title="קטגוריה וסוג" requiredKeys={['primaryCategory', 'supplierType', 'businessFit']} readiness={readiness}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="קטגוריה ראשית *"
            required
            value={form.primaryCategory}
            onChange={e => set('primaryCategory', e.target.value)}
            placeholder="בחר קטגוריה"
            options={categoryOptions.length > 0 ? categoryOptions : [
              { value: 'מזון', label: 'מזון' },
              { value: 'ירקות ופירות', label: 'ירקות ופירות' },
              { value: 'בשר ודגים', label: 'בשר ודגים' },
            ]}
          />
          <Select
            label="סוג ספק *"
            value={form.supplierType}
            onChange={e => set('supplierType', e.target.value)}
            placeholder="בחר סוג"
            options={typeOptions}
          />
        </div>
        <Input
          label="קטגוריות משנה"
          value={form.subcategories}
          onChange={e => set('subcategories', e.target.value)}
          placeholder="הפרד ב-| למשל: בשר|עוף|דגים"
          hint="ניתן להזין מספר ערכים מופרדים בסימן |"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מתאים ל– * <span className="text-xs font-normal text-[var(--muted)]">(בחר לפחות אחד)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {BUSINESS_FIT_OPTIONS.map(fit => (
              <button
                key={fit}
                type="button"
                onClick={() => toggleFit(fit)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  form.businessFit.includes(fit)
                    ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                    : 'bg-white text-gray-600 border-[var(--border)] hover:border-[var(--brand)]'
                }`}
              >
                {fit}
              </button>
            ))}
          </div>
        </div>
      </FormSection>

      {/* ── Section 3: Contact ──────────────────────────────── */}
      <FormSection title="פרטי קשר" requiredKeys={['phone', 'whatsapp', 'email', 'website']} readiness={readiness}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="טלפון *"
            type="tel"
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            placeholder="05X-XXXXXXX"
          />
          <Input
            label="WhatsApp *"
            type="tel"
            value={form.whatsapp}
            onChange={e => set('whatsapp', e.target.value)}
            placeholder="05X-XXXXXXX"
          />
          <Input
            label="מייל *"
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="info@example.com"
          />
          <Input
            label="אתר אינטרנט *"
            type="url"
            value={form.website}
            onChange={e => set('website', e.target.value)}
            placeholder="https://example.com"
          />
        </div>
      </FormSection>

      {/* ── Section 4: Location & Service ──────────────────── */}
      <FormSection title="מיקום ושירות" requiredKeys={['address', 'city', 'region', 'serviceAreas', 'openingHours']} readiness={readiness}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="כתובת *"
            value={form.address}
            onChange={e => set('address', e.target.value)}
            placeholder="רחוב, מספר"
          />
          <Input
            label="עיר *"
            value={form.city}
            onChange={e => set('city', e.target.value)}
            placeholder="עיר"
          />
          <Select
            label="אזור *"
            value={form.region}
            onChange={e => set('region', e.target.value)}
            placeholder="בחר אזור"
            options={regionOptions.length > 0 ? regionOptions : [
              { value: 'מרכז', label: 'מרכז' },
              { value: 'תל אביב וגוש דן', label: 'תל אביב וגוש דן' },
              { value: 'ירושלים והסביבה', label: 'ירושלים והסביבה' },
              { value: 'חיפה והקריות', label: 'חיפה והקריות' },
            ]}
          />
          <Input
            label="אזורי שירות *"
            value={form.serviceAreas}
            onChange={e => set('serviceAreas', e.target.value)}
            placeholder="מרכז|שרון|ירושלים"
            hint="הפרד ב-| (לפחות אחד)"
          />
        </div>
        <Input
          label="שעות פעילות *"
          value={form.openingHours}
          onChange={e => set('openingHours', e.target.value)}
          placeholder="א׳-ה׳ 8:00-17:00 | ו׳ 8:00-13:00"
        />
      </FormSection>

      {/* ── Section 5: Branding & Media ────────────────────── */}
      <FormSection title="מיתוג ומדיה" requiredKeys={['logoUrl']} readiness={readiness}>
        <Input
          label="URL לוגו *"
          type="url"
          value={form.logoUrl}
          onChange={e => set('logoUrl', e.target.value)}
          placeholder="https://example.com/logo.png"
        />
        <Input
          label="URL תמונת כריכה (אופציונלי)"
          type="url"
          value={form.coverImageUrl}
          onChange={e => set('coverImageUrl', e.target.value)}
          placeholder="https://example.com/cover.jpg"
        />
        <Textarea
          label="גלריה — URL אחד בכל שורה (אופציונלי)"
          value={form.galleryUrls}
          onChange={e => set('galleryUrls', e.target.value)}
          placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg"
          rows={3}
        />
      </FormSection>

      {/* ── Section 6: Keywords ────────────────────────────── */}
      <FormSection title="מילות מפתח" requiredKeys={['keywords']} readiness={readiness}>
        <Input
          label="מילות מפתח *"
          value={form.keywords}
          onChange={e => set('keywords', e.target.value)}
          placeholder="בשר|קצביה|בקר|עגל"
          hint="הפרד ב-| לשיפור תוצאות החיפוש (לפחות אחת)"
        />
      </FormSection>

      {/* ── Section 7: Quality & Publishing ────────────────── */}
      <FormSection title="בקרת איכות ופרסום" requiredKeys={['lastVerifiedAt']} readiness={readiness}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            תאריך אימות אחרון *
          </label>
          <input
            type="date"
            value={form.lastVerifiedAt}
            onChange={e => set('lastVerifiedAt', e.target.value)}
            className="w-full border border-[var(--border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)] bg-white"
          />
          <p className="text-xs text-[var(--muted)] mt-1">
            תאריך שבו אומתו פרטי הספק לאחרונה
          </p>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={e => set('featured', e.target.checked)}
            className="w-4 h-4 accent-[var(--brand)]"
          />
          <span className="text-sm font-medium text-gray-700">⭐ ספק מובחר</span>
        </label>

        <div>
          <Select
            label="סטטוס פרסום"
            value={form.status}
            onChange={e => set('status', e.target.value as SupplierStatus)}
            options={statusOptions}
          />
          {form.status === 'published' && readiness.missingFields.length > 0 && (
            <div className="mt-3 bg-[var(--brand-light)] border border-[var(--border)] rounded-xl p-3 flex items-start gap-2">
              <svg className="w-3.5 h-3.5 text-[var(--brand)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-[var(--brand)] leading-relaxed">
                הספק יפורסם עם {readiness.missingFields.length} שדות חסרים. ניתן להשלים בהמשך.
              </p>
            </div>
          )}
          {form.status === 'published' && readiness.isReady && (
            <p className="mt-2 text-xs text-green-700 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              הספק מוכן לפרסום — כל השדות הנדרשים מולאו
            </p>
          )}
        </div>

        {/* ── Approval marker (admin only) ─────────────────── */}
        <label className="flex items-center gap-2.5 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={form.forcePublish}
            onChange={e => set('forcePublish', e.target.checked)}
            className="w-4 h-4 accent-[var(--brand)]"
          />
          <div>
            <span className="text-sm font-medium text-gray-700">סומן כמאושר לפרסום</span>
            <p className="text-xs text-[var(--muted)]">מסמן שהאדמין אישר פרסום גם ללא שלמות מלאה</p>
          </div>
        </label>
      </FormSection>

      {/* ── Source (read-only internal) ─────────────────────── */}
      {supplier?.sourceType && (
        <div className="bg-gray-50 rounded-2xl border border-[var(--border)] p-5 space-y-4">
          <h2 className="font-semibold text-gray-500 text-sm">מקור (פנימי — לא מוצג לציבור)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="סוג מקור" value={supplier.sourceType ?? ''} disabled />
            <Input label="URL מקור" value={supplier.sourceUrl ?? ''} disabled />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3 pb-6 safe-bottom">
        <Button type="submit" loading={loading} size="lg" className="w-full sm:w-auto">
          {mode === 'create' ? 'צור ספק' : 'שמור שינויים'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.push('/admin/suppliers')}
          className="w-full sm:w-auto"
        >
          ביטול
        </Button>
      </div>
    </form>
  )
}

/* ── Sub-components ─────────────────────────────────────────── */

function FormSection({
  title,
  children,
  requiredKeys,
  readiness,
}: {
  title: string
  children: React.ReactNode
  requiredKeys: string[]
  readiness: ReturnType<typeof getPublicReadiness>
}) {
  const sectionMissingCount = readiness.missingFields.filter(f =>
    requiredKeys.includes(f.key)
  ).length

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-4 md:p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">{title}</h2>
        {sectionMissingCount > 0 && (
          <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
            {sectionMissingCount} חסר
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
