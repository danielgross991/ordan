'use client'

import type { DeliveryRegion, LatLng, LngLat, UserLocation } from '@/lib/map/supplierTypes'
import { israelOutlineBbox, israelOutlineRings } from '@/lib/map/israelOutline'
import { MyLocationButton } from './MyLocationButton'

interface IsraelStylizedMapProps {
  regions: DeliveryRegion[]
  selectedRegionId: string | null
  userLocation: UserLocation | null
  isLocating: boolean
  locationMessage: string
  onSelectRegion: (regionId: string, source?: 'manual' | 'gps') => void
  onLocate: () => void
  onReset: () => void
}

const VIEWBOX = { width: 360, height: 760 }
const PADDING = { x: 28, y: 18 }
const [minLng, minLat, maxLng, maxLat] = israelOutlineBbox
const MID_LAT_RADIANS = (((minLat + maxLat) / 2) * Math.PI) / 180
const LNG_SCALE = Math.cos(MID_LAT_RADIANS)
const projectedWidth = (maxLng - minLng) * LNG_SCALE
const projectedHeight = maxLat - minLat
const uniformScale = Math.min(
  (VIEWBOX.width - PADDING.x * 2) / projectedWidth,
  (VIEWBOX.height - PADDING.y * 2) / projectedHeight
)
const projectedMapWidth = projectedWidth * uniformScale
const projectedMapHeight = projectedHeight * uniformScale
const offsetX = (VIEWBOX.width - projectedMapWidth) / 2
const offsetY = (VIEWBOX.height - projectedMapHeight) / 2

const labelOffsets: Record<string, [number, number]> = {
  golan: [22, -2],
  'upper-galilee': [-28, 2],
  'lower-galilee': [-10, 6],
  'haifa-krayot': [-40, 0],
  valleys: [34, 2],
  sharon: [-38, 0],
  'tel-aviv-center': [-34, 2],
  shfela: [-36, 8],
  'jerusalem-area': [40, 6],
  'judea-samaria': [46, -4],
  'north-negev': [-28, -2],
  'south-negev': [-2, 16],
  'eilat-arava': [2, 0],
}

function projectLngLat([lng, lat]: LngLat) {
  const x = offsetX + (lng - minLng) * LNG_SCALE * uniformScale
  const y = offsetY + (maxLat - lat) * uniformScale
  return [x, y] as const
}

function projectLatLng([lat, lng]: LatLng) {
  return projectLngLat([lng, lat])
}

function pathFromLngLat(points: LngLat[]) {
  return points
    .map((point, index) => {
      const [x, y] = projectLngLat(point)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
    .concat(' Z')
}

function pathFromLatLng(points: LatLng[]) {
  return points
    .map((point, index) => {
      const [x, y] = projectLatLng(point)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
    .concat(' Z')
}

function textWidth(label: string) {
  return Math.max(58, Math.min(124, label.length * 7.3 + 22))
}

const outlinePaths = israelOutlineRings.map(pathFromLngLat)

export function IsraelStylizedMap({
  regions,
  selectedRegionId,
  userLocation,
  isLocating,
  locationMessage,
  onSelectRegion,
  onLocate,
  onReset,
}: IsraelStylizedMapProps) {
  const selectedRegion = regions.find(region => region.id === selectedRegionId) ?? null

  return (
    <section className="space-y-4" dir="rtl">
      <div className="rounded-[2rem] border border-white/80 bg-white/88 p-4 shadow-[0_22px_70px_rgba(23,39,69,0.10)] backdrop-blur md:p-6">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="חזרה"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-xl font-black text-[var(--foreground)] shadow-sm transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            ›
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-[var(--accent)]">אזורי אספקה</p>
            <h1 className="text-2xl font-black leading-tight text-[var(--foreground)] md:text-4xl">
              בחירת אזור אספקה
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)] md:text-base">
              בחרו אזור כדי לראות ספקים שמספקים אליו. המפה מבוססת על קווי מתאר גיאוגרפיים אמיתיים, אבל נשארת חוויית בחירה פשוטה.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <MyLocationButton isLocating={isLocating} onLocate={onLocate} />
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-black text-[var(--foreground)] shadow-sm transition hover:border-[var(--brand)] hover:bg-[var(--brand-light)] hover:text-[var(--brand)]"
          >
            הצג את כל הארץ
          </button>
        </div>

        {locationMessage && (
          <div className="mt-3 rounded-2xl border border-[#d8e6f4] bg-[#f2f7fc] px-4 py-3 text-sm font-bold text-[var(--brand)]">
            {locationMessage}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-[2.2rem] border border-white/90 bg-[#f9fbf8] shadow-[0_24px_80px_rgba(23,39,69,0.12)]">
        <div className="border-b border-[var(--border)] bg-white/82 px-4 py-3 md:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-[var(--foreground)]">מפת אזורי החלוקה</h2>
              <p className="text-xs font-bold text-[var(--muted)]">לחיצה על אזור תציג ספקים רלוונטיים מיד מתחת.</p>
            </div>
            <div className="rounded-full bg-[var(--brand-light)] px-3 py-1 text-xs font-black text-[var(--brand)]">
              {selectedRegion ? selectedRegion.nameHebrew : 'בחרו אזור'}
            </div>
          </div>
        </div>

        <div className="relative bg-[linear-gradient(115deg,#dff3ff_0%,#eef8fb_24%,#fbfaf6_58%,#f5f2ea_100%)] px-2 py-5 md:px-8 md:py-8">
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[38%] bg-[#bfe5f8]/45" />
          <svg
            viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
            className="relative mx-auto block h-[600px] max-h-[73vh] w-full max-w-[390px] drop-shadow-[0_24px_34px_rgba(23,39,69,0.16)] md:h-[720px] md:max-w-[520px]"
            role="img"
            aria-label="מפת אזורי אספקה בישראל"
          >
            <defs>
              <clipPath id="israelRealOutlineClip">
                {outlinePaths.map((path, index) => (
                  <path key={index} d={path} />
                ))}
              </clipPath>
              <filter id="israelOutlineShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#172745" floodOpacity="0.14" />
              </filter>
            </defs>

            <g filter="url(#israelOutlineShadow)">
              {outlinePaths.map((path, index) => (
                <path
                  key={index}
                  d={path}
                  fill="rgba(255,255,255,0.84)"
                  strokeLinejoin="round"
                />
              ))}
            </g>

            <g clipPath="url(#israelRealOutlineClip)">
              {regions.map(region => {
                const selected = selectedRegionId === region.id
                const [labelXRaw, labelYRaw] = projectLatLng(region.center)
                const [offsetX, offsetY] = labelOffsets[region.id] ?? [0, 0]
                const labelX = labelXRaw + offsetX
                const labelY = labelYRaw + offsetY

                return (
                  <path
                    key={region.id}
                    d={pathFromLatLng(region.polygon)}
                    onClick={() => onSelectRegion(region.id, 'manual')}
                    className="cursor-pointer transition-all duration-200 ease-out hover:brightness-[1.04]"
                    fill={region.color}
                    fillOpacity={selected ? 0.94 : 0.74}
                    stroke={selected ? '#172745' : '#ffffff'}
                    strokeWidth={selected ? 4.4 : 3.2}
                    strokeLinejoin="round"
                    style={{
                      filter: selected ? 'drop-shadow(0 10px 15px rgba(23,39,69,0.23))' : undefined,
                      transform: selected ? 'translateY(-2px)' : undefined,
                      transformOrigin: `${labelX}px ${labelY}px`,
                    }}
                  >
                    <title>{region.nameHebrew}</title>
                  </path>
                )
              })}
            </g>
            {regions.map(region => {
              const selected = selectedRegionId === region.id
              const [labelXRaw, labelYRaw] = projectLatLng(region.center)
              const [offsetX, offsetY] = labelOffsets[region.id] ?? [0, 0]
              const labelX = labelXRaw + offsetX
              const labelY = labelYRaw + offsetY
              const width = textWidth(region.nameHebrew)

              return (
                <g key={`${region.id}-label`} onClick={() => onSelectRegion(region.id, 'manual')} className="cursor-pointer">
                  <rect
                    x={labelX - width / 2}
                    y={labelY - 13}
                    width={width}
                    height="25"
                    rx="12.5"
                    fill={selected ? '#172745' : 'rgba(255,255,255,0.94)'}
                    stroke={selected ? '#172745' : 'rgba(226,222,214,0.88)'}
                  />
                  <circle cx={labelX + width / 2 - 13} cy={labelY - 0.5} r="4" fill={selected ? '#ffffff' : region.color} />
                  <text
                    x={labelX - 3}
                    y={labelY + 4}
                    textAnchor="middle"
                    fontSize={region.id === 'tel-aviv-center' || region.id === 'jerusalem-area' ? 10.4 : 11.3}
                    fontWeight="800"
                    fill={selected ? '#ffffff' : '#172745'}
                  >
                    {region.nameHebrew}
                  </text>
                </g>
              )
            })}

            {userLocation && (
              <g>
                {(() => {
                  const [x, y] = projectLatLng([userLocation.lat, userLocation.lng])
                  return (
                    <>
                      <circle cx={x} cy={y} r="12" fill="#172745" opacity="0.14" />
                      <circle cx={x} cy={y} r="5.5" fill="#172745" stroke="#fff" strokeWidth="3" />
                    </>
                  )
                })()}
              </g>
            )}
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto pb-1 scrollbar-hide">
        <div className="flex min-w-max gap-2 px-1">
          {regions.map(region => {
            const selected = selectedRegionId === region.id
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => onSelectRegion(region.id, 'manual')}
                className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-sm font-black shadow-sm transition ${
                  selected
                    ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                    : 'border-white bg-white text-[var(--foreground)] hover:border-[var(--brand)]'
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selected ? '#fff' : region.color }} />
                {region.nameHebrew}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
