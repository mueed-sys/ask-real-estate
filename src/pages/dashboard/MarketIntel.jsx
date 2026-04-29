import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from 'recharts'
import { Sparkles, TrendingUp, Globe, AlertCircle, ArrowUpRight, Brain } from 'lucide-react'

import StatCard from '../../components/dashboard/StatCard'
import Panel from '../../components/dashboard/Panel'
import { CHART_COLORS, priceTrends12mo } from '../../lib/dashboard'

import competitors from '../../data/dashboard/competitors.json'

const TREND_AREAS = [
  { key: 'Juffair', color: '#d4af37' },
  { key: 'Seef', color: '#60a5fa' },
  { key: 'Amwaj', color: '#a78bfa' },
  { key: 'Riffa', color: '#22c55e' },
]

const OPPORTUNITIES = [
  {
    headline: 'Juffair 1BR apartments are 12% under-priced',
    body: 'Compared to market average. Opportunity to adjust pricing on 8 of your listings.',
    accent: 'from-gold-500/20',
  },
  {
    headline: 'Amwaj villa demand up 34%',
    body: 'Demand has increased 34% in the last 90 days but listings have only grown 5%. Supply gap detected — recruit more Amwaj inventory.',
    accent: 'from-emerald-500/20',
  },
  {
    headline: 'Seef commercial avg 45 days on market vs your 28',
    body: 'Your pricing strategy in Diplomatic Area / Seef is working — keep current commercial price band.',
    accent: 'from-blue-500/20',
  },
  {
    headline: '3 competitors have no website',
    body: 'Underhill, Best Properties and Al Mahd Real Estate operate without websites. Target their primary areas through Google SEO.',
    accent: 'from-purple-500/20',
  },
]

export default function MarketIntel() {
  const trends = priceTrends12mo()

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-gold-500/20 bg-gold-500/[0.04] p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
          <p className="text-sm text-ink-200">
            <span className="font-semibold text-gold-300">Know your market. Know your competitors.</span>{' '}
            Make data-driven decisions instead of guessing.
          </p>
        </div>
      </div>

      {/* Market overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Avg Bahrain Rent" value={485} prefix="BD " trend={{ dir: 'up', text: '+3.2% YoY' }} />
        <StatCard icon={Globe} label="Total Market Listings" value={8420} />
        <StatCard icon={AlertCircle} label="Your Market Share" value={2.9} suffix="%" />
        <StatCard icon={TrendingUp} label="Avg Days on Market" value={23} suffix=" days" trend={{ dir: 'up', text: 'You: 18 days · faster than market' }} />
      </div>

      {/* Competitor Analysis */}
      <Panel title="Competitor Analysis" subtitle="Live snapshot of competing brokerages in Bahrain" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3 text-right">Listings</th>
                <th className="px-5 py-3 text-right">Avg Price</th>
                <th className="px-5 py-3 text-right">Market Share</th>
                <th className="px-5 py-3">Primary Areas</th>
                <th className="px-5 py-3">Website</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c) => (
                <tr
                  key={c.name}
                  className={`border-b border-white/5 hover:bg-white/[0.02] ${
                    c.self ? 'bg-gold-500/5' : ''
                  }`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-ink-100">{c.name}</span>
                      {c.self && (
                        <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-gold-300">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-numbers text-base tracking-wider text-gold-300">{c.listings}</td>
                  <td className="px-5 py-3 text-right font-numbers text-base tracking-wider text-ink-200">BD {c.avg_price}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="ml-auto flex w-32 items-center justify-end gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gold-gradient" style={{ width: `${(c.share / 9) * 100}%` }} />
                      </div>
                      <span className="font-numbers text-base tracking-wider text-emerald-400">{c.share}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-300">{c.areas.join(' · ')}</td>
                  <td className="px-5 py-3">
                    {c.has_website ? (
                      <span className="text-xs text-emerald-400">✓ Has website</span>
                    ) : (
                      <span className="text-xs text-red-400">✗ No website</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Price trends */}
      <Panel title="Price Trends" subtitle="Average rental prices by area — last 12 months">
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={trends}>
              <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis dataKey="month" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                contentStyle={{ background: CHART_COLORS.tooltipBg, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
                formatter={(v) => `BD ${v}`}
                cursor={{ stroke: CHART_COLORS.gold, strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: CHART_COLORS.ink400 }} iconType="circle" iconSize={8} />
              {TREND_AREAS.map((a) => (
                <Line key={a.key} type="monotone" dataKey={a.key} stroke={a.color} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Opportunities */}
      <Panel title="Market Opportunities" subtitle="AI-generated insights based on your data + competitor data">
        <div className="grid gap-4 md:grid-cols-2">
          {OPPORTUNITIES.map((o, i) => (
            <article
              key={i}
              className={`relative overflow-hidden rounded-md border border-white/5 bg-gradient-to-br ${o.accent} via-transparent to-transparent p-5`}
            >
              <Brain className="h-4 w-4 text-gold-500" strokeWidth={1.5} />
              <h3 className="mt-3 font-display text-lg leading-snug text-ink-100">{o.headline}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{o.body}</p>
              <button className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gold-500 hover:text-gold-300">
                Take action
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  )
}
