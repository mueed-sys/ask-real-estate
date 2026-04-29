import { Link } from 'react-router-dom'
import {
  Building2, MessageSquare, Home, DollarSign, Clock, Eye,
  ArrowUpRight,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts'

import StatCard from '../../components/dashboard/StatCard'
import Panel from '../../components/dashboard/Panel'
import StatusBadge from '../../components/dashboard/StatusBadge'
import {
  CHART_COLORS, SOURCE_META, inquiriesLast30Days,
} from '../../lib/dashboard'

import leads from '../../data/dashboard/leads.json'
import properties from '../../data/properties.json'
import agents from '../../data/agents.json'

const REVENUE_BY_AREA = [
  { name: 'Juffair', value: 35 },
  { name: 'Seef', value: 22 },
  { name: 'Amwaj', value: 18 },
  { name: 'Riffa', value: 12 },
  { name: 'Bahrain Bay', value: 8 },
  { name: 'Other', value: 5 },
]

export default function Overview() {
  const inquirySeries = inquiriesLast30Days()
  const recentLeads = leads.slice(0, 10)
  const agentPerf = [...agents]
    .map((a) => ({ name: a.name.split(' ')[0], deals: a.deals_closed_year }))
    .sort((a, b) => b.deals - a.deals)
  const topViewed = [...properties].sort((a, b) => b.views - a.views).slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stat row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Building2} label="Active Listings" value={247} trend={{ dir: 'up', text: '+12 this week' }} />
        <StatCard icon={MessageSquare} label="Inquiries / Month" value={1842} trend={{ dir: 'up', text: '+23% vs last month' }} />
        <StatCard icon={Home} label="Rented This Month" value={63} trend={{ dir: 'up', text: '+8 vs last month' }} />
        <StatCard
          icon={DollarSign}
          label="Revenue / Month"
          value={18400}
          prefix="BD "
          trend={{ dir: 'up', text: '+22% MoM' }}
        />
        <StatCard icon={Clock} label="Avg Response" value={12} suffix=" min" duration={1200} />
        <StatCard icon={Eye} label="Visitors Today" value={489} trend={{ dir: 'up', text: '+12% vs yesterday' }} />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Panel title="Inquiries Over Time" subtitle="Last 30 days">
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <AreaChart data={inquirySeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.gold} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={CHART_COLORS.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                <XAxis dataKey="date" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} width={32} />
                <Tooltip
                  contentStyle={{ background: CHART_COLORS.tooltipBg, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
                  cursor={{ stroke: CHART_COLORS.gold, strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="inquiries"
                  stroke={CHART_COLORS.gold}
                  strokeWidth={2}
                  fill="url(#goldFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Revenue by Area" subtitle="Last 30 days">
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={REVENUE_BY_AREA}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={92}
                  strokeWidth={0}
                >
                  {REVENUE_BY_AREA.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS.series[i % CHART_COLORS.series.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: CHART_COLORS.tooltipBg, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
                  formatter={(v) => `${v}%`}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: CHART_COLORS.ink400 }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Recent leads */}
      <Panel
        title="Recent Leads"
        subtitle={`${leads.length} total leads — showing latest 10`}
        action={
          <Link to="/dashboard/leads" className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-gold-500 hover:text-gold-300">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        }
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Property</th>
                <th className="px-5 py-3">Area</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Agent</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => {
                const property = properties.find((p) => p.id === lead.property_id)
                const agent = agents.find((a) => a.id === lead.agent_id)
                const SourceIcon = SOURCE_META[lead.source]?.icon
                const sourceColor = SOURCE_META[lead.source]?.color
                return (
                  <tr key={lead.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-sm text-ink-100">{lead.name}</td>
                    <td className="px-5 py-3 text-sm text-ink-300">
                      {property ? (
                        <Link to={`/properties/${property.id}`} className="hover:text-gold-300">
                          {property.title.slice(0, 30)}…
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-5 py-3 text-sm text-ink-300">{property?.location || '—'}</td>
                    <td className="px-5 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-5 py-3 text-sm text-ink-300">{agent?.name.split(' ')[0] || '—'}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-ink-300">
                        {SourceIcon && <SourceIcon className={`h-3.5 w-3.5 ${sourceColor}`} />}
                        {SOURCE_META[lead.source]?.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-[11px] text-ink-400">
                      {timeAgo(lead.last_activity)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Agent Performance" subtitle="Deals closed this year">
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={agentPerf} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid stroke={CHART_COLORS.grid} horizontal={false} />
                <XAxis type="number" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} width={70} />
                <Tooltip
                  contentStyle={{ background: CHART_COLORS.tooltipBg, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
                  cursor={{ fill: 'rgba(212,175,55,0.06)' }}
                />
                <Bar dataKey="deals" fill={CHART_COLORS.gold} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Top Viewed Properties" subtitle="Highest views this month">
          <ul className="divide-y divide-white/5">
            {topViewed.map((p, i) => (
              <li key={p.id}>
                <Link
                  to={`/properties/${p.id}`}
                  className="flex items-center gap-4 py-3 transition-colors hover:bg-white/[0.02]"
                >
                  <span className="font-numbers text-2xl text-gold-500">{String(i + 1).padStart(2, '0')}</span>
                  <img src={p.images[0]} alt="" className="h-12 w-12 flex-shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink-100">{p.title}</p>
                    <p className="text-[11px] text-ink-400">{p.location} · {p.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-numbers text-xl tracking-wider text-gold-300">{p.views.toLocaleString()}</p>
                    <p className="text-[10px] uppercase tracking-widest text-ink-400">views</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="font-numbers text-lg tracking-wider text-emerald-400">{Math.round((p.views / 30) * 0.12)}%</p>
                    <p className="text-[10px] uppercase tracking-widest text-ink-400">conv</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}

function timeAgo(iso) {
  const t = new Date(iso).getTime()
  const m = Math.round((Date.now() - t) / 60000)
  if (m < 60) return `${m}m`
  if (m < 1440) return `${Math.round(m / 60)}h`
  return `${Math.round(m / 1440)}d`
}
