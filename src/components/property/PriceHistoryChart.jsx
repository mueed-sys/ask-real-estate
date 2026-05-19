import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { TrendingDown, TrendingUp } from 'lucide-react'

// Mock price-history series — last 12 months. We randomise around the current
// price using a deterministic seed (property id) so the curve is consistent
// across renders. In production this would come from a sale-history API.
function buildSeries(property) {
  const months = 12
  const now = new Date() // current date
  const id = (property.id || 'X')
  const seed = [...id].reduce((a, c) => a + c.charCodeAt(0), 0)
  const rand = (i) => {
    const x = Math.sin(seed + i * 13.1) * 10000
    return x - Math.floor(x)
  }
  const base = property.price
  const start = base * 0.92
  return Array.from({ length: months }, (_, i) => {
    const m = new Date(now)
    m.setMonth(m.getMonth() - (months - 1 - i))
    const wobble = (rand(i) - 0.5) * 0.04 // ±2%
    const trend = (i / (months - 1)) * 0.08 // +8% over the year
    const v = Math.round(start * (1 + trend + wobble))
    return {
      month: m.toLocaleDateString('en-GB', { month: 'short' }),
      price: v,
    }
  })
}

export default function PriceHistoryChart({ property }) {
  const data = buildSeries(property)
  const start = data[0].price
  const end = data[data.length - 1].price
  const delta = end - start
  const pct = ((delta / start) * 100).toFixed(1)
  const up = delta >= 0
  const Trend = up ? TrendingUp : TrendingDown

  return (
    <section aria-labelledby="price-history-title">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="price-history-title" className="font-display text-2xl text-ink-100 sm:text-3xl">Price History</h2>
          <p className="mt-1 text-xs text-ink-400">Last 12 months · Source: IRE valuation index (mock)</p>
        </div>
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] ${
          up ? 'border-success-500/30 bg-success-500/10 text-success-300' : 'border-danger-500/30 bg-danger-500/10 text-danger-300'
        }`}>
          <Trend className="h-3.5 w-3.5" strokeWidth={2} /> {up ? '+' : ''}{pct}% YoY
        </div>
      </header>
      <div className="mt-5 h-48 w-full">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af37" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="month" stroke="rgba(196,200,219,0.55)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <Tooltip
              contentStyle={{ background: '#171B36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
              cursor={{ stroke: '#d4af37', strokeWidth: 1, strokeDasharray: '4 4' }}
              formatter={(v) => [`BD ${Number(v).toLocaleString()}`, 'Price']}
            />
            <Area type="monotone" dataKey="price" stroke="#d4af37" strokeWidth={2} fill="url(#priceFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
