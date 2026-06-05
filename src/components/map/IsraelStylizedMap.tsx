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

        <div className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_18%_45%,#c9e8f8_0%,#dff1fb_28%,#eaf2f0_55%,#f4ead8_80%,#ecd9b8_100%)] px-2 py-5 md:px-8 md:py-8">
          <svg
            viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
            className="relative mx-auto block h-[600px] max-h-[73vh] w-full max-w-[390px] md:h-[720px] md:max-w-[520px]"
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
                <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#172745" floodOpacity="0.18" />
              </filter>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="regionSoftBlend" x="-5%" y="-5%" width="110%" height="110%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.7" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
              <radialGradient id="seaShimmer" cx="22%" cy="38%" r="55%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="israelGlow" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="landTexture" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fffdf5" />
                <stop offset="100%" stopColor="#f7eedb" />
              </linearGradient>
              <pattern id="waveDots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="7" cy="7" r="0.9" fill="#2d6c92" fillOpacity="0.18" />
              </pattern>
              <pattern id="sandDots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="8" cy="8" r="0.8" fill="#b88e4a" fillOpacity="0.16" />
              </pattern>
            </defs>

            {/* Sea texture on the west */}
            <rect x="0" y="0" width={VIEWBOX.width * 0.42} height={VIEWBOX.height} fill="url(#waveDots)" />
            <rect x="0" y="0" width={VIEWBOX.width * 0.5} height={VIEWBOX.height} fill="url(#seaShimmer)" />

            {/* Sand/desert texture on the east */}
            <rect x={VIEWBOX.width * 0.55} y="0" width={VIEWBOX.width * 0.45} height={VIEWBOX.height} fill="url(#sandDots)" />

            {/* Neighbor country labels - subtle */}
            <text x={VIEWBOX.width * 0.78} y={45} textAnchor="middle" fontSize="11" fontWeight="700" fill="#a08054" opacity="0.55" letterSpacing="2">לבנון</text>
            <text x={VIEWBOX.width * 0.88} y={140} textAnchor="middle" fontSize="11" fontWeight="700" fill="#a08054" opacity="0.55" letterSpacing="2">סוריה</text>
            <text x={VIEWBOX.width * 0.92} y={340} textAnchor="middle" fontSize="12" fontWeight="700" fill="#a08054" opacity="0.6" letterSpacing="2">ירדן</text>
            <text x={VIEWBOX.width * 0.20} y={680} textAnchor="middle" fontSize="12" fontWeight="700" fill="#a08054" opacity="0.55" letterSpacing="2">מצרים</text>

            {/* Sea label */}
            <g opacity="0.7" transform={`translate(${VIEWBOX.width * 0.12}, 240) rotate(-78)`}>
              <text textAnchor="middle" fontSize="13" fontWeight="800" fill="#2d6c92" letterSpacing="6">הים התיכון</text>
            </g>

            {/* Compass rose */}
            <g transform={`translate(${VIEWBOX.width - 38}, ${VIEWBOX.height - 56})`} opacity="0.7">
              <circle r="18" fill="#ffffff" stroke="#172745" strokeOpacity="0.25" strokeWidth="1" />
              <path d="M 0 -13 L 3 0 L 0 13 L -3 0 Z" fill="#172745" fillOpacity="0.75" />
              <text y="-19" textAnchor="middle" fontSize="9" fontWeight="900" fill="#172745" fillOpacity="0.75">N</text>
            </g>

            {/* Soft glow around Israel */}
            <g filter="url(#softGlow)" opacity="0.85">
              {outlinePaths.map((path, index) => (
                <path key={`glow-${index}`} d={path} fill="url(#israelGlow)" />
              ))}
            </g>

            {/* Israel land base with shadow */}
            <g filter="url(#israelOutlineShadow)">
              {outlinePaths.map((path, index) => (
                <path
                  key={index}
                  d={path}
                  fill="url(#landTexture)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              ))}
            </g>

            <g clipPath="url(#israelRealOutlineClip)" filter="url(#regionSoftBlend)">
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
                    className="cursor-pointer transition-all duration-200 ease-out hover:brightness-[1.06]"
                    fill={region.color}
                    fillOpacity={selected ? 0.96 : 0.82}
                    stroke={selected ? '#172745' : region.color}
                    strokeOpacity={selected ? 1 : 0.55}
                    strokeWidth={selected ? 3.2 : 1.4}
                    strokeLinejoin="round"
                    style={{
                      transformOrigin: `${labelX}px ${labelY}px`,
                    }}
                  >
                    <title>{region.nameHebrew}</title>
                  </path>
                )
              })}
            </g>

            {/* Clean outline on top of regions */}
            <g clipPath="url(#israelRealOutlineClip)" pointerEvents="none">
              {outlinePaths.map((path, index) => (
                <path
                  key={`outline-top-${index}`}
                  d={path}
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity="0.6"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              ))}
            </g>

            {/* Final crisp Israel border */}
            {outlinePaths.map((path, index) => (
              <path
                key={`border-${index}`}
                d={path}
                fill="none"
                stroke="#172745"
                strokeOpacity="0.32"
                strokeWidth="1.4"
                strokeLinejoin="round"
                pointerEvents="none"
              />
            ))}
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
