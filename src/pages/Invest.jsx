import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowUpRight, Calculator, MapPin, TrendingUp, BadgeCheck } from 'lucide-react'
import { MapContainer, TileLayer, Polygon, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTip, LabelList } from 'recharts'

import properties from '../data/properties.json'
import areas from '../data/areas.json'
import PropertyCard from '../components/property/PropertyCard'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'
import Price from '../components/common/Price'
import { CURRENCIES, convert, formatNumber } from '../store/useCurrency'
import { BRAND, SITE_URL } from '../lib/constants'

// Designated freehold zones for foreign / GCC ownership in Bahrain. Mapped
// approximately as polygons over the leaflet base. Centred + sized for
// recognisability rather than survey accuracy.
const FREEHOLD_ZONES = [
  { name: 'Seef',                slug: 'seef',                 yield: 7.0, polygon: [[26.234, 50.547],[26.234, 50.575],[26.214, 50.575],[26.214, 50.547]] },
  { name: 'Amwaj Islands',       slug: 'amwaj',                yield: 7.4, polygon: [[26.305, 50.66],[26.305, 50.69],[26.275, 50.69],[26.275, 50.66]] },
  { name: 'Reef Island',         slug: 'reef-island',          yield: 6.8, polygon: [[26.255, 50.56],[26.255, 50.585],[26.234, 50.585],[26.234, 50.56]] },
  { name: 'Bahrain Bay',         slug: 'bahrain-bay',          yield: 7.2, polygon: [[26.245, 50.58],[26.245, 50.615],[26.225, 50.615],[26.225, 50.58]] },
  { name: 'Durrat Al Bahrain',   slug: 'durrat',               yield: 6.4, polygon: [[25.85, 50.62],[25.85, 50.66],[25.82, 50.66],[25.82, 50.62]] },
]

export default function Invest() {
  // ROI calculator state
  const [price, setPrice] = useState(180000)
  const [monthlyRent, setMonthlyRent] = useState(1100)
  const [annualExpenses, setAnnualExpenses] = useState(1200)
  const [currency, setCurrency] = useState('BD')

  const cfg = CURRENCIES[currency]
  const annualRent = monthlyRent * 12
  const annualNet = annualRent - annualExpenses
  const yieldPct = (annualNet / price) * 100
  const monthlyNet = annualNet / 12
  const breakeven = annualNet > 0 ? price / annualNet : null

  const cv = (bd) => formatNumber(convert(bd, currency), currency)

  // For-sale listings in freehold zones
  const freeholdNames = new Set(FREEHOLD_ZONES.map((z) => z.name))
  const listings = useMemo(
    () => properties.filter((p) => p.purpose === 'sale' && freeholdNames.has(p.location)).slice(0, 6),
    []
  )

  const yieldChart = FREEHOLD_ZONES.map((z) => ({ name: z.name.replace(' Islands', ''), value: z.yield }))

  return (
    <>
      <Helmet>
        <title>Invest in Bahrain Real Estate — {BRAND.shortName}</title>
        <meta name="description" content="Freehold ownership for GCC and Saudi investors in Bahrain. ROI calculator, rental yields by area, and curated for-sale listings." />
        <link rel="canonical" href={`${SITE_URL}/invest`} />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gold opacity-40" />
        <div className="container-lux relative grid gap-10 py-24 lg:grid-cols-[1.3fr_1fr] lg:py-32">
          <div>
            <span className="eyebrow eyebrow-gold">FOR GCC & SAUDI INVESTORS</span>
            <h1 className="mt-5 font-display text-5xl leading-[1.04] tracking-tight md:text-6xl lg:text-7xl">
              <span className="block text-ink-100">Invest in</span>
              <span className="block text-gold-gradient">Bahrain Real Estate</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-[1.8] text-ink-200">
              Bahrain offers GCC and Saudi nationals freehold ownership in five designated zones, with
              rental yields averaging <strong className="text-gold-200">6.4 – 7.4%</strong> — among the
              highest in the Gulf. IRE represents owners and buyers across all five.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.22em]">
              {FREEHOLD_ZONES.map((z) => (
                <Link
                  key={z.slug}
                  to={`/areas/${z.slug}`}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-ink-200 transition-colors hover:border-gold-500/50 hover:text-gold-300"
                >
                  {z.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Freehold map */}
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-md border border-white/8">
              <div className="h-72 w-full">
                <MapContainer center={[26.13, 50.55]} zoom={10} scrollWheelZoom={false} className="h-full w-full">
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="© CARTO" />
                  {FREEHOLD_ZONES.map((z) => (
                    <Polygon
                      key={z.slug}
                      positions={z.polygon}
                      pathOptions={{ color: '#d4af37', weight: 2, fillColor: '#d4af37', fillOpacity: 0.18 }}
                    >
                      <Tooltip>{z.name} · {z.yield}% yield</Tooltip>
                    </Polygon>
                  ))}
                </MapContainer>
              </div>
              <p className="border-t border-white/8 bg-white/[0.02] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-ivory-300">
                Designated freehold zones — Bahrain
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="bg-ink-card/40 py-section">
        <div className="container-lux grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          <Reveal>
            <SectionHeader eyebrow="ROI CALCULATOR" title="Project your annual yield" />
            <p className="mt-3 max-w-xl text-sm text-ink-300">
              Enter the purchase price and expected monthly rent. We'll show your gross yield, net of
              average annual expenses, in BD with SAR / AED equivalents.
            </p>

            <div className="mt-8 space-y-5 rounded-md border border-white/8 bg-ink-card/60 p-6">
              <Field label="Purchase price (BD)">
                <input
                  type="number"
                  value={price}
                  min={50000}
                  step={5000}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2.5 text-base font-numbers text-ink-100 outline-none focus:border-gold-500/40"
                />
                <input
                  type="range"
                  min={50000}
                  max={1000000}
                  step={5000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-2 w-full accent-gold-500"
                />
              </Field>

              <Field label="Expected monthly rent (BD)">
                <input
                  type="number"
                  value={monthlyRent}
                  min={100}
                  step={50}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2.5 text-base font-numbers text-ink-100 outline-none focus:border-gold-500/40"
                />
              </Field>

              <Field label="Annual expenses (BD) — service fees, maintenance, insurance">
                <input
                  type="number"
                  value={annualExpenses}
                  min={0}
                  step={100}
                  onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                  className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2.5 text-base font-numbers text-ink-100 outline-none focus:border-gold-500/40"
                />
              </Field>

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">
                  Show in
                </p>
                <div className="flex gap-2">
                  {Object.values(CURRENCIES).map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setCurrency(c.code)}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                        currency === c.code
                          ? 'bg-gold-gradient text-ink-900'
                          : 'border border-white/15 text-ink-200 hover:border-gold-500/40'
                      }`}
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card-lux p-6 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">
                Projected annual yield
              </p>
              <p className="mt-3 font-numbers text-6xl font-extrabold leading-none tracking-tight text-gold-gradient">
                {yieldPct.toFixed(1)}<span className="text-3xl">%</span>
              </p>
              <p className="mt-1 text-sm text-ink-400">net of expenses</p>

              <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4 text-sm">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory-300">Net monthly</dt>
                  <dd className="mt-1 font-numbers text-xl font-bold text-ink-100">{cfg.symbol} {cv(monthlyNet)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory-300">Net annual</dt>
                  <dd className="mt-1 font-numbers text-xl font-bold text-ink-100">{cfg.symbol} {cv(annualNet)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory-300">Break-even</dt>
                  <dd className="mt-1 font-numbers text-xl font-bold text-ink-100">{breakeven ? `${breakeven.toFixed(1)} yrs` : '—'}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory-300">10-yr cumulative</dt>
                  <dd className="mt-1 font-numbers text-xl font-bold text-ink-100">{cfg.symbol} {cv(annualNet * 10)}</dd>
                </div>
              </dl>

              <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-[0.22em] text-ivory-300">
                <FxRow code="BD" amount={annualNet} />
                <FxRow code="SAR" amount={annualNet} />
                <FxRow code="AED" amount={annualNet} />
              </div>

              <p className="mt-6 inline-flex items-center gap-2 text-[11px] text-ink-400">
                <Calculator className="h-3 w-3" /> Indicative figures · for guidance only.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Yields by area */}
      <section className="container-lux py-section">
        <SectionHeader eyebrow="YIELDS BY AREA" title="Where capital works hardest" />
        <Reveal delay={0.1}>
          <div className="mt-10 h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={yieldChart} margin={{ top: 16, right: 10, bottom: 0, left: -12 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(196,200,219,0.7)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(196,200,219,0.55)" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <ChartTip
                  contentStyle={{ background: '#171B36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
                  formatter={(v) => [`${v}% yield`, 'Avg']}
                />
                <Bar dataKey="value" fill="#d4af37" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="value" position="top" formatter={(v) => `${v}%`} fill="#f4d03f" fontSize={11} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>
      </section>

      {/* Listings in freehold zones */}
      <section className="container-lux py-section">
        <SectionHeader eyebrow="FREEHOLD LISTINGS" title="Investment-grade properties available now" />
        <div className="mt-10 grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-3">
          {listings.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06} className="h-full">
              <PropertyCard property={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Residency-by-investment */}
      <section className="bg-ink-card/40 py-section">
        <div className="container-lux grid gap-10 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <SectionHeader eyebrow="RESIDENCY" title="Residency by investment" />
            <p className="mt-4 max-w-2xl text-sm leading-[1.8] text-ink-200">
              Property owners in Bahrain who meet minimum investment thresholds may apply for a renewable
              residency permit covering themselves and immediate family. Conditions and thresholds change
              periodically — IRE works with vetted Bahraini legal counsel to handle every step. The figures
              below are informational, not legal advice.
            </p>

            <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <Pill icon={BadgeCheck} title="Eligibility" body="GCC + foreign nationals owning property of qualifying value in a designated freehold zone." />
              <Pill icon={TrendingUp} title="Renewability" body="Permit renewable as long as ownership and conditions are maintained." />
              <Pill icon={MapPin} title="Family inclusion" body="Spouse and children covered under a single application." />
              <Pill icon={ArrowUpRight} title="Process" body="Typical processing 6 – 10 weeks via Nationality, Passports & Residence Affairs (NPRA)." />
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card-lux p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">Speak with</p>
              <p className="mt-2 font-display text-xl text-ink-100">Investment Specialist</p>
              <p className="mt-1 text-sm text-ink-300">For exact thresholds, freehold contracts, and residency paperwork.</p>
              <Link
                to="/contact?subject=invest"
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gold-gradient text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-900"
              >
                Schedule consultation
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">{label}</p>
      {children}
    </label>
  )
}

function FxRow({ code, amount }) {
  const formatted = formatNumber(convert(amount, code), code)
  const symbol = CURRENCIES[code].symbol
  return (
    <div className="rounded border border-white/8 bg-white/[0.02] px-2 py-1.5">
      <p className="text-[9px] text-ivory-400">{code}</p>
      <p className="mt-0.5 font-numbers text-xs font-bold text-ink-100">{symbol} {formatted}</p>
    </div>
  )
}

function Pill({ icon: Icon, title, body }) {
  return (
    <li className="flex items-start gap-3 rounded-md border border-white/8 bg-ink-card/40 p-4">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-300" strokeWidth={1.6} />
      <div>
        <p className="text-sm font-semibold text-ink-100">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-300">{body}</p>
      </div>
    </li>
  )
}
