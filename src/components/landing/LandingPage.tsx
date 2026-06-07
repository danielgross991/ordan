import Link from 'next/link'
import { LogoMarquee } from '@/components/public/LogoMarquee'
import { OrdanLogo } from '@/components/public/OrdanLogo'
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
    // Fullscreen overlay: covers the (site) layout header so visitor has zero
    // distractions from the sign-up flow. Scroll happens inside this container.
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white" dir="rtl" style={{ overscrollBehavior: 'contain' }}>
      {/* Minimal in-landing top bar (logo + sign-in only) */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[var(--border)]/60">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <OrdanLogo size="sm" />
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[var(--brand)] text-white rounded-xl font-bold text-sm hover:bg-[var(--brand-dark)] active:scale-95 transition-all min-h-[40px]"
          >
            <GoogleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">כניסה</span>
          </Link>
        </div>
      </div>

      <main>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pt-12 md:pt-20 pb-20 md:pb-32 px-4">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 50% at 20% 0%, var(--brand-light) 0%, transparent 60%), radial-gradient(45% 40% at 95% 30%, var(--accent-light) 0%, transparent 65%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <FadeInOnScroll>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[var(--border)] text-xs font-bold text-[var(--brand)] shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {supplierCount}+ ספקים פעילים בכל הארץ
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={80}>
              <h1 className="text-[2.75rem] sm:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tight text-[var(--foreground)] mb-6">
                הספק הנכון.<br />
                <span className="text-[var(--accent)]">בלחיצה אחת.</span>
              </h1>
            </FadeInOnScroll>

            <FadeInOnScroll delay={160}>
              <p className="text-lg md:text-2xl text-[var(--muted)] max-w-2xl leading-relaxed mb-10 font-medium">
                פלטפורמת ה-B2B המובילה למסעדנים, מלונאים וקייטרינג בישראל.<br className="hidden md:block" />
                ספקי מזון, ציוד וניקיון — מאומתים, מסוננים, מותאמים אליך.
              </p>
            </FadeInOnScroll>

            <FadeInOnScroll delay={240}>
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[var(--brand)] text-white rounded-2xl font-bold text-base hover:bg-[var(--brand-dark)] shadow-lg shadow-[var(--brand)]/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all min-h-[56px] w-full sm:w-auto"
                >
                  <GoogleIcon className="w-5 h-5" />
                  כניסה חינמית עם Google
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-transparent text-[var(--foreground)] rounded-2xl font-bold text-base hover:bg-[var(--surface)] active:scale-[0.98] transition-all min-h-[56px] w-full sm:w-auto"
                >
                  גלה איך זה עובד ↓
                </Link>
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={340}>
              <div className="mt-14 grid grid-cols-3 gap-4 md:gap-10 max-w-2xl">
                <Stat label="ספקים פעילים" value={supplierCount} />
                <Stat label="קטגוריות" value={categoryCount} />
                <Stat label="אזורי שירות" value={regionCount} />
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ── Trust strip / Logo marquee ─────────────────────────── */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)] py-10">
        <FadeInOnScroll>
          <p className="text-center text-[11px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-6">
            ספקים מובילים על הפלטפורמה
          </p>
          <LogoMarquee suppliers={suppliers} />
        </FadeInOnScroll>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeInOnScroll>
            <div className="max-w-2xl mb-14 md:mb-20">
              <span className="inline-block text-xs font-black uppercase tracking-[0.15em] text-[var(--accent)] mb-4">
                כל הכלים
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-[var(--foreground)] mb-5 tracking-tight leading-[1.05]">
                ניהול ספקים אמיתי,<br />
                <span className="text-[var(--muted)]">בלי אקסל</span>
              </h2>
              <p className="text-lg text-[var(--muted)] leading-relaxed">
                גלה ספקים, סנן, שמור, צור קשר — הכל בממשק אחד נקי.
              </p>
            </div>
          </FadeInOnScroll>

          {/* Big feature row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <FadeInOnScroll delay={0}>
              <BigFeature
                tag="חיפוש"
                title="מנוע חיפוש חכם"
                description="התחל להקליד וקבל הצעות חיות מספקים, קטגוריות ואזורים. סינון מתקדם לפי סוג עסק, כשרות, אזורי אספקה, ומאומתים בלבד."
                icon={<SearchIcon />}
                bgClass="bg-[var(--brand-light)]"
              />
            </FadeInOnScroll>
            <FadeInOnScroll delay={120}>
              <BigFeature
                tag="גילוי"
                title="מפת ישראל חיה"
                description="מפה אינטראקטיבית של אזורי האספקה בישראל. לחץ על אזור ותראה מיד מי מספק לשם — בלי לחפש."
                icon={<MapIcon />}
                bgClass="bg-[var(--accent-light)]"
              />
            </FadeInOnScroll>
          </div>

          {/* Smaller feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <FadeInOnScroll delay={0}>
              <SmallFeature icon={<HeartIcon />} title="מועדפים" description="שמור ספקים לרשימה אישית" />
            </FadeInOnScroll>
            <FadeInOnScroll delay={80}>
              <SmallFeature icon={<ShieldIcon />} title="מאומתים" description="כל ספק נבדק לפני פרסום" />
            </FadeInOnScroll>
            <FadeInOnScroll delay={160}>
              <SmallFeature icon={<PhoneIcon />} title="קשר ישיר" description="טלפון, ווצאפ, מייל — בקליק" />
            </FadeInOnScroll>
            <FadeInOnScroll delay={240}>
              <SmallFeature icon={<SparklesIcon />} title="חינם" description="ללא עמלות, ללא תשלום" />
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 md:py-32 px-4 bg-[var(--background)] scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <FadeInOnScroll>
            <div className="text-center mb-14 md:mb-20">
              <span className="inline-block text-xs font-black uppercase tracking-[0.15em] text-[var(--accent)] mb-4">
                התחלה ב-3 שלבים
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-[var(--foreground)] tracking-tight leading-[1.05]">
                פשוט. מהיר.<br />
                <span className="text-[var(--brand)]">חינם.</span>
              </h2>
            </div>
          </FadeInOnScroll>

          <div className="space-y-4 md:space-y-6">
            <StepRow
              number="1"
              title="התחבר עם Google"
              description="10 שניות, ללא טפסים מסובכים, ללא סיסמאות. כניסה מאובטחת עם החשבון שכבר יש לך."
              direction="right"
            />
            <StepRow
              number="2"
              title="ספר על העסק שלך"
              description="שם המסעדה, מיקום, ואיזה ספקים אתה מחפש. נתאים את התוכן בדיוק לצרכים שלך."
              direction="left"
            />
            <StepRow
              number="3"
              title="גלה, סנן, התקשר"
              description="חיפוש לפי אזור, קטגוריה, סוג עסק — וצור קשר ישיר עם הספק בטלפון או ווצאפ."
              direction="right"
            />
          </div>
        </div>
      </section>

      {/* ── FOR SUPPLIERS ─────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 bg-[var(--brand-dark)] text-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(60% 50% at 80% 50%, var(--accent) 0%, transparent 60%), radial-gradient(40% 40% at 10% 80%, var(--brand-mid) 0%, transparent 60%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <FadeInOnScroll>
            <span className="inline-block text-xs font-black uppercase tracking-[0.15em] text-[var(--accent-light)] mb-4">
              לספקים
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.05]">
              אתה ספק? בוא תוכר<br />
              ע&quot;י אלפי עסקי מזון.
            </h2>
            <p className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              הצג את הקטגוריות שאתה מכסה ואת אזורי האספקה. מסעדנים ומלונאים ימצאו אותך בדיוק כשהם צריכים — ללא עמלות, ללא דמי חברות.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[var(--accent)] text-white rounded-2xl font-bold text-base hover:bg-[var(--accent-dark)] shadow-xl shadow-[var(--accent)]/40 active:scale-[0.98] transition-all min-h-[56px]"
            >
              <GoogleIcon className="w-5 h-5" />
              הירשם כספק עם Google
            </Link>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInOnScroll>
            <h2 className="text-4xl md:text-6xl font-black text-[var(--foreground)] mb-5 tracking-tight leading-[1.05]">
              מוכן להתחיל?
            </h2>
            <p className="text-lg md:text-xl text-[var(--muted)] mb-10 max-w-xl mx-auto">
              הצטרף לפלטפורמה החינמית של אורדן.<br className="hidden sm:block" />
              ספקים מאומתים מחכים — כניסה תוך 10 שניות.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-5 bg-[var(--brand)] text-white rounded-2xl font-bold text-base hover:bg-[var(--brand-dark)] shadow-xl shadow-[var(--brand)]/30 hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98] transition-all min-h-[60px]"
            >
              <GoogleIcon className="w-5 h-5" />
              כניסה חינמית עם Google
            </Link>
            <p className="text-xs text-[var(--muted)] mt-5 font-medium">
              ללא כרטיס אשראי. ללא התחייבות.
            </p>
          </FadeInOnScroll>
        </div>
        <FadeInOnScroll delay={120}>
          <footer className="max-w-6xl mx-auto mt-24 pt-8 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} אורדן · פלטפורמת ספקים B2B לתעשיית המזון והאירוח
          </footer>
        </FadeInOnScroll>
      </section>
      </main>
    </div>
  )
}

/* ─── Sub-components ────────────────────────────────────────── */

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-black text-[var(--foreground)] leading-tight">
        {value.toLocaleString('he-IL')}
        <span className="text-[var(--accent)]">+</span>
      </div>
      <div className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-[var(--muted)] mt-1">{label}</div>
    </div>
  )
}

function BigFeature({
  tag,
  title,
  description,
  icon,
  bgClass,
}: {
  tag: string
  title: string
  description: string
  icon: React.ReactNode
  bgClass: string
}) {
  return (
    <div className={`group h-full ${bgClass} rounded-3xl p-7 md:p-9 hover:-translate-y-1 transition-all duration-300 border border-[var(--border)]/50 overflow-hidden relative`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(50% 50% at 80% 20%, rgba(255,255,255,0.5) 0%, transparent 60%)' }}
      />
      <div className="relative">
        <span className="inline-block text-[11px] font-black uppercase tracking-[0.15em] text-[var(--brand)]/70 mb-5">
          {tag}
        </span>
        <div className="w-14 h-14 rounded-2xl bg-white text-[var(--brand)] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-[var(--foreground)] mb-3 leading-tight">{title}</h3>
        <p className="text-base text-[var(--muted)] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function SmallFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="h-full bg-white border border-[var(--border)] rounded-2xl p-5 md:p-6 hover:border-[var(--brand)] hover:shadow-md transition-all duration-300">
      <div className="w-11 h-11 rounded-xl bg-[var(--surface)] text-[var(--brand)] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-base font-black text-[var(--foreground)] mb-1.5">{title}</h4>
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-8 bg-white rounded-3xl p-7 md:p-10 border border-[var(--border)] hover:border-[var(--brand)] hover:shadow-lg transition-all duration-300">
        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-[var(--brand)] via-[var(--brand-mid)] to-[var(--accent)] text-white text-4xl md:text-5xl font-black flex items-center justify-center shadow-lg shadow-[var(--brand)]/30">
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl md:text-3xl font-black text-[var(--foreground)] mb-2 leading-tight">{title}</h3>
          <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed">{description}</p>
        </div>
      </div>
    </FadeInOnScroll>
  )
}

/* ─── Icons (Lucide-style strokes) ────────────────────────── */

function GoogleIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
      <path d="M9 3v15M15 6v15" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7a2 2 0 0 1 1.72 2.03z" />
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.94 14.34 12 22l2.06-7.66L22 12l-7.94-2.34L12 2l-2.06 7.66L2 12z" />
    </svg>
  )
}
