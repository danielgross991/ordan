import { CsvImportClient } from './CsvImportClient'

export default function CsvImportPage() {
  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">יבוא ספקים מ-CSV</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          העלה קובץ CSV, בדוק את הנתונים, ואשר את הייבוא.
        </p>
      </div>
      <CsvImportClient />
    </div>
  )
}
