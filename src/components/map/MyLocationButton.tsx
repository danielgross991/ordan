'use client'

interface MyLocationButtonProps {
  isLocating: boolean
  onLocate: () => void
}

export function MyLocationButton({ isLocating, onLocate }: MyLocationButtonProps) {
  return (
    <button
      type="button"
      onClick={onLocate}
      disabled={isLocating}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-black !text-white shadow-[0_14px_35px_rgba(23,39,69,0.18)] transition hover:bg-[var(--brand-dark)] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 10.5h.01" />
      </svg>
      {isLocating ? 'מאתרים...' : 'איתור המיקום שלי'}
    </button>
  )
}
