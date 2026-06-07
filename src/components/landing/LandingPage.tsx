import Link from 'next/link'
import { LogoMarquee } from '@/components/public/LogoMarquee'
import { FadeInOnScroll } from './FadeInOnScroll'
import type { SupplierCard } from '@/lib/domain/supplier'

interface LandingPageProps {
  supplierCount: number
  categoryCount: number
  regionCount: number
  suppliers: SupplierCard[]
}

export function LandingPage({ supplierCount, categoryCount, regionCount, suppliers }: LandingPageProps) {
  return (
    <div className="overflow-hidden">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-[linear-gradient(180deg,#ffffff_0%,#f3eee3_45%,#ebe2cf_100%)] pt-10 pb-16 md:pt-20 md:pb-28 px-4 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 10%, var(--brand-light) 0, transparent 50%), radial-gradient(circle at 85% 60%, var(--accent-light) 0, transparent 45%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto text-center">
          <FadeInOnScroll>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[var(--border)] text-xs font-bold text-[var(--brand)] shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {supplierCount}+ ספקים פעילים בכל הארץ
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={80}>
            <h1 className="text-[2.5rem] md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-[var(--foreground)] mb-5">
              ספק שמתאים<br />
              <span className="text-[var(--accent)]">לעסק שלך,</span>{' '}
              <span className="text-[var(--brand-mid)]">בקליק.</span>
            </h1>
          </FadeInOnScroll>

          <FadeInOnScroll delay={160}>
            <p className="text-base md:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed mb-8">
              פלטפורמת ה-B2B המובילה למסעדנים, מלונאים וקייטרינג. גלה ספקים מאומתים של מזון, ציוד, ניקיון ושירותים — לפי אזור, קטגוריה, וסוג העסק שלך.
            </p>
          </FadeInOnScroll>

          <FadeInOnScroll delay={240}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[var(--brand)] text-white rounded-2xl font-bold text-sm hover:bg-[var(--brand-dark)] shadow-lg hover:shadow-xl active:scale-[0.98] transition-all min-h-[52px] w-full sm:w-auto"
              >
                <GoogleIcon className="w-5 h-5" />
                כניסה חינמית עם Google
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[var(--border)] text-[var(--foreground)] rounded-2xl font-bold text-sm hover:border-[var(--brand)] active:scale-[0.98] transition-all min-h-[52px] w-full sm:w-auto"
              >
                איך זה עובד? ↓
              </Link>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={340}>
            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-[var(--muted)]">
              <Stat label="ספקים" value={supplierCount} />
              <span className="w-px h-8 bg-[var(--border)]" />
              <Stat label="קטגוריות" value={categoryCount} />
              <span className="w-px h-8 bg-[var(--border)]" />
              <Stat label="אזורים" value={regionCount} />
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ── Trust strip / Logo marquee ─────────────────────────── */}
      <section className="bg-white border-y border-[var(--border)] py-8">
        <FadeInOnScroll>
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-5">
            ספקים שעובדים איתנו
          </p>
          <LogoMarquee suppliers={suppliers} />
        </FadeInOnScroll>
      </section>

      {/* ── FEATURES (what we do) ──────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 bg-[var(--background)]">
        <div className="max-w-6xl mx-auto">
          <FadeInOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)] mb-4 tracking-tight">
                כל מה שאתה צריך,
                <br />
                <span className="text-[var(--accent)]">במקום אחד</span>
              </h2>
              <p className="text-base md:text-lg text-[var(--muted)] max-w-xl mx-auto">
                ניהול ספקים, מועדפים, חיפוש חכם ומפת אזורים — חסכון בזמן בכל יום
              </p>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <FadeInOnScroll delay={0}>
              <FeatureCard
                icon="🔍"
                title="חיפוש חכם"
                description="חפש לפי שם, קטגוריה, אזור או סוג עסק. מנוע חיפוש סמנטי שמבין מה אתה צריך."
                accent="brand"
              />
            </FadeInOnScroll>
            <FadeInOnScroll delay={120}>
              <FeatureCard
                icon="🗺️"
                title="מפת אזורי אספקה"
                description="ראה ספקים על מפה אינטראקטיבית של ישראל. סנן לפי אזור והבן מי מספק אליך."
                accent="accent"
              />
            </FadeInOnScroll>
            <FadeInOnScroll delay={240}>
              <FeatureCard
                icon="❤️"
                title="הספקים שלי"
                description="שמור ספקים שאהבת לרשימה אישית. גישה מהירה בכל זמן, ללא צורך לחפש שוב."
                accent="brand"
              />
            </FadeInOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
            <FadeInOnScroll delay={0}>
              <FeatureCard
                icon="✓"
                title="ספקים מאומתים"
                description="כל ספק עובר בדיקה לפני שמופיע. תג 'מאומת' = מידע עדכני ואמין."
                accent="green"
              />
            </FadeInOnScroll>
            <FadeInOnScroll delay={120}>
              <FeatureCard
                icon="📞"
                title="קשר ישיר"
                description="טלפון, וואטסאפ, מייל ואתר — בקליק אחד. ללא תיווך, ללא עמלות."
                accent="accent"
              />
            </FadeInOnScroll>
            <FadeInOnScroll delay={240}>
              <FeatureCard
                icon="🆓"
                title="חינם לחלוטין"
                description="הפלטפורמה חינמית למסעדנים ולקוחות. בלי דמי חברות, בלי תשלום נסתר."
                accent="brand"
              />
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <FadeInOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3">
                איך זה עובד
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)] mb-4 tracking-tight">
                3 שלבים פשוטים<br />עד שתמצא את הספק הנכון
              </h2>
            </div>
          </FadeInOnScroll>

          <div className="space-y-6 md:space-y-12">
            <StepRow
              number="1"
              title="הירשם בקליק עם Google"
              description="ללא טפסים מסובכים. כניסה מאובטחת עם חשבון Google שלך — 10 שניות בלבד."
              direction="right"
            />
            <StepRow
              number="2"
              title="ספר לנו על העסק שלך"
              description="שם המסעדה, מיקום, וסוג הספקים שאתה מחפש. נתאים את התוכן בדיוק לך."
              direction="left"
            />
            <StepRow
              number="3"
              title="גלה ספקים מותאמים"
              description="חיפוש לפי אזור, קטגוריה, סוג עסק — ופנה אליהם ישירות בטלפון או וואטסאפ."
              direction="right"
            />
          </div>
        </div>
      </section>

      {/* ── FOR SUPPLIERS ─────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 bg-[var(--brand-dark)] text-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #b96b43 0, transparent 60%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <FadeInOnScroll>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--accent-light)] mb-3">
              לספקים
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight">
              אתה ספק? בוא תוכר<br />ע&quot;י אלפי עסקי מזון
            </h2>
            <p className="text-base md:text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              הצג את העסק שלך, את הקטגוריות שאתה מכסה ואת אזורי האספקה. מסעדנים, מלונות וקייטרינג ימצאו אותך בדיוק כשהם צריכים.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[var(--accent)] text-white rounded-2xl font-bold text-sm hover:bg-[var(--accent-dark)] shadow-xl active:scale-[0.98] transition-all min-h-[52px]"
            >
              <GoogleIcon className="w-5 h-5" />
              הירשם כספק עם Google
            </Link>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 bg-[var(--background)]">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInOnScroll>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)] mb-4 tracking-tight">
              מוכן להתחיל?
            </h2>
            <p className="text-base md:text-lg text-[var(--muted)] mb-8 max-w-xl mx-auto">
              הצטרף לפלטפורמה החינמית של אורדן ותתחיל למצוא ספקים מאומתים תוך דקה
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[var(--brand)] text-white rounded-2xl font-bold text-base hover:bg-[var(--brand-dark)] shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all min-h-[56px]"
            >
              <GoogleIcon className="w-5 h-5" />
              כניסה חינמית עם Google
            </Link>
            <p className="text-xs text-[var(--muted)] mt-4">
              ללא כרטיס אשראי. ללא התחייבות.
            </p>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  )
}

/* ─── Sub-components ────────────────────────────────────────── */

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-black text-[var(--foreground)] leading-tight">
        {value.toLocaleString('he-IL')}
      </div>
      <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{label}</div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  accent,
}: {
  icon: string
  title: string
  description: string
  accent: 'brand' | 'accent' | 'green'
}) {
  const accentBg = {
    brand: 'bg-[var(--brand-light)] text-[var(--brand)]',
    accent: 'bg-[var(--accent-light)] text-[var(--accent)]',
    green: 'bg-emerald-50 text-emerald-700',
  }[accent]

  return (
    <div className="group h-full bg-white rounded-3xl border border-[var(--border)] p-6 md:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`w-14 h-14 rounded-2xl ${accentBg} text-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-black text-[var(--foreground)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{description}</p>
    </div>
  )
}

function StepRow({
  number,
  title,
  description,
  direction,
}: {
  number: string
  title: string
  description: string
  direction: 'right' | 'left'
}) {
  return (
    <FadeInOnScroll direction={direction}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8 bg-[var(--background)] rounded-3xl p-6 md:p-8 border border-[var(--border)]">
        <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-mid)] text-white text-3xl md:text-4xl font-black flex items-center justify-center shadow-lg">
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl md:text-2xl font-black text-[var(--foreground)] mb-1.5">{title}</h3>
          <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">{description}</p>
        </div>
      </div>
    </FadeInOnScroll>
  )
}

function GoogleIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
