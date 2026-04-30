import { useMemo, useState } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts'
import {
  Eye, Users, MousePointer, Clock, Globe, MapPin, Sparkles,
} from 'lucide-react'

import StatCard from '../../components/dashboard/StatCard'
import Panel from '../../components/dashboard/Panel'
import SalesFunnel from '../../components/dashboard/SalesFunnel'
import LeaseExpiryCalendar from '../../components/dashboard/LeaseExpiryCalendar'
import { CHART_COLORS, visitorsLastNDays, peakHoursGrid } from '../../lib/dashboard'

import searchTerms from '../../data/dashboard/searchTerms.json'
import properties from '../../data/properties.json'
import heatmap from '../../data/dashboard/heatmap.json'

const RANGES = [
  { value: 7, label: 'Last 7 Days' },
  { value: 30, label: 'Last 30 Days' },
  { value: 90, label: 'Last 90 Days' },
]

const TRAFFIC_SOURCES = [
  { name: 'Google Search', value: 42 },
  { name: 'Direct', value: 28 },
  { name: 'Instagram', value: 18 },
  { name: 'WhatsApp', value: 8 },
  { name: 'Other', value: 4 },
]

export default function Analytics() {
  const [range, setRange] = useState(30)
  const visitors = useMemo(() => visitorsLastNDays(range), [range])
  const peakHours = useMemo(() => peakHoursGrid(), [])
  const totalVisitors = visitors.reduce((s, d) => s + d.visitors, 0)

  const propPerf = [...properties]
    .map((p) => ({ ...p, conv: Math.round((p.views / 30) * 0.12 * 10) / 10, time: Math.round(60 + (p.views % 90)) }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 12)

  const areaSearch = [...heatmap].sort((a, b) => b.searches - a.searches).slice(0, 8)

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-gold-500/20 bg-gold-500/[0.04] p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
          <p className="text-sm text-ink-200">
            <span className="font-semibold text-gold-300">Know exactly what your customers want before they tell you.</span>{' '}
            Data that used to take weeks, now available in seconds.
          </p>
        </div>
      </div>

      {/* Range selector */}
      <div className="flex flex-wrap items-center gap-2">
        {RANGES.map((r) => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={`rounded-md border px-4 py-1.5 text-xs font-medium transition-colors ${
              range === r.value
                ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                : 'border-white/10 text-ink-300 hover:border-gold-500/40'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Eye} label="Total Page Views" value={14289} />
        <StatCard icon={Users} label="Unique Visitors" value={3842} trend={{ dir: 'up', text: '+18% MoM' }} />
        <StatCard icon={MousePointer} label="Bounce Rate" value={34} suffix="%" trend={{ dir: 'down', text: '-3% MoM' }} />
        <StatCard icon={Clock} label="Avg Session" value={263} format={(s) => `${Math.floor(s / 60)}m ${s % 60}s`} />
        <StatCard icon={Globe} label="Top Source" value={42} suffix="% Google" duration={1200} />
        <StatCard icon={MapPin} label="Top Area" value={1842} suffix=" Juffair" duration={1200} />
      </div>

      {/* Visitor trend */}
      <Panel title="Website Traffic" subtitle={`${totalVisitors.toLocaleString()} visitors over the last ${range} days`}>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <AreaChart data={visitors}>
              <defs>
                <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.gold} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={CHART_COLORS.gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis dataKey="date" stroke={CHART_COLORS.axis} fontSize={10} tickLine={false} axisLine={false} interval={Math.floor(range / 12)} />
              <YAxis stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} width={36} />
              <Tooltip
                contentStyle={{ background: CHART_COLORS.tooltipBg, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
                cursor={{ stroke: CHART_COLORS.gold, strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="visitors" stroke={CHART_COLORS.gold} strokeWidth={2} fill="url(#visitorsFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Sources + popular areas */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Traffic Sources">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={TRAFFIC_SOURCES} dataKey="value" nameKey="name" outerRadius={92} strokeWidth={0}>
                  {TRAFFIC_SOURCES.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS.series[i % CHART_COLORS.series.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: CHART_COLORS.tooltipBg, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
                  formatter={(v) => `${v}%`}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: CHART_COLORS.ink400 }} iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Most Popular Areas" subtitle="By search/filter volume">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={areaSearch} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid stroke={CHART_COLORS.grid} horizontal={false} />
                <XAxis type="number" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  contentStyle={{ background: CHART_COLORS.tooltipBg, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
                  cursor={{ fill: 'rgba(212,175,55,0.06)' }}
                />
                <Bar dataKey="searches" fill={CHART_COLORS.gold} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Search behavior */}
      <Panel title="Search Behavior" subtitle="What visitors search for most" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                <th className="px-5 py-3">Search Term</th>
                <th className="px-5 py-3 text-right">Count</th>
                <th className="px-5 py-3 text-right">Conversion Rate</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {searchTerms.map((s) => (
                <tr key={s.term} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-sm text-ink-100">{s.term}</td>
                  <td className="px-5 py-3 text-right font-numbers text-sm font-bold tracking-tight tabular-nums text-gold-300">{s.count}</td>
                  <td className="px-5 py-3 text-right font-numbers text-sm font-bold tracking-tight tabular-nums text-emerald-400">{s.conversion}%</td>
                  <td className="px-5 py-3">
                    <div className="ml-auto h-1.5 w-32 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gold-gradient" style={{ width: `${(s.count / 350) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Property performance */}
      <Panel title="Property Performance" subtitle="Sorted by views" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                <th className="px-5 py-3">Property</th>
                <th className="px-5 py-3 text-right">Views</th>
                <th className="px-5 py-3 text-right">Inquiries</th>
                <th className="px-5 py-3 text-right">Conversion</th>
                <th className="px-5 py-3 text-right">Avg Time on Page</th>
              </tr>
            </thead>
            <tbody>
              {propPerf.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <p className="text-sm text-ink-100">{p.title}</p>
                    <p className="text-[11px] text-ink-400">{p.location} · {p.id}</p>
                  </td>
                  <td className="px-5 py-3 text-right font-numbers text-sm font-bold tracking-tight tabular-nums text-gold-300">{p.views}</td>
                  <td className="px-5 py-3 text-right font-numbers text-sm font-bold tracking-tight tabular-nums text-blue-400">{Math.round(p.views * 0.12)}</td>
                  <td className="px-5 py-3 text-right font-numbers text-sm font-bold tracking-tight tabular-nums text-emerald-400">{p.conv}%</td>
                  <td className="px-5 py-3 text-right font-numbers text-sm font-bold tracking-tight tabular-nums text-ink-200">{Math.floor(p.time / 60)}m {p.time % 60}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Peak hours heatmap */}
      <Panel title="Peak Hours" subtitle="Darker = more traffic. Hours by day of week.">
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="mb-1 grid grid-cols-[60px_repeat(24,1fr)] gap-px text-[9px] text-ink-400">
              <span />
              {Array.from({ length: 24 }).map((_, h) => (
                <span key={h} className="text-center">{h}</span>
              ))}
            </div>
            {peakHours.map((row) => (
              <div key={row.day} className="mt-1 grid grid-cols-[60px_repeat(24,1fr)] gap-px">
                <span className="text-xs text-ink-300">{row.day}</span>
                {row.cells.map((v, i) => (
                  <div
                    key={i}
                    title={`${row.day} ${i}:00 — ${v}`}
                    className="aspect-square rounded-[1px]"
                    style={{ background: `rgba(212,175,55,${v / 100})` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Sales funnel */}
      <SalesFunnel />

      {/* Lease expiry */}
      <LeaseExpiryCalendar />
    </div>
  )
}
