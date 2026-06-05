import React from 'react'

interface IconProps {
  className?: string
}

const SVG = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
)

function FoodIcon({ className }: IconProps) {
  return (
    <SVG className={className}>
      {/* Fork */}
      <path d="M8 3v4M6 5h4M8 7v14" />
      {/* Knife */}
      <path d="M14 3h4a2 2 0 012 2v5h-6V3zM14 10v11" />
    </SVG>
  )
}

function ProduceIcon({ className }: IconProps) {
  return (
    <SVG className={className}>
      <path d="M12 22V13" />
      <path d="M12 13C12 9 8 6 3 6c0 4 3.5 7 9 7z" />
      <path d="M12 13c0-4 4-7 9-7 0 4-3.5 7-9 7z" />
      <path d="M12 6V3" />
    </SVG>
  )
}

function MeatIcon({ className }: IconProps) {
  return (
    <SVG className={className}>
      {/* Fish body */}
      <path d="M6 12c0-4 3-7 6-7s6 3 6 7-3 7-6 7-6-3-6-7z" />
      {/* Tail */}
      <path d="M20 8l2-3M20 16l2 3M20 8l2 3M20 16l2-3" />
      {/* Eye */}
      <circle cx="9" cy="11" r="1" fill="currentColor" stroke="none" />
    </SVG>
  )
}

function PackagingIcon({ className }: IconProps) {
  return (
    <SVG className={className}>
      <path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" />
      <path d="M9 22V12h6v10" />
      <path d="M9 12h6" />
    </SVG>
  )
}

function KitchenIcon({ className }: IconProps) {
  return (
    <SVG className={className}>
      {/* Pot body */}
      <path d="M5 11h14v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8z" />
      {/* Handles */}
      <path d="M5 13H3M19 13h2" />
      {/* Lid */}
      <path d="M4 11a8 8 0 0116 0" />
      {/* Steam */}
      <path d="M9 7V5M12 7V4M15 7V5" />
    </SVG>
  )
}

function CleaningIcon({ className }: IconProps) {
  return (
    <SVG className={className}>
      {/* Bucket */}
      <path d="M6 8h12l-2 13H8L6 8z" />
      {/* Rim */}
      <path d="M4 8h16" />
      {/* Handle */}
      <path d="M10 5a2 2 0 014 0v3" />
      {/* Sparkles */}
      <path d="M17 4l.5 1.5L19 6l-1.5.5L17 8l-.5-1.5L15 6l1.5-.5L17 4z" />
    </SVG>
  )
}

function ServicesIcon({ className }: IconProps) {
  return (
    <SVG className={className}>
      {/* Building */}
      <rect x="3" y="5" width="18" height="16" rx="1" />
      {/* Roof line */}
      <path d="M3 10h18" />
      {/* Top notch */}
      <path d="M8 5V3h8v2" />
      {/* Windows */}
      <path d="M7 14h.01M11 14h.01M15 14h.01M7 18h.01M11 18h.01M15 18h.01" />
    </SVG>
  )
}

function DefaultCategoryIcon({ className }: IconProps) {
  return (
    <SVG className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l3 3" />
    </SVG>
  )
}

const ICON_MAP: Record<string, (props: IconProps) => React.ReactElement> = {
  'מזון': FoodIcon,
  'ירקות ופירות': ProduceIcon,
  'בשר ודגים': MeatIcon,
  'חד״פ ואריזות': PackagingIcon,
  'ציוד מטבח': KitchenIcon,
  'ניקיון': CleaningIcon,
  'שירותים לעסקים': ServicesIcon,
  'שירותים': ServicesIcon,
}

interface CategoryIconProps {
  category: string
  className?: string
}

export function CategoryIcon({ category, className = 'w-7 h-7' }: CategoryIconProps) {
  const Icon = ICON_MAP[category] ?? DefaultCategoryIcon
  return <Icon className={className} />
}
