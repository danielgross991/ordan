'use client'

import { useEffect, useRef, useState } from 'react'

export interface PlaceSelection {
  address: string
  placeId: string
  lat: number
  lng: number
  city: string | null
}

interface Props {
  onSelect: (place: PlaceSelection) => void
  defaultValue?: string
  placeholder?: string
  required?: boolean
}

// Loaded once globally
let scriptPromise: Promise<void> | null = null

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'))
  // Already loaded
  // @ts-expect-error window.google not typed
  if (window.google?.maps?.places) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('google-maps-script') as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps')))
      return
    }
    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&language=he&region=IL&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

export function PlacesAutocomplete({ onSelect, defaultValue = '', placeholder = 'התחל להקליד כתובת...', required }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiKey) return
    let cancelled = false

    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled || !inputRef.current) return
        // @ts-expect-error google not typed
        const Autocomplete = window.google?.maps?.places?.Autocomplete
        if (!Autocomplete) {
          setError('Google Places לא נטען')
          return
        }
        const ac = new Autocomplete(inputRef.current, {
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: 'il' },
          fields: ['place_id', 'formatted_address', 'geometry', 'address_components', 'name'],
        })
        ac.addListener('place_changed', () => {
          const place = ac.getPlace()
          if (!place?.place_id || !place.geometry?.location) return
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cityComp = place.address_components?.find((c: any) =>
            c.types?.includes('locality') || c.types?.includes('administrative_area_level_2')
          )
          const fullAddress = place.formatted_address || place.name || ''
          setValue(fullAddress)
          onSelect({
            address: fullAddress,
            placeId: place.place_id,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            city: cityComp?.long_name ?? null,
          })
        })
      })
      .catch(() => setError('שגיאה בטעינת השלמה אוטומטית'))

    return () => { cancelled = true }
  }, [apiKey, onSelect])

  // Fallback: plain text input (still saved on submit)
  if (!apiKey) {
    return (
      <div>
        <input
          type="text"
          required={required}
          value={value}
          onChange={e => {
            setValue(e.target.value)
            onSelect({ address: e.target.value, placeId: '', lat: 0, lng: 0, city: null })
          }}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        />
        <p className="text-[11px] text-[var(--muted)] mt-1">השלמה אוטומטית לא מוגדרת — הזן כתובת חופשית</p>
      </div>
    )
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        required={required}
        defaultValue={defaultValue}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
