'use client'

import type { DeliveryRegion, UserLocation } from '@/lib/map/supplierTypes'
import { IsraelStylizedMap } from './IsraelStylizedMap'

interface IsraelDeliveryMapProps {
  regions: DeliveryRegion[]
  selectedRegionId: string | null
  userLocation: UserLocation | null
  isLocating: boolean
  locationMessage: string
  onSelectRegion: (regionId: string, source?: 'manual' | 'gps') => void
  onLocate: () => void
  onReset: () => void
}

export function IsraelDeliveryMapClient(props: IsraelDeliveryMapProps) {
  return <IsraelStylizedMap {...props} />
}
