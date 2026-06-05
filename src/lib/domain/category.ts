export interface Category {
  id: string
  slug: string
  labelHe: string
  description: string | null
  icon: string | null
  parentId: string | null
  sortOrder: number
  active: boolean
}

export const SEED_CATEGORIES: Omit<Category, 'id'>[] = [
  { slug: 'mazon', labelHe: 'מזון', description: null, icon: '🥗', parentId: null, sortOrder: 1, active: true },
  { slug: 'yerakot-perot', labelHe: 'ירקות ופירות', description: null, icon: '🥦', parentId: null, sortOrder: 2, active: true },
  { slug: 'basar-dagim', labelHe: 'בשר ודגים', description: null, icon: '🥩', parentId: null, sortOrder: 3, active: true },
  { slug: 'had-pa-ariza', labelHe: 'חד״פ ואריזות', description: null, icon: '📦', parentId: null, sortOrder: 4, active: true },
  { slug: 'tziyud-mitbach', labelHe: 'ציוד מטבח', description: null, icon: '🍳', parentId: null, sortOrder: 5, active: true },
  { slug: 'nikui', labelHe: 'ניקיון', description: null, icon: '🧹', parentId: null, sortOrder: 6, active: true },
  { slug: 'shrutim-asaim', labelHe: 'שירותים לעסקים', description: null, icon: '💼', parentId: null, sortOrder: 7, active: true },
]
