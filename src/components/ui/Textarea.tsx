import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, className, id, ...props }: TextareaProps) {
  const textareaId = id ?? label

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={4}
        className={cn(
          'w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 md:py-2 text-base md:text-sm resize-y',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent',
          error ? 'border-red-400 focus:ring-red-400' : '',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-[var(--muted)]">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
