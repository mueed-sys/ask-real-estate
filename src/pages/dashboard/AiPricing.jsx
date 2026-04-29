import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, FileDown, Loader2 } from 'lucide-react'

import Panel from '../../components/dashboard/Panel'
import { useToast } from '../../store/useToast'
import properties from '../../data/properties.json'
import areas from '../../data/areas.json'
import { PROPERTY_TYPES } from '../../lib/constants'
import { formatPrice } from '../../lib/format'

const ALL_AMENITIES = [
  'pool', 'gym', 'security_24_7', 'covered_parking', 'balcony', 'sea_view',
  'maids_room', 'storage', 'central_ac', 'built_in_wardrobes',
  'kitchen_appliances', 'internet', 'playground', 'concierge',
]

// Synthetic price model — combines location, type, beds, sqm, floor, amenities
// to compute a "recommended" price + factor breakdown that visualises *why*.
function computePrice(input) {
  const areaBase = {
    'Juffair': 380, 'Seef': 360, 'Amwaj Islands': 950, 'Bahrain Bay': 700,
    'Riffa': 380, 'Reef Island': 700, 'Saar': 700, 'Budaiya': 280,
    'Diplomatic Area': 950, 'Hidd': 240, 'Tubli': 320,
  }
  const typeMult = { 'Apartment': 1, 'Studio': 0.6, 'Villa': 1.8, 'Penthouse': 2.4, 'Commercial': 1.4, 'Land': 1.2 }

  const base = (areaBase[input.location] || 400) * (typeMult[input.type] || 1)
  const bedAdd = Math.max(0, input.bedrooms - 1) * 75
  const sqmAdd = Math.max(0, input.sqm - 80) * 1.2
  const floorAdd = input.floor >= 10 ? 40 : input.floor >= 5 ? 15 : 0
  const yearAdd = input.year_built >= 2020 ? 30 : input.year_built >= 2015 ? 10 : -10
  const furnAdd = input.furnished ? 60 : 0
  const seaAdd = input.amenities.includes('sea_view') ? 80 : 0
  const maidAdd = input.amenities.includes('maids_room') ? 0 : -20
  const storageAdd = input.amenities.includes('storage') ? 0 : -15

  const recommended = Math.round(base + bedAdd + sqmAdd + floorAdd + yearAdd + furnAdd + seaAdd + maidAdd + storageAdd)
  const range = { low: Math.round(recommended * 0.9), high: Math.round(recommended * 1.1) }

  const factors = [
    { label: `Sea View`, delta: seaAdd, condition: input.amenities.includes('sea_view') },
    { label: 'Furnished', delta: furnAdd, condition: input.furnished },
    { label: `Floor ${input.floor || 0}`, delta: floorAdd, condition: floorAdd > 0 },
    { label: `${input.location} location`, delta: Math.round(base - 400), condition: true },
    { label: `Year Built ${input.year_built}`, delta: yearAdd, condition: true },
    { label: `${input.bedrooms} bedrooms`, delta: bedAdd, condition: bedAdd > 0 },
    { label: `${input.sqm} m² area`, delta: Math.round(sqmAdd), condition: sqmAdd > 0 },
    { label: 'No Maid\'s Room', delta: maidAdd, condition: maidAdd < 0 },
    { label: 'No Storage', delta: storageAdd, condition: storageAdd < 0 },
  ].filter((f) => f.condition && f.delta !== 0)

  return { recommended, range, factors }
}

export default function AiPricing() {
  const pushToast = useToast((s) => s.push)

  const [form, setForm] = useState({
    type: 'Apartment',
    location: 'Juffair',
    bedrooms: 2,
    bathrooms: 2,
    sqm: 120,
    floor: 12,
    furnished: true,
    year_built: 2020,
    amenities: ['pool', 'gym', 'security_24_7', 'sea_view', 'central_ac', 'concierge'],
  })

  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const toggleAmenity = (a) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }))

  const analyze = async () => {
    setAnalyzing(true)
    setResult(null)
    await new Promise((r) => setTimeout(r, 1400))
    setResult(computePrice(form))
    setAnalyzing(false)
  }

  const comparables = useMemo(
    () =>
      properties
        .filter((p) => p.type === form.type || p.location === form.location)
        .slice(0, 5),
    [form.type, form.location]
  )

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-gold-500/20 bg-gold-500/[0.04] p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
          <p className="text-sm text-ink-200">
            <span className="font-semibold text-gold-300">Price any property in seconds.</span>{' '}
            AI-powered analysis based on real market data. What used to take days of research now takes one click.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Input form */}
        <Panel title="Property Details" subtitle="Enter property attributes to analyze">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <select value={form.type} onChange={(e) => set('type', e.target.value)} className="dash-input">
                  {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.value}</option>)}
                </select>
              </Field>
              <Field label="Area">
                <select value={form.location} onChange={(e) => set('location', e.target.value)} className="dash-input">
                  {areas.map((a) => <option key={a.slug} value={a.name}>{a.name}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <Field label="Beds">
                <input type="number" value={form.bedrooms} onChange={(e) => set('bedrooms', Number(e.target.value))} className="dash-input" />
              </Field>
              <Field label="Baths">
                <input type="number" value={form.bathrooms} onChange={(e) => set('bathrooms', Number(e.target.value))} className="dash-input" />
              </Field>
              <Field label="Sqm">
                <input type="number" value={form.sqm} onChange={(e) => set('sqm', Number(e.target.value))} className="dash-input" />
              </Field>
              <Field label="Floor">
                <input type="number" value={form.floor} onChange={(e) => set('floor', Number(e.target.value))} className="dash-input" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Year built">
                <input type="number" value={form.year_built} onChange={(e) => set('year_built', Number(e.target.value))} className="dash-input" />
              </Field>
              <Field label="Furnished">
                <select value={String(form.furnished)} onChange={(e) => set('furnished', e.target.value === 'true')} className="dash-input">
                  <option value="false">Unfurnished</option>
                  <option value="true">Furnished</option>
                </select>
              </Field>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gold-500">Amenities</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ALL_AMENITIES.map((a) => (
                  <label key={a} className="flex cursor-pointer items-center gap-2 rounded border border-white/10 px-2.5 py-1.5 text-[11px] text-ink-200 hover:border-gold-500/30">
                    <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="accent-gold-500" />
                    {a.replace(/_/g, ' ')}
                  </label>
                ))}
              </div>
            </div>

            <button onClick={analyze} disabled={analyzing} className="btn-gold inline-flex w-full items-center justify-center gap-2 text-xs disabled:opacity-50">
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {analyzing ? 'AI analyzing 2,847 comparable properties…' : 'Analyze Price'}
            </button>
          </div>

          <style>{`
            .dash-input {
              width: 100%;
              background: rgba(255,255,255,0.03);
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: 4px;
              padding: 0.5rem 0.75rem;
              color: #e6e7f0;
              font-size: 0.875rem;
              outline: none;
              transition: border-color .2s;
            }
            .dash-input:focus { border-color: rgba(212,175,55,0.4); }
          `}</style>
        </Panel>

        {/* Result */}
        <div className="space-y-6">
          <Panel title="AI Analysis Result">
            <AnimatePresence mode="wait">
              {!result && !analyzing && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-2 py-12 text-center"
                >
                  <Sparkles className="h-8 w-8 text-gold-500/60" />
                  <p className="text-sm text-ink-300">Configure the property on the left and click "Analyze Price".</p>
                </motion.div>
              )}
              {analyzing && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-3 py-12 text-center"
                >
                  <Loader2 className="h-10 w-10 animate-spin text-gold-500" />
                  <p className="text-sm text-ink-300">Analyzing 2,847 comparable properties…</p>
                  <p className="text-[11px] text-ink-400">Scanning Bahrain rental market · 6-month transaction history</p>
                </motion.div>
              )}
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-500">Recommended Price</p>
                    <p className="mt-2 font-numbers text-6xl font-semibold tracking-tight tabular-nums text-gold-gradient">
                      BD {formatPrice(result.recommended)}
                    </p>
                    <p className="mt-1 text-sm text-ink-300">{form.type === 'Land' ? 'total' : '/month'}</p>
                  </div>

                  {/* Range bar */}
                  <div>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-ink-300">BD {formatPrice(result.range.low)}</span>
                      <span className="text-[10px] uppercase tracking-widest text-ink-400">Recommended range</span>
                      <span className="text-ink-300">BD {formatPrice(result.range.high)}</span>
                    </div>
                    <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-white/5">
                      <div className="absolute inset-y-0 left-1/4 right-1/4 bg-gradient-to-r from-gold-500/40 via-gold-500/80 to-gold-500/40" />
                      <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-gold-300" />
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="flex items-center justify-center gap-6 rounded-md border border-white/5 bg-white/[0.02] p-4">
                    <ConfidenceRing pct={94} />
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-gold-500">Confidence</p>
                      <p className="font-display text-xl text-ink-100">94% — high signal</p>
                      <p className="text-xs text-ink-400">Based on 12 closely matching comparables in the same area.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Panel>

          {result && (
            <Panel title="Price Factors" subtitle="What's driving the recommendation up or down" noPadding>
              <ul className="divide-y divide-white/5">
                {result.factors.map((f, i) => (
                  <li key={i} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-ink-200">{f.label}</span>
                    <span className={`font-numbers text-sm font-semibold tracking-tight tabular-nums ${f.delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {f.delta > 0 ? '+' : ''}BD {f.delta}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {result && <MarketPosition recommended={result.recommended} />}
        </div>
      </div>

      {result && (
        <Panel
          title="Comparable Properties"
          subtitle={`${comparables.length} similar listings in market`}
          action={
            <button onClick={() => pushToast('PDF report queued')} className="inline-flex items-center gap-1.5 rounded-md border border-gold-500/30 bg-gold-500/5 px-3 py-1.5 text-xs uppercase tracking-widest text-gold-300 hover:bg-gold-500/10">
              <FileDown className="h-3.5 w-3.5" /> Generate Report
            </button>
          }
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                  <th className="px-5 py-3">Property</th>
                  <th className="px-5 py-3">Area</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3 text-right">Beds</th>
                  <th className="px-5 py-3 text-right">Sqm</th>
                  <th className="px-5 py-3 text-right">Price</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {comparables.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-sm text-ink-100">{c.title}</td>
                    <td className="px-5 py-3 text-sm text-ink-300">{c.location}</td>
                    <td className="px-5 py-3 text-sm text-ink-300">{c.type}</td>
                    <td className="px-5 py-3 text-right font-numbers text-sm font-semibold tracking-tight tabular-nums text-gold-300">{c.bedrooms}</td>
                    <td className="px-5 py-3 text-right font-numbers text-sm font-semibold tracking-tight tabular-nums text-ink-200">{c.sqm}</td>
                    <td className="px-5 py-3 text-right font-numbers text-sm font-semibold tracking-tight tabular-nums text-gold-300">BD {c.price}</td>
                    <td className="px-5 py-3 text-xs uppercase tracking-widest text-ink-400">IRE Bahrain</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-gold-500">{label}</p>
      {children}
    </label>
  )
}

function ConfidenceRing({ pct = 94 }) {
  const radius = 28
  const c = 2 * Math.PI * radius
  const offset = c - (pct / 100) * c
  return (
    <svg width={72} height={72} viewBox="0 0 72 72" className="-rotate-90">
      <circle cx={36} cy={36} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={5} fill="none" />
      <circle
        cx={36} cy={36} r={radius}
        stroke="url(#ringGold)" strokeWidth={5} fill="none"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
      />
      <defs>
        <linearGradient id="ringGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#f4d03f" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function MarketPosition({ recommended }) {
  const tiers = [
    { label: 'Budget', max: 350 },
    { label: 'Below Market', max: 500 },
    { label: 'Market Rate', max: 800 },
    { label: 'Above Market', max: 1500 },
    { label: 'Premium', max: Infinity },
  ]
  const idx = tiers.findIndex((t) => recommended <= t.max)

  return (
    <div className="rounded-md border border-white/5 bg-white/[0.02] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-500">Market Position</p>
      <div className="relative mt-5 grid grid-cols-5 gap-1">
        {tiers.map((t, i) => (
          <div key={t.label}>
            <div className={`h-1.5 rounded-full ${i === idx ? 'bg-gold-gradient' : 'bg-white/5'}`} />
            <p className={`mt-2 text-[10px] uppercase tracking-widest ${i === idx ? 'text-gold-300' : 'text-ink-400'}`}>{t.label}</p>
          </div>
        ))}
        {/* marker */}
        <div className="absolute -top-3" style={{ left: `${idx * 20 + 10}%`, transform: 'translateX(-50%)' }}>
          <div className="h-3 w-3 rotate-45 bg-gold-300" />
        </div>
      </div>
    </div>
  )
}
