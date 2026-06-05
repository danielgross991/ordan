'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createCategoryAction, updateCategoryAction } from '@/actions/categoryActions'
import type { Category } from '@/lib/domain/category'

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [isPending, startTransition] = useTransition()
  const [newLabel, setNewLabel] = useState('')
  const [newIcon, setNewIcon] = useState('')
  const [newSlug, setNewSlug] = useState('')

  const handleAdd = () => {
    if (!newLabel.trim()) return
    startTransition(async () => {
      const cat = await createCategoryAction({
        slug: newSlug || newLabel.toLowerCase().replace(/\s+/g, '-'),
        labelHe: newLabel,
        description: null,
        icon: newIcon || null,
        parentId: null,
        sortOrder: categories.length + 1,
        active: true,
      })
      setCategories(prev => [...prev, cat])
      setNewLabel('')
      setNewIcon('')
      setNewSlug('')
    })
  }

  const toggleActive = (id: string, active: boolean) => {
    startTransition(async () => {
      await updateCategoryAction(id, { active })
      setCategories(prev => prev.map(c => (c.id === id ? { ...c, active } : c)))
    })
  }

  return (
    <div className="space-y-4">
      {/* Add form */}
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-5">
        <h2 className="font-semibold mb-4">הוסף קטגוריה</h2>
        <div className="flex gap-3 flex-wrap">
          <div className="w-16">
            <Input
              label="אייקון"
              value={newIcon}
              onChange={e => setNewIcon(e.target.value)}
              placeholder="🥗"
            />
          </div>
          <div className="flex-1 min-w-40">
            <Input
              label="שם קטגוריה"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="מזון"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAdd} loading={isPending} disabled={!newLabel.trim()}>
              הוסף
            </Button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
        {categories.length === 0 ? (
          <p className="p-6 text-center text-[var(--muted)] text-sm">אין קטגוריות עדיין</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-[var(--border)] text-right">
                <th className="px-4 py-3 font-semibold text-gray-600">אייקון</th>
                <th className="px-4 py-3 font-semibold text-gray-600">שם</th>
                <th className="px-4 py-3 font-semibold text-gray-600">סלאג</th>
                <th className="px-4 py-3 font-semibold text-gray-600">סטטוס</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {categories.map(c => (
                <tr key={c.id} className={`hover:bg-[var(--background)] transition-colors ${c.active ? '' : 'opacity-50'}`}>
                  <td className="px-4 py-3 text-xl">{c.icon ?? '—'}</td>
                  <td className="px-4 py-3 font-medium">{c.labelHe}</td>
                  <td className="px-4 py-3 text-[var(--muted)] font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(c.id, !c.active)}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                        c.active
                          ? 'bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-700'
                          : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700'
                      }`}
                    >
                      {c.active ? 'פעיל' : 'לא פעיל'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
