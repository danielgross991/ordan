import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  placeholder?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, placeholder, options, className, id, ...props }: SelectProps) {
  const selectId = id ?? label

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 md:py-2 text-base md:text-sm',
          'focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          error ? 'border-red-400' : '',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
