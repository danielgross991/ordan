import { getAllCategoriesAdmin } from '@/lib/db/categories'
import { CategoryManager } from './CategoryManager'

export default async function CategoriesPage() {
  const categories = await getAllCategoriesAdmin()

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold">ניהול קטגוריות</h1>
      <CategoryManager initialCategories={categories} />
    </div>
  )
}
