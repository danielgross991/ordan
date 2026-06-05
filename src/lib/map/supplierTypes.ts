export type LatLng = [number, number]
export type LngLat = [number, number]

export interface DeliveryRegion {
  id: string
  slug: string
  nameHebrew: string
  polygon: LatLng[]
  geoPolygon: LngLat[]
  center: LatLng
  zoomLevel: number
  cities: string[]
  supplierIds: string[]
  color: string
  icon: string
}

export interface Supplier {
  id: string
  slug: string
  name: string
  logoUrl: string
  description: string
  categories: string[]
  phone: string
  whatsappUrl: string
  websiteUrl: string
  minimumOrder: number | null
  deliveryDays: string[]
  cityCoverage: string[]
  regionIds: string[]
  isRecommended: boolean
  isVerified: boolean
}

export type SupplierSort = 'recommended' | 'alphabetical' | 'minimumOrder'

export interface UserLocation {
  lat: number
  lng: number
  regionId: string | null
}
