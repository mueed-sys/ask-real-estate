import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from 'recharts'
import { Sparkles, ArrowUpRight, Brain } from 'lucide-react'

import Panel from '../../components/dashboard/Panel'
import { CHART_COLORS } from '../../lib/dashboard'
import heatmap from '../../data/dashboard/heatmap.json'

const METRICS = [
  { value: 'searches', label: 'Searches' },
  { value: 'inquiries', label: 'Inquiries' },
  { value: 'avg_price', label: 'Revenue' },
  { value: 'listings', label: 'Listings' },
]
const RANGES = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days']
const TYPE_FILTERS = ['All', 'Apartments', 'Villas', 'Studios', 'Commercial']

const DEMAND_LEGEND = [
  { color: '#ef4444', label: 'Hot' },
  { color: '#f97316', label: 'High' },
  { color: '#eab308', label: 'Medium' },
  { color: '#22c55e', label: 'Low' },
]

export default function Heatmap() {
  const [metric, setMetric] = useState('searches')
  const [range, setRange] = useState(RANGES[1])
  const [typeFilter, setTypeFilter] = useState('All')
  const [active, setActive] = useState(null)

  const ranked = useMemo(() => [...heatmap].sort((a, b) => b[metric] - a[metric]), [metric])
  const supplyDemand = useMemo(
    () => ranked.map((a) => ({ name: a.name, supply: a.listings * 8, demand: a.searches })),
    [ranked]
  )

  const max = Math.max(...heatmap.map((a) => a[metric]))

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-gold-500/20 bg-gold-500/[0.04] p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
          <p className="text-sm text-ink-200">
            <span className="font-semibold text-gold-300">See where the demand is, in real time.</span>{' '}
            Focus your inventory where the money is. No guesswork.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <ToolGroup label="Show by">
          {METRICS.map((m) => (
            <ToolBtn key={m.value} active={metric === m.value} onClick={() => setMetric(m.value)}>{m.label}</ToolBtn>
          ))}
        </ToolGroup>
        <ToolGroup label="Period">
          {RANGES.map((r) => (
            <ToolBtn key={r} active={range === r} onClick={() => setRange(r)}>{r}</ToolBtn>
          ))}
        </ToolGroup>
        <ToolGroup label="Type">
          {TYPE_FILTERS.map((t) => (
            <ToolBtn key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>{t}</ToolBtn>
          ))}
        </ToolGroup>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Map */}
        <Panel noPadding>
          <div className="h-[560px] overflow-hidden rounded-md">
            <MapContainer
              center={[26.0667, 50.5577]}
              zoom={11}
              scrollWheelZoom
              className="h-full w-full"
              style={{ background: '#070810' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
              />
              {heatmap.map((area) => {
                const radius = 12 + (area[metric] / max) * 30
                return (
                  <CircleMarker
                    key={area.slug}
                    center={[area.lat, area.lng]}
                    radius={radius}
                    pathOptions={{
                      color: area.color,
                      fillColor: area.color,
                      fillOpacity: 0.45,
                      weight: 2,
                    }}
                    eventHandlers={{ click: () => setActive(area) }}
                  >
                    <Popup>
                      <div className="min-w-[200px] font-sans">
                        <p className="text-base font-semibold">{area.name}</p>
                        <p className="text-xs" style={{ color: area.color }}>{area.demand.toUpperCase()} DEMAND</p>
                        <hr className="my-2" />
                        <p className="text-xs">Searches this month: <strong>{area.searches.toLocaleString()}</strong></p>
                        <p className="text-xs">Active listings: <strong>{area.listings}</strong></p>
                        <p className="text-xs">Avg price: <strong>BD {area.avg_price}</strong></p>
                        <p className="mt-1 text-xs"><strong>{area.supply_demand}</strong></p>
                        <p className="mt-1 text-xs">Top type: {area.top_type}</p>
                        <a href={`/properties?area=${encodeURIComponent(area.name)}`} target="_blank" rel="noreferrer" className="mt-2 block text-xs font-semibold text-blue-700">
                          View listings →
                        </a>
                      </div>
                    </Popup>
                  </CircleMarker>
                )
              })}
            </MapContainer>
          </div>
        </Panel>

        {/* Side panel */}
        <div className="space-y-6">
          <Panel title="Demand Legend">
            <div className="flex flex-wrap gap-4">
              {DEMAND_LEGEND.map((l) => (
                <div key={l.label} className="flex items-center gap-2 text-sm text-ink-200">
                  <span className="h-3 w-3 rounded-full" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Demand Ranking" subtitle={`Ordered by ${METRICS.find((m) => m.value === metric)?.label.toLowerCase()}`} noPadding>
            <ul className="divide-y divide-white/5">
              {ranked.map((a, i) => (
                <li key={a.slug}>
                  <button
                    onClick={() => setActive(a)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-white/[0.02]"
                  >
                    <span className="font-numbers text-xl tracking-wider text-gold-500 w-6 text-center">{String(i + 1).padStart(2, '0')}</span>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink-100">{a.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-ink-400">{a.supply_demand}</p>
                    </div>
                    <span className="font-numbers text-base tracking-wider text-gold-300">{a[metric].toLocaleString()}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Active Area">
            {active ? (
              <div className="space-y-4">
                <div>
                  <p className="font-display text-2xl text-ink-100">{active.name}</p>
                  <p className="text-[11px] uppercase tracking-widest" style={{ color: active.color }}>
                    {active.supply_demand}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <Stat label="Searches" value={active.searches.toLocaleString()} />
                  <Stat label="Inquiries" value={active.inquiries} />
                  <Stat label="Listings" value={active.listings} />
                  <Stat label="Avg Price" value={`BD ${active.avg_price}`} />
                </div>
                <div className="text-xs text-ink-300">Top searched: <span className="text-gold-300">{active.top_type}</span></div>
                <Link
                  to={`/properties?area=${encodeURIComponent(active.name)}`}
                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gold-500 hover:text-gold-300"
                >
                  View listings <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <p className="text-sm text-ink-400">Click an area on the map or in the ranking list to drill in.</p>
            )}
          </Panel>
        </div>
      </div>

      <Panel title="Supply vs Demand" subtitle="Demand (searches) vs supply (listings × 8 to scale)">
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={supplyDemand}>
              <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis dataKey="name" stroke={CHART_COLORS.axis} fontSize={10} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} width={36} />
              <Tooltip
                contentStyle={{ background: CHART_COLORS.tooltipBg, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
                cursor={{ fill: 'rgba(212,175,55,0.04)' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: CHART_COLORS.ink400 }} iconType="circle" iconSize={8} />
              <Bar dataKey="demand" fill={CHART_COLORS.gold} radius={[4, 4, 0, 0]} />
              <Bar dataKey="supply" fill="rgba(96, 165, 250, 0.7)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="AI Recommendation">
        <div className="flex items-start gap-4 rounded-md border border-gold-500/20 bg-gold-500/[0.04] p-5">
          <Brain className="h-6 w-6 flex-shrink-0 text-gold-500" strokeWidth={1.5} />
          <div className="text-sm leading-relaxed text-ink-200">
            <p>
              <span className="font-semibold text-gold-300">Based on current demand patterns,</span>{' '}
              we recommend focusing new listings in <strong className="text-ink-100">Juffair (2BR apartments)</strong> and{' '}
              <strong className="text-ink-100">Seef (Studios)</strong>. These areas show the highest search-to-listing ratio
              with high demand and constrained supply.
            </p>
            <p className="mt-3">
              Saar and Budaiya are oversupplied — consider repricing to clear inventory before adding more units in those areas.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  )
}

function ToolGroup({ label, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">{label}</span>
      <div className="flex flex-wrap items-center gap-1 rounded-md border border-white/10 p-0.5">{children}</div>
    </div>
  )
}

function ToolBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-3 py-1 text-[11px] font-medium tracking-wide transition-colors ${
        active ? 'bg-gold-500/10 text-gold-300' : 'text-ink-300 hover:text-gold-300'
      }`}
    >
      {children}
    </button>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded border border-white/5 bg-white/[0.02] py-2">
      <p className="font-numbers text-xl tracking-wider text-gold-300">{value}</p>
      <p className="text-[9px] font-medium uppercase tracking-widest text-ink-400">{label}</p>
    </div>
  )
}
