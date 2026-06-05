import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">הדף לא נמצא</h1>
        <p className="text-[var(--muted)] mb-6">הדף שחיפשת אינו קיים.</p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-[var(--brand)] text-white rounded-xl font-medium hover:bg-[var(--brand-dark)] transition-colors"
        >
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  )
}
