export interface Region {
  id: string
  slug: string
  labelHe: string
  sortOrder: number
  active: boolean
}

export const SEED_REGIONS: Omit<Region, 'id'>[] = [
  { slug: 'tsafon', labelHe: 'צפון', sortOrder: 1, active: true },
  { slug: 'haifa-kriot', labelHe: 'חיפה והקריות', sortOrder: 2, active: true },
  { slug: 'sharon', labelHe: 'השרון', sortOrder: 3, active: true },
  { slug: 'merkaz', labelHe: 'מרכז', sortOrder: 4, active: true },
  { slug: 'tel-aviv', labelHe: 'תל אביב וגוש דן', sortOrder: 5, active: true },
  { slug: 'yerushalayim', labelHe: 'ירושלים והסביבה', sortOrder: 6, active: true },
  { slug: 'shfela', labelHe: 'שפלה', sortOrder: 7, active: true },
  { slug: 'darom', labelHe: 'דרום', sortOrder: 8, active: true },
  { slug: 'kol-haaretz', labelHe: 'כל הארץ', sortOrder: 9, active: true },
]
