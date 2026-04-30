import { MapContainer, TileLayer, Marker, CircleMarker, Tooltip, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Mini Leaflet map for the property page. Plots the property pin (gold) plus
// the labeled "nearby" entries from the property record on a small dark map.
//
// Replaces the previous text-only "5 min" list with a proper geographic
// context — same data, far more impressive.
const CATEGORY_COLOR = {
  shopping:  '#F59E0B',
  dining:    '#E5484D',
  education: '#1F86D8',
  health:    '#10B981',
  beach:     '#3DDB85',
  transport: '#A1A8BD',
  default:   '#d4af37',
}

// Lightly offset coordinates for nearby pins so they don't all overlap the
// property pin. Deterministic per category so layout stays stable.
function offsetFor(idx) {
  const angle = (idx * 137.5) * (Math.PI / 180) // golden-angle scatter
  const r = 0.005
  return [r * Math.cos(angle), r * Math.sin(angle)]
}

export default function NearbyMap({ property }) {
  const items = Object.entries(property.nearby || {})

  return (
    <div className="overflow-hidden rounded-md border border-white/8">
      <div className="relative h-72 w-full">
        <MapContainer
          center={[property.lat, property.lng]}
          zoom={14}
          scrollWheelZoom={false}
          className="absolute inset-0 z-0 h-full w-full"
          aria-label={`Nearby amenities around ${property.address}`}
        >
          <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <CircleMarker
            center={[property.lat, property.lng]}
            radius={11}
            pathOptions={{ color: '#d4af37', fillColor: '#f4d03f', fillOpacity: 1, weight: 3 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="text-[10px] font-semibold tracking-wide">PROPERTY</span>
            </Tooltip>
          </CircleMarker>

          {items.map(([key, info], i) => {
            const [dy, dx] = offsetFor(i)
            const lat = property.lat + dy
            const lng = property.lng + dx
            const color = CATEGORY_COLOR[key] || CATEGORY_COLOR.default
            return (
              <CircleMarker
                key={key}
                center={[lat, lng]}
                radius={7}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.9, weight: 2 }}
              >
                <Popup>
                  <div className="w-44">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-500">{key}</p>
                    <p className="mt-1 text-sm text-ink-100">{info.name}</p>
                    <p className="mt-1 text-xs text-ink-300">{info.distance}</p>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>

      {/* Legend / list under the map */}
      <ul className="grid grid-cols-2 gap-x-5 gap-y-1.5 border-t border-white/8 bg-white/[0.02] px-4 py-3 text-xs sm:grid-cols-3">
        {items.map(([key, info]) => {
          const color = CATEGORY_COLOR[key] || CATEGORY_COLOR.default
          return (
            <li key={key} className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 flex-shrink-0 rounded-full" style={{ background: color }} />
              <span className="truncate text-ink-200">{info.name}</span>
              <span className="ml-auto text-[10px] text-ink-400">{info.distance}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
