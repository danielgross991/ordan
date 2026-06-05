'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createRegionAction, updateRegionAction } from '@/actions/regionActions'
import type { Region } from '@/lib/domain/region'

export function RegionManager({ initialRegions }: { initialRegions: Region[] }) {
  const [regions, setRegions] = useState(initialRegions)
  const [isPending, startTransition] = useTransition()
  const [newLabel, setNewLabel] = useState('')

  const handleAdd = () => {
    if (!newLabel.trim()) return
    startTransition(async () => {
      const region = await createRegionAction({
        slug: newLabel.toLowerCase().replace(/\s+/g, '-'),
        labelHe: newLabel,
        sortOrder: regions.length + 1,
        active: true,
      })
      setRegions(prev => [...prev, region])
      setNewLabel('')
    })
  }

  const toggleActive = (id: string, active: boolean) => {
    startTransition(async () => {
      await updateRegionAction(id, { active })
      setRegions(prev => prev.map(r => (r.id === id ? { ...r, active } : r)))
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-[var(--border)] p-5">
        <h2 className="font-semibold mb-4">הוסף אזור</h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="שם האזור"
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAdd} loading={isPending} disabled={!newLabel.trim()}>
              הוסף
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
        {regions.length === 0 ? (
          <p className="p-6 text-center text-[var(--muted)] text-sm">אין אזורים עדיין</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-[var(--border)] text-right">
                <th className="px-4 py-3 font-semibold text-gray-600">שם</th>
                <th className="px-4 py-3 font-semibold text-gray-600">סלאג</th>
                <th className="px-4 py-3 font-semibold text-gray-600">סטטוס</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {regions.map(r => (
                <tr key={r.id} className={`hover:bg-[var(--background)] transition-colors ${r.active ? '' : 'opacity-50'}`}>
                  <td className="px-4 py-3 font-medium">{r.labelHe}</td>
                  <td className="px-4 py-3 text-[var(--muted)] font-mono text-xs">{r.slug}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(r.id, !r.active)}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                        r.active
                          ? 'bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-700'
                          : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700'
                      }`}
                    >
                      {r.active ? 'פעיל' : 'לא פעיל'}
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
