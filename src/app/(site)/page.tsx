import Link from 'next/link'
import { SearchBar } from '@/components/public/SearchBar'
import { CategoryIcon } from '@/components/public/CategoryIcon'
import { LogoMarquee } from '@/components/public/LogoMarquee'
import { getActiveCategories } from '@/lib/db/categories'
import { getActiveRegions } from '@/lib/db/regions'
import { getPublishedSuppliers } from '@/lib/db/suppliers'
import { SupplierCardComponent } from '@/components/public/SupplierCard'
import type { Category } from '@/lib/domain/category'
import type { Region } from '@/lib/domain/region'
import type { SupplierCard } from '@/lib/domain/supplier'

export const revalidate = 300

export default async function HomePage() {
  const [categories, regions, allSuppliers] = await Promise.all([
    getActiveCategories(),
    getActiveRegions(),
    getPublishedSuppliers({ query: '' }),
  ])

  const featuredSuppliers = allSuppliers.filter(s => s.featured).slice(0, 10)
  const recentSuppliers = [...allSuppliers].slice(0, 10)
  const verifiedSuppliers = allSuppliers.filter(s => s.lastVerifiedAt).slice(0, 10)

  // Per-category rails: pick up to 4 categories that have 3+ suppliers each
  const categoryRails = categories
    .map(cat => ({
      category: cat,
      suppliers: allSuppliers.filter(s => s.primaryCategory === cat.labelHe).slice(0, 8),
    }))
    .filter(r => r.suppliers.length >= 3)
    .slice(0, 4)

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f5f3ee_100%)] text-[var(--foreground)] py-8 md:py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[var(--border)] text-xs font-semibold text-[var(--muted)] shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            ספקים לעסקי מזון ואירוח
          </div>
          <h1 className="text-[2rem] md:text-4xl font-black leading-tight mb-3 tracking-tight">
            מצא את הספק הנכון
            <br />
            <span className="text-[var(--accent)]">לעסק שלך</span>
          </h1>
          <p className="text-[var(--muted)] text-base mb-7 max-w-sm mx-auto leading-relaxed">
            ספקי מזון, ציוד מטבח, ניקיון ועוד — הכל במקום אחד
          </p>
          <div className="max-w-lg mx-auto">
            <SearchBar size="large" placeholder="חפש לפי שם ספק, מוצר, קטגוריה..." />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5 text-xs text-[var(--muted)]">
            <TrustItem label="ספקים מאומתים" />
            <span className="w-px h-3 bg-[var(--border)] hidden sm:block" />
            <TrustItem label="קשר ישיר עם הספק" />
            <span className="w-px h-3 bg-[var(--border)] hidden sm:block" />
            <TrustItem label="מידע מעודכן" />
          </div>
          <IntentRail />
        </div>
      </section>

      {/* ── Logo marquee ─────────────────────────────────── */}
      <LogoMarquee suppliers={allSuppliers} />

      <div className="max-w-6xl mx-auto px-4 pt-7 pb-12 md:pt-8 md:pb-14 space-y-9 md:space-y-10">

        {/* ── Categories ──────────────────────────────────── */}
        <section>
          <SectionHeader title="מה צריך למצוא?" linkHref="/suppliers" linkLabel="כל הספקים" />
          <CategoryRail categories={categories} />
        </section>

        <section>
          <DiscoveryGrid />
        </section>

        {/* ── Featured suppliers ──────────────────────────── */}
        {featuredSuppliers.length > 0 && (
          <section>
            <SectionHeader title="ספקים מובחרים" linkHref="/suppliers?featured=true" linkLabel="לכל הספקים" />
            <SupplierRail suppliers={featuredSuppliers} />
          </section>
        )}

        {/* ── Verified suppliers ──────────────────────────── */}
        {verifiedSuppliers.length > 0 && (
          <section>
            <SectionHeader title="ספקים מאומתים לאחרונה" />
            <SupplierRail suppliers={verifiedSuppliers} />
          </section>
        )}

        {/* ── Per-category discovery rails ─────────────────── */}
        {categoryRails.map(({ category, suppliers }) => (
          <section key={category.id}>
            <SectionHeader
              title={`ספקים — ${category.labelHe}`}
              linkHref={`/suppliers?category=${encodeURIComponent(category.labelHe)}`}
              linkLabel="לכל הקטגוריה"
            />
            <SupplierRail suppliers={suppliers} />
          </section>
        ))}

        {/* ── Regions ─────────────────────────────────────── */}
        <section>
          <SectionHeader title="עיין לפי אזור" />
          <RegionRail regions={regions} />
        </section>

        {/* ── All recent suppliers ─────────────────────────── */}
        {recentSuppliers.length > 0 && (
          <section>
            <SectionHeader title="ספקים נוספים" linkHref="/suppliers" linkLabel="לכל הספקים" />
            <SupplierRail suppliers={recentSuppliers} />
          </section>
        )}

        {/* ── CTA strip for sign-in ────────────────────────── */}
        <section className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-10 text-center shadow-[var(--shadow-soft)]">
          <h2 className="text-xl md:text-2xl font-black mb-2">
            שמור ספקים שאהבת
          </h2>
          <p className="text-[var(--muted)] text-sm mb-6 max-w-xs mx-auto leading-relaxed">
            כנס עם Google ושמור ספקים לרשימה האישית שלך
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-[var(--brand)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--brand-dark)] transition-colors"
          >
            כניסה חינמית עם Google →
          </Link>
        </section>

        {/* ── Empty state ─────────────────────────────────── */}
        {recentSuppliers.length === 0 && (
          <div className="text-center py-16 bg-[var(--surface)] rounded-3xl border border-[var(--border)]">
            <div className="w-12 h-12 mx-auto mb-5 text-[var(--muted-light)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">בקרוב – ספקים מובחרים</h3>
            <p className="text-sm text-[var(--muted)] max-w-xs mx-auto">
              הפלטפורמה נמצאת בהקמה. ספקים יתווספו בקרוב.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────────── */

function TrustItem({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 bg-white/70 border border-[var(--border)] rounded-full px-2.5 py-1">
      <svg className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
      {label}
    </span>
  )
}

function IntentRail() {
  const intents = [
    { label: 'ספק מזון', href: '/suppliers?category=מזון' },
    { label: 'ציוד מטבח', href: '/suppliers?category=ציוד מטבח' },
    { label: 'מתאים למסעדות', href: '/suppliers?businessFit=מסעדות' },
    { label: 'ספקים מאומתים', href: '/suppliers' },
  ]

  return (
    <div className="mt-5 -mx-4 px-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide touch-scroll justify-start sm:justify-center pb-1">
        {intents.map(intent => (
          <Link
            key={intent.label}
            href={intent.href}
            className="flex-shrink-0 rounded-full bg-white border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm hover:border-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors"
          >
            {intent.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function DiscoveryGrid() {
  const items = [
    {
      title: 'מזון וחומרי גלם',
      text: 'יצרנים, יבואנים, סיטונאים ומפיצים למסעדות ומטבחים.',
      href: '/suppliers?category=מזון',
      cta: 'לספקי מזון',
    },
    {
      title: 'ציוד ותפעול',
      text: 'ציוד מטבח, אריזות, ניקיון ופתרונות תפעול לעסק.',
      href: '/suppliers?category=ציוד מטבח',
      cta: 'לציוד ותפעול',
    },
    {
      title: 'שירותים לעסק',
      text: 'ספקי שירות, תמיכה, תחזוקה ופתרונות לעסקי אירוח.',
      href: '/suppliers?category=שירותים לעסקים',
      cta: 'לשירותים',
    },
  ]

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map(item => (
        <Link
          key={item.title}
          href={item.href}
          className="group rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow-soft)]"
        >
          <h3 className="text-base font-bold text-[var(--foreground)] mb-1">{item.title}</h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{item.text}</p>
          <span className="text-sm font-bold text-[var(--accent-dark)] group-hover:text-[var(--brand)]">
            {item.cta} ←
          </span>
        </Link>
      ))}
    </div>
  )
}

function SectionHeader({
  title,
  linkHref,
  linkLabel,
}: {
  title: string
  linkHref?: string
  linkLabel?: string
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-4 md:mb-5">
      <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)] leading-tight">{title}</h2>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="text-sm text-[var(--accent)] hover:text-[var(--accent-dark)] font-medium transition-colors whitespace-nowrap"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}

/**
 * Horizontal swipeable rail on mobile (cards peek to show more), grid on desktop.
 */
function SupplierRail({ suppliers }: { suppliers: SupplierCard[] }) {
  return (
    <>
      {/* Mobile: swipeable horizontal rail */}
      <div className="md:hidden -mx-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide touch-scroll snap-x snap-mandatory pb-3 px-4">
          {suppliers.map(s => (
            <div key={s.id} className="flex-shrink-0 w-[min(82vw,340px)] snap-start">
              <SupplierCardComponent supplier={s} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: static grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {suppliers.map(s => (
          <SupplierCardComponent key={s.id} supplier={s} />
        ))}
      </div>
    </>
  )
}

const CATEGORY_FALLBACKS = [
  'מזון',
  'ירקות ופירות',
  'בשר ודגים',
  'חד״פ ואריזות',
  'ציוד מטבח',
  'ניקיון',
  'שירותים לעסקים',
]

/**
 * Mobile: horizontal snap rail where each tile shows the next one peeking.
 * Desktop: 7-col grid.
 */
function CategoryRail({ categories }: { categories: Category[] }) {
  const items =
    categories.length > 0
      ? categories.map(c => ({ label: c.labelHe, slug: c.slug }))
      : CATEGORY_FALLBACKS.map(l => ({ label: l, slug: l }))

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden -mx-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide touch-scroll snap-x snap-mandatory pb-2 px-4">
          {items.map(item => (
            <Link
              key={item.label}
              href={`/suppliers?category=${encodeURIComponent(item.label)}`}
              className="group flex-shrink-0 snap-start flex flex-col items-center gap-2.5 w-[88px] min-h-[104px] py-4 px-2 bg-white rounded-2xl border border-[var(--border)] shadow-sm hover:border-[var(--accent)] active:scale-95 transition-all duration-150 text-center"
            >
              <span className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors duration-150">
                <CategoryIcon category={item.label} className="w-6 h-6" />
              </span>
              <span className="text-[11px] font-semibold text-[var(--text-body)] leading-tight group-hover:text-[var(--accent)] transition-colors duration-150">
                <span className="line-clamp-2">{item.label}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-7 gap-3">
        {items.map(item => (
          <Link
            key={item.label}
            href={`/suppliers?category=${encodeURIComponent(item.label)}`}
            className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-[var(--shadow-soft)] hover:-translate-y-1 active:scale-95 transition-all duration-200 text-center"
          >
            <span className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors duration-200">
              <CategoryIcon category={item.label} className="w-7 h-7" />
            </span>
            <span className="text-xs font-semibold text-[var(--text-body)] leading-tight group-hover:text-[var(--accent)] transition-colors duration-200">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}

/**
 * Mobile: single-row horizontal scroll. Desktop: flex-wrap.
 */
function RegionRail({ regions }: { regions: Region[] }) {
  const displayRegions =
    regions.length > 0
      ? regions
      : [
          { id: '1', slug: 'merkaz', labelHe: 'מרכז', sortOrder: 1, active: true },
          { id: '2', slug: 'tel-aviv', labelHe: 'תל אביב', sortOrder: 2, active: true },
          { id: '3', slug: 'haifa', labelHe: 'חיפה', sortOrder: 3, active: true },
          { id: '4', slug: 'yerushalayim', labelHe: 'ירושלים', sortOrder: 4, active: true },
          { id: '5', slug: 'tsafon', labelHe: 'צפון', sortOrder: 5, active: true },
          { id: '6', slug: 'darom', labelHe: 'דרום', sortOrder: 6, active: true },
        ]

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden -mx-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide touch-scroll pb-1 px-4">
          {displayRegions.map(r => (
            <Link
              key={r.id}
              href={`/suppliers?region=${encodeURIComponent(r.labelHe)}`}
              className="flex-shrink-0 px-4 py-2.5 bg-white border border-[var(--border)] rounded-full text-sm font-medium text-[var(--text-body)] hover:bg-[var(--brand-light)] hover:text-[var(--brand)] hover:border-[var(--brand)] active:scale-95 transition-all duration-150"
            >
              {r.labelHe}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex flex-wrap gap-2">
        {displayRegions.map(r => (
          <Link
            key={r.id}
            href={`/suppliers?region=${encodeURIComponent(r.labelHe)}`}
            className="px-4 py-2 bg-white border border-[var(--border)] rounded-full text-sm font-medium text-[var(--text-body)] hover:bg-[var(--brand-light)] hover:text-[var(--brand)] hover:border-[var(--brand)] hover:shadow-sm active:scale-95 transition-all duration-150"
          >
            {r.labelHe}
          </Link>
        ))}
      </div>
    </>
  )
}
