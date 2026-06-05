import Image from 'next/image'

interface OrdanLogoProps {
  size?: 'sm' | 'md' | 'lg'
  withLabel?: boolean
  className?: string
}

const sizes = {
  sm: { box: 'h-9 w-9', image: 36, label: 'text-lg' },
  md: { box: 'h-11 w-11', image: 44, label: 'text-xl' },
  lg: { box: 'h-16 w-16', image: 64, label: 'text-2xl' },
}

export function OrdanLogo({ size = 'md', withLabel = false, className = '' }: OrdanLogoProps) {
  const s = sizes[size]

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className={`${s.box} relative inline-flex overflow-hidden rounded-2xl shadow-sm`}>
        <Image
          src="/ordan-logo.png"
          alt="Ordan"
          width={s.image}
          height={s.image}
          className="h-full w-full object-cover"
          priority={size === 'lg'}
        />
      </span>
      {withLabel && (
        <span className={`${s.label} font-black tracking-tight text-[var(--foreground)]`}>
          Ordan
        </span>
      )}
    </span>
  )
}
