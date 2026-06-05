import { getAllRegionsAdmin } from '@/lib/db/regions'
import { RegionManager } from './RegionManager'

export default async function RegionsPage() {
  const regions = await getAllRegionsAdmin()
  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold">ניהול אזורים</h1>
      <RegionManager initialRegions={regions} />
    </div>
  )
}
