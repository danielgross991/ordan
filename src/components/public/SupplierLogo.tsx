'use client'

import { useState } from 'react'
import Image from 'next/image'
import { normalizeImageUrl } from '@/lib/security/url'

interface SupplierLogoProps {
  logoUrl: string | null
  businessName: string
  categoryIcon: string
  /** px size for the container (square) */
  size: number
  /** Tailwind classes for the container div */
  className?: string
}

export function SupplierLogo({ logoUrl, businessName, categoryIcon, size, className = '' }: SupplierLogoProps) {
  const [imgError, setImgError] = useState(false)
  const safeLogoUrl = normalizeImageUrl(logoUrl)
  const showImage = !!safeLogoUrl && !imgError

  return (
    <div
      className={`bg-[var(--brand-light)] flex items-center justify-center flex-shrink-0 overflow-hidden ${className}`}
    >
      {showImage ? (
        <Image
          src={safeLogoUrl}
          alt={businessName}
          width={size}
          height={size}
          className="w-full h-full object-contain p-1"
          onError={() => setImgError(true)}
          unoptimized
        />
      ) : (
        <span style={{ fontSize: size * 0.45 }}>{categoryIcon}</span>
      )}
    </div>
  )
}
