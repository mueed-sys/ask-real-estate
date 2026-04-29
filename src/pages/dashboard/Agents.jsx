import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts'
import { X, MessageCircle, Phone, Mail, Star, Briefcase, Award, Clock, TrendingUp } from 'lucide-react'

import Panel from '../../components/dashboard/Panel'
import { CHART_COLORS, agentDealsHistory } from '../../lib/dashboard'
import { useToast } from '../../store/useToast'

import agents from '../../data/agents.json'
import properties from '../../data/properties.json'
import leads from '../../data/dashboard/leads.json'
import { waLink } from '../../lib/whatsapp'

const AGENT_STATUS = ['active', 'away', 'off']

export default function Agents() {
  const pushToast = useToast((s) => s.push)
  const [selected, setSelected] = useState(null)
  // Mock per-agent status state
  const [statuses, setStatuses] = useState(
    Object.fromEntries(agents.map((a) => [a.id, AGENT_STATUS[Math.floor(a.years_with_ire / 4)] || 'active']))
  )

  const cycleStatus = (id) => {
    setStatuses((s) => {
      const cur = s[id]
      const next = AGENT_STATUS[(AGENT_STATUS.indexOf(cur) + 1) % AGENT_STATUS.length]
      return { ...s, [id]: next }
    })
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-300">
        {agents.length} agents · {agents.reduce((s, a) => s + a.active_listings, 0)} listings · {agents.reduce((s, a) => s + a.deals_closed_year, 0)} deals YTD
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const leadsCount = leads.filter((l) => l.agent_id === agent.id).length
          return (
            <motion.div
              key={agent.id}
              whileHover={{ y: -4 }}
              className="rounded-md border border-white/5 bg-white/[0.02] p-5 cursor-pointer transition-colors hover:border-gold-500/30"
              onClick={() => setSelected(agent)}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img src={agent.photo} alt="" className="h-16 w-16 rounded-full object-cover ring-1 ring-gold-500/30" />
                  <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-[#070810] ${statusDotColor(statuses[agent.id])}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl text-ink-100">{agent.name}</p>
                  <p className="text-[11px] uppercase tracking-widest text-gold-500">{agent.title}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); cycleStatus(agent.id); pushToast(`Status: ${statuses[agent.id]}`) }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-ink-200 hover:border-gold-500/40"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor(statuses[agent.id])}`} />
                    {statuses[agent.id]}
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat label="Listings" value={agent.active_listings} />
                <Stat label="Leads" value={leadsCount} />
                <Stat label="Closed" value={agent.deals_closed_year} />
                <Stat label="Rating" value={agent.rating.toFixed(1)} />
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-ink-400">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {agent.response_time}</span>
                <span>{agent.specializations.join(' · ')}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <AgentDetail agent={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function statusDotColor(s) {
  if (s === 'active') return 'bg-emerald-500'
  if (s === 'away') return 'bg-yellow-500'
  return 'bg-ink-500'
}

function Stat({ label, value }) {
  return (
    <div className="rounded border border-white/5 bg-white/[0.02] p-2.5 text-center">
      <p className="font-numbers text-2xl tracking-wider text-gold-300">{value}</p>
      <p className="mt-0.5 text-[9px] font-medium uppercase tracking-widest text-ink-400">{label}</p>
    </div>
  )
}

function AgentDetail({ agent, onClose }) {
  if (!agent) return null
  const listings = properties.filter((p) => p.agent_id === agent.id)
  const agentLeads = leads.filter((l) => l.agent_id === agent.id)
  const dealHistory = agentDealsHistory(agent.deals_closed_year / 6, agent.years_with_ire)
  const revenueMonth = Math.round(agent.deals_closed_year / 12) * 480

  return (
    <AnimatePresence>
      {agent && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto bg-[#0a0c18] shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#0a0c18]/95 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-4">
                <img src={agent.photo} alt="" className="h-12 w-12 rounded-full object-cover ring-1 ring-gold-500/30" />
                <div>
                  <h2 className="font-display text-2xl text-ink-100">{agent.name}</h2>
                  <p className="text-[11px] uppercase tracking-widest text-gold-500">{agent.title}</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-md p-2 text-ink-200 hover:text-gold-300">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatBlock icon={Briefcase} label="Listings" value={agent.active_listings} />
                <StatBlock icon={Award} label="Closed YTD" value={agent.deals_closed_year} />
                <StatBlock icon={Star} label="Rating" value={agent.rating.toFixed(1)} />
                <StatBlock icon={TrendingUp} label="Revenue MTD" value={`BD ${revenueMonth.toLocaleString()}`} />
              </div>

              <Panel title="Deals Closed" subtitle="Last 6 months">
                <div className="h-56">
                  <ResponsiveContainer>
                    <BarChart data={dealHistory}>
                      <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                      <XAxis dataKey="month" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} width={28} />
                      <Tooltip
                        contentStyle={{ background: CHART_COLORS.tooltipBg, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
                        cursor={{ fill: 'rgba(212,175,55,0.06)' }}
                      />
                      <Bar dataKey="deals" fill={CHART_COLORS.gold} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel title={`Active Listings (${listings.length})`} noPadding>
                <ul className="divide-y divide-white/5">
                  {listings.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                      <img src={p.images[0]} alt="" className="h-10 w-14 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-ink-100">{p.title}</p>
                        <p className="text-[11px] text-ink-400">{p.location} · {p.id}</p>
                      </div>
                      <span className="font-numbers text-base tracking-wider text-gold-300">BD {p.price}</span>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel title={`Active Leads (${agentLeads.length})`} noPadding>
                <ul className="divide-y divide-white/5">
                  {agentLeads.map((l) => {
                    const prop = properties.find((p) => p.id === l.property_id)
                    return (
                      <li key={l.id} className="flex items-center justify-between gap-3 px-5 py-3">
                        <div>
                          <p className="text-sm text-ink-100">{l.name}</p>
                          <p className="text-[11px] text-ink-400">{prop?.title.slice(0, 30) || ''}…</p>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-gold-500">{l.status}</span>
                      </li>
                    )
                  })}
                </ul>
              </Panel>

              <div className="flex items-center gap-2">
                <a href={waLink({ agent })} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#25D366] py-2.5 text-xs font-semibold text-white">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
                <a href={`tel:${agent.phone}`} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-ink-200 hover:border-gold-500/40">
                  <Phone className="h-3.5 w-3.5" />
                </a>
                <a href={`mailto:${agent.email}`} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-ink-200 hover:border-gold-500/40">
                  <Mail className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function StatBlock({ icon: Icon, label, value }) {
  return (
    <div className="rounded-md border border-white/5 bg-white/[0.02] p-4 text-center">
      <Icon className="mx-auto h-4 w-4 text-gold-500" strokeWidth={1.5} />
      <p className="mt-2 font-numbers text-xl tracking-wider text-gold-gradient">{value}</p>
      <p className="mt-0.5 text-[9px] font-medium uppercase tracking-widest text-ink-400">{label}</p>
    </div>
  )
}
