import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getSupplierBySlug } from '@/lib/db/suppliers'
import { SupplierContactButtons } from './SupplierContactButtons'
import { SupplierReportButton } from './SupplierReportButton'
import { SupplierSectionTabs } from './SupplierSectionTabs'
import { SupplierLogo } from '@/components/public/SupplierLogo'
import { FavoriteButton } from '@/components/public/FavoriteButton'
import { telLink, waLink, websiteLink } from '@/lib/utils/formatters'
import { normalizeImageUrl } from '@/lib/security/url'

export const revalidate = 300

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supplier = await getSupplierBySlug(slug)
  if (!supplier) return { title: 'ספק לא נמצא | אורדן' }

  const logoUrl = normalizeImageUrl(supplier.logoUrl)

  return {
    title: `${supplier.businessName} | אורדן`,
    description: supplier.shortDescription || undefined,
    openGraph: {
      title: supplier.businessName,
      description: supplier.shortDescription || undefined,
      images: logoUrl ? [logoUrl] : [],
    },
  }
}

export default async function SupplierPage({ params }: PageProps) {
  const { slug } = await params
  const supplier = await getSupplierBySlug(slug)
  if (!supplier) notFound()

  const isVerified = !!supplier.lastVerifiedAt
  const callHref = telLink(supplier.phone)
  const waHref = waLink(supplier.whatsapp ?? supplier.phone)
  const siteHref = websiteLink(supplier.website)
  const coverImageUrl = normalizeImageUrl(supplier.coverImageUrl)
  const galleryUrls = supplier.galleryUrls.map(url => normalizeImageUrl(url)).filter((url): url is string => !!url)
  const mobileContactCount = [callHref, waHref, siteHref].filter(Boolean).length
  const updatedLabel = formatUpdated(supplier.updatedAt)

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-5 md:py-8 pb-28 md:pb-8">

        {/* ── Breadcrumb ───────────────────────────────────── */}
        <nav className="text-xs text-[var(--muted)] mb-4 md:mb-5 flex items-center gap-1.5 min-w-0 overflow-hidden">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">בית</Link>
          <span>/</span>
          <Link href="/suppliers" className="hover:text-[var(--accent)] transition-colors">ספקים</Link>
          <span>/</span>
          <span className="text-[var(--text-body)] font-medium truncate">{supplier.businessName}</span>
        </nav>

        {/* ── Cover image ──────────────────────────────────── */}
        {coverImageUrl && (
          <div className="w-full h-40 sm:h-48 md:h-64 rounded-2xl overflow-hidden mb-5 bg-[var(--surface)]">
            <Image
              src={coverImageUrl}
              alt={supplier.businessName}
              width={960}
              height={256}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* ── Main header card ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[var(--border)] p-4 md:p-6 mb-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-start gap-3 md:gap-4">
            <SupplierLogo
              logoUrl={supplier.logoUrl}
              businessName={supplier.businessName}
              categoryIcon={categoryIcon(supplier.primaryCategory)}
              size={72}
              className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-xl flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h1 className="text-xl md:text-2xl font-black text-[var(--foreground)] leading-tight">
                  {supplier.businessName}
                </h1>
                <FavoriteButton supplierId={supplier.id} size="md" />
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {supplier.supplierType && (
                  <Chip variant="brand">{supplier.supplierType}</Chip>
                )}
                {supplier.featured && (
                  <Chip variant="accent">✦ מובחר</Chip>
                )}
                {isVerified && (
                  <Chip variant="green">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    מאומת
                  </Chip>
                )}
                <Chip variant="neutral">{supplier.primaryCategory}</Chip>
              </div>

              {supplier.shortDescription && (
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {supplier.shortDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        <TrustSummary
          verified={isVerified}
          hasWebsite={!!siteHref}
          hasDirectContact={!!(callHref || waHref)}
          serviceArea={supplier.region ?? supplier.city}
          businessFit={supplier.businessFit}
        />

        {/* ── Section tabs (sticky) ────────────────────────── */}
        <SupplierSectionTabs
          tabs={[
            supplier.fullDescription ? { id: 'about', label: 'אודות' } : null,
            supplier.businessFit.length > 0 ? { id: 'fit', label: 'מתאים ל-' } : null,
            supplier.subcategories.length > 0 ? { id: 'fields', label: 'תחומים' } : null,
            galleryUrls.length > 0 ? { id: 'gallery', label: 'גלריה' } : null,
            { id: 'contact', label: 'פרטים וקשר' },
          ].filter((t): t is { id: string; label: string } => !!t)}
        />

        {/* ── Two-column layout ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Main content ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Full description */}
            {supplier.fullDescription &&
              supplier.fullDescription !== supplier.shortDescription && (
                <div id="about" className="scroll-mt-32">
                  <Section title="אודות">
                    <p className="text-sm text-[var(--text-body)] leading-relaxed whitespace-pre-line">
                      {supplier.fullDescription}
                    </p>
                  </Section>
                </div>
              )}

            {/* Business fit */}
            {supplier.businessFit.length > 0 && (
              <div id="fit" className="scroll-mt-32">
                <Section title="מתאים ל–">
                  <div className="flex flex-wrap gap-2">
                    {supplier.businessFit.map(fit => (
                      <span
                        key={fit}
                        className="px-3 py-1.5 bg-[var(--surface)] text-[var(--text-body)] rounded-full text-sm font-medium border border-[var(--border)]"
                      >
                        {fit}
                      </span>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* Subcategories */}
            {supplier.subcategories.length > 0 && (
              <div id="fields" className="scroll-mt-32">
                <Section title="תחומים">
                  <div className="flex flex-wrap gap-2">
                    <Chip variant="brand">{supplier.primaryCategory}</Chip>
                    {supplier.subcategories.map(s => (
                      <Chip key={s} variant="neutral">{s}</Chip>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* Gallery */}
            {galleryUrls.length > 0 && (
              <div id="gallery" className="scroll-mt-32">
              <Section title="גלריה">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {galleryUrls.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-video bg-[var(--surface)] rounded-xl overflow-hidden"
                    >
                      <Image
                        src={url}
                        alt={`${supplier.businessName} - תמונה ${i + 1}`}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Section>
              </div>
            )}

            {/* Footer: last updated + report */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2">
              <span className="text-xs text-[var(--muted-light)]">
                {updatedLabel && `עודכן לאחרונה: ${updatedLabel}`}
              </span>
              <SupplierReportButton
                supplierId={supplier.id}
                supplierName={supplier.businessName}
              />
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────── */}
          <aside id="contact" className="space-y-4 scroll-mt-32">

            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-sm lg:sticky lg:top-24">
              <h2 className="font-bold text-sm text-[var(--foreground)] mb-4">יצירת קשר</h2>
              <div className="hidden md:block">
                <SupplierContactButtons supplier={supplier} />
              </div>
              <div className="md:hidden text-sm text-[var(--muted)]">
                פרטי יצירת הקשר זמינים בכפתורים הקבועים בתחתית המסך.
              </div>
            </div>

            {/* Business details */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-4 md:p-5 space-y-3.5">
              <h2 className="font-bold text-sm text-[var(--foreground)]">פרטים</h2>

              {(supplier.city || supplier.region) && (
                <DetailRow
                  icon={
                    <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                  label="מיקום"
                  value={[supplier.city, supplier.region].filter(Boolean).join(', ')}
                />
              )}
              {supplier.address && (
                <DetailRow icon="🏠" label="כתובת" value={supplier.address} />
              )}
              {supplier.serviceAreas.length > 0 && (
                <DetailRow
                  icon="🗺️"
                  label="אזורי שירות"
                  value={supplier.serviceAreas.join(' · ')}
                />
              )}
              {supplier.openingHours && (
                <DetailRow icon="🕐" label="שעות פעילות" value={supplier.openingHours} />
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile sticky contact bar ─────────────────────── */}
      {(callHref || waHref || siteHref) && (
        <div
          className="fixed bottom-0 start-0 end-0 z-50 md:hidden bg-[var(--surface-elevated)] border-t border-[var(--border)] px-4 shadow-lg"
          style={{ paddingTop: '0.75rem', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
        >
          <div className={`grid gap-2 ${mobileContactCount === 1 ? 'grid-cols-1' : mobileContactCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {callHref && (
            <a
              href={callHref}
              className="min-w-0 flex items-center justify-center gap-2 py-3.5 bg-[var(--phone-cta)] hover:bg-[var(--phone-cta-dark)] text-white rounded-xl text-sm font-bold active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              התקשר
            </a>
          )}
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex items-center justify-center gap-2 py-3.5 bg-[var(--wa-green)] hover:bg-[var(--wa-green-dark)] text-white rounded-xl text-sm font-bold active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          )}
          {siteHref && (
            <a
              href={siteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex items-center justify-center gap-2 py-3.5 bg-[var(--site-cta)] hover:bg-[var(--site-cta-dark)] text-white rounded-xl text-sm font-bold active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4h8m0 0v8m0-8L11 13m-1-7H7a3 3 0 00-3 3v8a3 3 0 003 3h8a3 3 0 003-3v-3" />
              </svg>
              אתר
            </a>
          )}
        </div>
        </div>
      )}
    </>
  )
}

/* ── Helpers ────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-4 md:p-5 shadow-sm">
      <h2 className="font-bold text-sm text-[var(--foreground)] mb-4">{title}</h2>
      {children}
    </div>
  )
}

function TrustSummary({
  verified,
  hasWebsite,
  hasDirectContact,
  serviceArea,
  businessFit,
}: {
  verified: boolean
  hasWebsite: boolean
  hasDirectContact: boolean
  serviceArea: string | null
  businessFit: string[]
}) {
  const items = [
    verified ? { label: 'מידע מאומת', value: 'עודכן ונבדק' } : null,
    hasDirectContact ? { label: 'קשר ישיר', value: 'טלפון או WhatsApp' } : null,
    hasWebsite ? { label: 'אתר ספק', value: 'קישור חיצוני זמין' } : null,
    serviceArea ? { label: 'אזור', value: serviceArea } : null,
    businessFit[0] ? { label: 'מתאים ל', value: businessFit.slice(0, 2).join(' · ') } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  if (items.length === 0) return null

  return (
    <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {items.slice(0, 5).map(item => (
        <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-white px-3 py-3 shadow-sm">
          <div className="text-[11px] font-semibold text-[var(--muted)]">{item.label}</div>
          <div className="mt-0.5 truncate text-sm font-bold text-[var(--foreground)]">{item.value}</div>
        </div>
      ))}
    </div>
  )
}

function Chip({
  variant,
  children,
}: {
  variant: 'brand' | 'accent' | 'green' | 'neutral'
  children: React.ReactNode
}) {
  const styles: Record<string, string> = {
    brand: 'bg-[var(--brand)] text-white',
    accent: 'bg-[var(--accent-light)] text-[var(--accent)]',
    green: 'bg-emerald-50 text-emerald-700',
    neutral: 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode | string
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="flex-shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs text-[var(--muted)] mb-0.5">{label}</div>
        <div className="text-[var(--text-body)] leading-snug">{value}</div>
      </div>
    </div>
  )
}

function categoryIcon(category: string): string {
  const map: Record<string, string> = {
    'מזון': '🥗',
    'ירקות ופירות': '🥦',
    'בשר ודגים': '🥩',
    'חד״פ ואריזות': '📦',
    'ציוד מטבח': '🍳',
    'ניקיון': '🧹',
    'שירותים לעסקים': '💼',
  }
  return map[category] ?? '🏪'
}

function formatUpdated(date: Date): string {
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'היום'
  if (diffDays === 1) return 'אתמול'
  if (diffDays < 30) return `לפני ${diffDays} ימים`
  if (diffDays < 365) return `לפני ${Math.floor(diffDays / 30)} חודשים`
  return `לפני ${Math.floor(diffDays / 365)} שנים`
}
