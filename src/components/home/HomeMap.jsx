import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import { Pencil, X, MapPin, Maximize2, BedDouble, Bath } from 'lucide-react'
import properties from '../../data/properties.json'
import Price from '../common/Price'

// Color band by monthly rent (BD). Sale prices are normalised down so they
// land in the right bucket too — divide sale price by 1500 (rough BD/sqft yield
// proxy) before classifying. Keeps both rent + sale on one map.
function bandFor(p) {
  const monthly = p.purpose === 'rent' ? p.price : p.price / 200 // crude rent equivalent
  if (monthly < 400)  return { color: '#10B981', label: 'Under BD 400/mo' }
  if (monthly < 800)  return { color: '#F2C35F', label: 'BD 400 – 800/mo' }
  if (monthly < 1500) return { color: '#F59E0B', label: 'BD 800 – 1,500/mo' }
  return                     { color: '#E5484D', label: 'Over BD 1,500/mo' }
}

const BAHRAIN_CENTER = [26.13, 50.55]
const BAHRAIN_BOUNDS = [
  [25.79, 50.34],
  [26.42, 50.83],
]

// Captures the leaflet map instance up to the parent so it can drive
// drawing tools without invoking the imperative leaflet-draw plugin (which
// would need its own CSS bundle).
function MapBinding({ onReady }) {
  const map = useMap()
  useEffect(() => { onReady?.(map) }, [map, onReady])
  return null
}

// Lightweight rectangle-draw — listens for two clicks. Done in vanilla
// leaflet so we don't pay the leaflet-draw bundle cost.
function useRectangleDrawer(map, enabled, onComplete) {
  const startRef = useRef(null)

  useEffect(() => {
    if (!map) return
    if (!enabled) {
      map.getContainer().style.cursor = ''
      startRef.current = null
      return
    }
    map.getContainer().style.cursor = 'crosshair'
    map.dragging.disable()

    const onClick = (e) => {
      if (!startRef.current) {
        startRef.current = e.latlng
      } else {
        const a = startRef.current
        const b = e.latlng
        startRef.current = null
        map.dragging.enable()
        map.getContainer().style.cursor = ''
        onComplete?.([
          [Math.min(a.lat, b.lat), Math.min(a.lng, b.lng)],
          [Math.max(a.lat, b.lat), Math.max(a.lng, b.lng)],
        ])
      }
    }
    map.on('click', onClick)
    return () => {
      map.off('click', onClick)
      map.dragging.enable()
      map.getContainer().style.cursor = ''
    }
  }, [map, enabled, onComplete])
}

export default function HomeMap() {
  const [drawing, setDrawing] = useState(false)
  const [bbox, setBbox] = useState(null) // [[swLat, swLng], [neLat, neLng]] | null
  const [map, setMap] = useState(null)

  useRectangleDrawer(map, drawing, (b) => {
    setBbox(b)
    setDrawing(false)
  })

  const filtered = useMemo(() => {
    if (!bbox) return properties
    const [[swLat, swLng], [neLat, neLng]] = bbox
    return properties.filter(
      (p) => p.lat >= swLat && p.lat <= neLat && p.lng >= swLng && p.lng <= neLng
    )
  }, [bbox])

  const polygon = bbox
    ? [
        [bbox[0][0], bbox[0][1]],
        [bbox[1][0], bbox[0][1]],
        [bbox[1][0], bbox[1][1]],
        [bbox[0][0], bbox[1][1]],
      ]
    : null

  return (
    <section aria-labelledby="map-title" className="relative">
      <div className="container-lux mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">EXPLORE BAHRAIN</span>
          <h2 id="map-title" className="mt-3 font-display text-3xl text-ink-100 sm:text-4xl md:text-5xl">
            Search by neighbourhood, draw your own
          </h2>
          <p className="mt-3 max-w-xl text-sm text-ink-300">
            Pan the map, zoom into a neighbourhood, or draw your own search area to filter listings.
            Pins are colour-coded by monthly rent.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Legend />
          {!bbox ? (
            <button
              type="button"
              onClick={() => setDrawing((d) => !d)}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors ${
                drawing
                  ? 'border-gold-500 bg-gold-500/10 text-gold-200'
                  : 'border-white/15 text-ink-200 hover:border-gold-500/40 hover:text-gold-300'
              }`}
              title="Draw a rectangle to filter properties within an area"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.6} />
              {drawing ? 'Click two corners…' : 'Draw to search'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setBbox(null)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-200 transition-colors hover:bg-gold-500/15"
              title="Clear drawn search area"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.6} />
              Clear shape · {filtered.length} match
            </button>
          )}
        </div>
      </div>

      <div className="relative mx-auto h-[480px] w-full max-w-[1440px] overflow-hidden border-y border-white/8 sm:h-[560px] lg:h-[640px]">
        <MapContainer
          center={BAHRAIN_CENTER}
          zoom={10}
          minZoom={9}
          maxBounds={BAHRAIN_BOUNDS}
          scrollWheelZoom={false}
          className="absolute inset-0 z-0 h-full w-full"
          aria-label="Map of Bahrain showing IRE properties"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com">CARTO</a> &copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapBinding onReady={setMap} />

          {polygon && (
            <Polygon
              positions={polygon}
              pathOptions={{ color: '#d4af37', weight: 2, fillColor: '#d4af37', fillOpacity: 0.08 }}
            />
          )}

          {filtered.map((p) => {
            const band = bandFor(p)
            return (
              <CircleMarker
                key={p.id}
                center={[p.lat, p.lng]}
                radius={9}
                pathOptions={{
                  color: band.color,
                  fillColor: band.color,
                  fillOpacity: 0.85,
                  weight: 2,
                }}
              >
                <Popup className="ire-popup">
                  <Link to={`/properties/${p.id}`} className="block w-56">
                    <img src={p.images[0]} alt="" className="h-28 w-full rounded object-cover" />
                    <p className="mt-2 truncate text-sm font-semibold text-ink-100">{p.title}</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.22em] text-ivory-300">
                      <MapPin className="mr-1 inline h-3 w-3" /> {p.location}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-ink-300">
                      <span className="inline-flex items-center gap-1">
                        <BedDouble className="h-3 w-3" /> {p.bedrooms || 'Studio'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Bath className="h-3 w-3" /> {p.bathrooms}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Maximize2 className="h-3 w-3" /> {p.sqm} m²
                      </span>
                    </div>
                    <div className="mt-2">
                      <Price
                        bd={p.price}
                        unit={p.purpose === 'rent' ? '/mo' : 'total'}
                        size="22px"
                      />
                    </div>
                    <span className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                      View →
                    </span>
                  </Link>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>

        {/* Decorative gradient frame so the map blends into the page */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-ink-bg to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-bg to-transparent" />
      </div>
    </section>
  )
}

function Legend() {
  const items = [
    { color: '#10B981', label: '< 400' },
    { color: '#F2C35F', label: '400–800' },
    { color: '#F59E0B', label: '800–1.5K' },
    { color: '#E5484D', label: '> 1.5K' },
  ]
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-300">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  )
}
