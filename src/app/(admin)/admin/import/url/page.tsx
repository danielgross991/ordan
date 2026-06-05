import { UrlImportClient } from './UrlImportClient'

export default function UrlImportPage() {
  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">יבוא מ-URL</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          הדבק URL של אתר עסקי. המערכת תחלץ נתונים לסקירה ואישור.
        </p>
      </div>
      <UrlImportClient />
    </div>
  )
}
