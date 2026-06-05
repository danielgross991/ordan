import type { Metadata } from 'next'
import { DeliveryAreaScreen } from '@/components/map/DeliveryAreaScreen'

export const metadata: Metadata = {
  title: 'מפת אזורי אספקה | אורדן',
}

export default function MapPage() {
  return <DeliveryAreaScreen />
}
