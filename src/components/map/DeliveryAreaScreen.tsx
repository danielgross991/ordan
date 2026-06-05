'use client'

import { useMemo, useRef, useState } from 'react'
import type { SupplierSort, UserLocation } from '@/lib/map/supplierTypes'
import { mockRegions } from '@/lib/map/mockRegions'
import { mockSuppliers } from '@/lib/map/mockSuppliers'
import { IsraelDeliveryMapClient } from './IsraelDeliveryMap'
import { SelectedRegionSummary } from './SelectedRegionSummary'
import { SupplierFilters } from './SupplierFilters'
import { SupplierResults } from './SupplierResults'

type SelectionSource = 'manual' | 'gps'

export function DeliveryAreaScreen() {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [selectionSource, setSelectionSource] = useState<SelectionSource>('manual')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState<SupplierSort>('recommended')
  const [isLocating, setIsLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState('')
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const selectedRegion = useMemo(
    () => mockRegions.find(region => region.id === selectedRegionId) ?? null,
    [selectedRegionId]
  )

  const visibleSuppliers = useMemo(() => {
    if (!selectedRegionId) return []
    const normalizedSearch = search.trim().toLowerCase()

    return mockSuppliers
      .filter(supplier => {
        const matchesRegion = supplier.regionIds.includes(selectedRegionId)
        const matchesCategory = !category || supplier.categories.includes(category)
        const searchable = [
          supplier.name,
          supplier.description,
          supplier.categories.join(' '),
          supplier.cityCoverage.join(' '),
        ]
          .join(' ')
          .toLowerCase()
        const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch)
        return matchesRegion && matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        if (sort === 'alphabetical') return a.name.localeCompare(b.name, 'he')
        if (sort === 'minimumOrder') return (a.minimumOrder ?? 0) - (b.minimumOrder ?? 0)
        return Number(b.isRecommended) - Number(a.isRecommended) || Number(b.isVerified) - Number(a.isVerified)
      })
  }, [category, search, selectedRegionId, sort])

  function scrollToResults(delay = 180) {
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, delay)
  }

  function selectRegion(regionId: string, source: SelectionSource = 'manual') {
    setSelectedRegionId(regionId)
    setSelectionSource(source)
    setLocationMessage('')
    scrollToResults()
  }

  function resetMap() {
    setSelectedRegionId(null)
    setSelectionSource('manual')
    setSearch('')
    setCategory('')
    setSort('recommended')
    setLocationMessage('')
    setUserLocation(null)
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setLocationMessage('לא הצלחנו לזהות את אזורכם באופן אוטומטי. ניתן לבחור אזור ידנית מהמפה')
      return
    }

    setIsLocating(true)
    setLocationMessage('')
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const region = mockRegions.find(item => pointInPolygon([lng, lat], item.geoPolygon))

        setIsLocating(false)
        setUserLocation({ lat, lng, regionId: region?.id ?? null })

        if (!region) {
          setLocationMessage('לא הצלחנו לזהות את אזורכם באופן אוטומטי. ניתן לבחור אזור ידנית מהמפה')
          return
        }

        setSelectedRegionId(region.id)
        setSelectionSource('gps')
        setLocationMessage(`זיהינו את המיקום באזור ${region.nameHebrew}`)
        scrollToResults()
      },
      error => {
        setIsLocating(false)
        setUserLocation(null)
        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? 'לא ניתנה הרשאה למיקום. ניתן לבחור אזור ידנית מהמפה'
            : 'לא הצלחנו לזהות את אזורכם באופן אוטומטי. ניתן לבחור אזור ידנית מהמפה'
        )
      },
      { enableHighAccuracy: false, timeout: 9000, maximumAge: 1000 * 60 * 10 }
    )
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf7_0%,#f5f3ee_46%,#ebe7df_100%)]" dir="rtl">
      <div className="mx-auto max-w-5xl px-3 py-4 md:px-6 md:py-8">
        <div className="space-y-4 md:space-y-5">
          <IsraelDeliveryMapClient
            regions={mockRegions}
            selectedRegionId={selectedRegionId}
            userLocation={userLocation}
            isLocating={isLocating}
            locationMessage={locationMessage}
            onSelectRegion={selectRegion}
            onLocate={locateUser}
            onReset={resetMap}
          />

          <div ref={resultsRef} className="scroll-mt-24 space-y-4">
            <SelectedRegionSummary selectedRegion={selectedRegion} supplierCount={visibleSuppliers.length} />

            <section className="rounded-t-[2rem] border border-white bg-white/94 p-4 shadow-[0_-14px_60px_rgba(23,39,69,0.10)] md:rounded-[2rem] md:p-5">
              {selectedRegion && (
                <SupplierFilters
                  suppliers={mockSuppliers}
                  search={search}
                  category={category}
                  sort={sort}
                  onSearchChange={setSearch}
                  onCategoryChange={setCategory}
                  onSortChange={setSort}
                />
              )}
              <div className={selectedRegion ? 'mt-4' : ''}>
                <SupplierResults
                  selectedRegion={selectedRegion}
                  suppliers={visibleSuppliers}
                  hasFilters={Boolean(search || category)}
                  selectedByLocation={selectionSource === 'gps'}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

function pointInPolygon(point: [number, number], polygon: Array<[number, number]>): boolean {
  const [x, y] = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }

  return inside
}
