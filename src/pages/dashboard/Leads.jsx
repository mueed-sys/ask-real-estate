import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutGrid, Rows3, X, MessageCircle, Mail, Phone, Sparkles, Plus, Search,
} from 'lucide-react'

import Panel from '../../components/dashboard/Panel'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { SOURCE_META } from '../../lib/dashboard'
import { useToast } from '../../store/useToast'

import leadsData from '../../data/dashboard/leads.json'
import properties from '../../data/properties.json'
import agents from '../../data/agents.json'
import { waLink } from '../../lib/whatsapp'

const COLUMNS = [
  { id: 'new',         label: 'New',                accent: 'border-blue-500/40    bg-blue-500/[0.04]' },
  { id: 'contacted',   label: 'Contacted',          accent: 'border-yellow-500/40  bg-yellow-500/[0.04]' },
  { id: 'viewing',     label: 'Viewing Scheduled',  accent: 'border-orange-500/40  bg-orange-500/[0.04]' },
  { id: 'negotiating', label: 'Negotiating',        accent: 'border-purple-500/40  bg-purple-500/[0.04]' },
  { id: 'closed',      label: 'Closed',             accent: 'border-emerald-500/40 bg-emerald-500/[0.04]' },
]

export default function Leads() {
  const pushToast = useToast((s) => s.push)
  const [view, setView] = useState('kanban')
  const [leads, setLeads] = useState(leadsData)
  const [open, setOpen] = useState(null)
  const [search, setSearch] = useState('')
  const [draggingId, setDraggingId] = useState(null)

  const filtered = useMemo(() => {
    if (!search) return leads
    const q = search.toLowerCase()
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        (properties.find((p) => p.id === l.property_id)?.title || '').toLowerCase().includes(q)
    )
  }, [leads, search])

  const moveLead = (id, status) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status, last_activity: new Date().toISOString() } : l)))
    pushToast(`Moved ${id} to ${status}`)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-gold-500/20 bg-gold-500/[0.04] p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
          <p className="text-sm text-ink-200">
            <span className="font-semibold text-gold-300">Every inquiry tracked. No lead falls through the cracks.</span>{' '}
            Know exactly where every deal stands and which agent owns it.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads"
            className="w-72 rounded-md border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-ink-100 outline-none focus:border-gold-500/40"
          />
        </div>
        <span className="text-[11px] uppercase tracking-widest text-ink-400">{filtered.length} leads</span>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-md border border-white/10 p-0.5">
            <ViewBtn icon={LayoutGrid} active={view === 'kanban'} onClick={() => setView('kanban')} label="Kanban" />
            <ViewBtn icon={Rows3} active={view === 'table'} onClick={() => setView('table')} label="Table" />
          </div>
          <button onClick={() => pushToast('Create lead — coming soon')} className="btn-gold inline-flex items-center gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" /> New Lead
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        // Horizontal-scroll kanban on phone (swipe through 5 columns), grid on
        // tablet/desktop. Negative-margin trick lets columns flush to edges
        // for a phone-native swipe feel.
        <div className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none px-3 pb-2 sm:-mx-5 sm:px-5 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-5">
          {COLUMNS.map((col) => {
            const inCol = filtered.filter((l) => l.status === col.id)
            return (
              <div
                key={col.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggingId) {
                    moveLead(draggingId, col.id)
                    setDraggingId(null)
                  }
                }}
                className={`w-[80vw] flex-shrink-0 snap-start rounded-md border md:w-auto ${col.accent} p-3 min-h-[400px]`}
              >
                <header className="mb-3 flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest text-ink-100">{col.label}</h3>
                  <span className="font-numbers text-sm font-bold tracking-tight tabular-nums text-gold-300">{inCol.length}</span>
                </header>
                <ul className="space-y-2">
                  {inCol.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onClick={() => setOpen(lead)}
                      onDragStart={() => setDraggingId(lead.id)}
                    />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      ) : (
        <Panel title={`${filtered.length} leads`} noPadding>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Area</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3">First Contact</th>
                  <th className="px-4 py-3">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => {
                  const prop = properties.find((p) => p.id === l.property_id)
                  const agent = agents.find((a) => a.id === l.agent_id)
                  const Src = SOURCE_META[l.source]?.icon
                  return (
                    <tr key={l.id} onClick={() => setOpen(l)} className="cursor-pointer border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-sm text-ink-100">{l.name}</td>
                      <td className="px-4 py-3 text-xs text-ink-300">{l.phone}</td>
                      <td className="px-4 py-3 text-xs text-ink-300">{l.email}</td>
                      <td className="px-4 py-3 text-xs text-ink-300">{prop?.title.slice(0, 24) || '—'}…</td>
                      <td className="px-4 py-3 text-xs text-ink-300">{prop?.location || '—'}</td>
                      <td className="px-4 py-3 font-numbers text-sm font-bold tracking-tight tabular-nums text-gold-300">BD {l.budget?.toLocaleString()}</td>
                      <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                      <td className="px-4 py-3 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-ink-300">
                          {Src && <Src className={`h-3.5 w-3.5 ${SOURCE_META[l.source].color}`} />}
                          {SOURCE_META[l.source]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-300">{agent?.name.split(' ')[0] || '—'}</td>
                      <td className="px-4 py-3 text-[11px] text-ink-400">{l.first_contact.slice(5, 10)}</td>
                      <td className="px-4 py-3 text-[11px] text-ink-400">{l.last_activity.slice(5, 10)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <LeadDetail
        lead={open}
        onClose={() => setOpen(null)}
        onMove={(s) => { if (open) { moveLead(open.id, s); setOpen({ ...open, status: s }) } }}
      />
    </div>
  )
}

function ViewBtn({ icon: Icon, active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium tracking-wide ${
        active ? 'bg-gold-500/10 text-gold-300' : 'text-ink-300 hover:text-gold-300'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

function LeadCard({ lead, onClick, onDragStart }) {
  const property = properties.find((p) => p.id === lead.property_id)
  const agent = agents.find((a) => a.id === lead.agent_id)
  const Src = SOURCE_META[lead.source]?.icon

  return (
    <li>
      <article
        draggable
        onDragStart={onDragStart}
        onClick={onClick}
        className="cursor-grab rounded-md border border-white/5 bg-ink-900 p-3 transition-all hover:border-gold-500/30 active:cursor-grabbing"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink-100">{lead.name}</p>
          {Src && <Src className={`h-3.5 w-3.5 ${SOURCE_META[lead.source].color}`} />}
        </div>
        {property && (
          <p className="mt-1 truncate text-xs text-ink-400">{property.title}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-ink-400">{timeAgo(lead.last_activity)}</span>
          {agent && (
            <img src={agent.photo} alt={agent.name} className="h-5 w-5 rounded-full ring-1 ring-gold-500/30" title={agent.name} />
          )}
        </div>
      </article>
    </li>
  )
}

function LeadDetail({ lead, onClose, onMove }) {
  if (!lead) return null
  const property = properties.find((p) => p.id === lead.property_id)
  const agent = agents.find((a) => a.id === lead.agent_id)

  return (
    <AnimatePresence>
      {lead && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto bg-[#0a0c18] shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#0a0c18]/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="font-numbers text-sm font-bold tracking-tight tabular-nums text-gold-400">{lead.id}</p>
                <h2 className="mt-0.5 font-display text-3xl text-ink-100">{lead.name}</h2>
              </div>
              <button onClick={onClose} className="rounded-md p-2 text-ink-200 hover:text-gold-300">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="space-y-6 p-6">
              <StatusBadge status={lead.status} />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Phone" value={lead.phone} />
                <Info label="Email" value={lead.email} />
                <Info label="Budget" value={`BD ${lead.budget?.toLocaleString()}`} />
                <Info label="Source" value={SOURCE_META[lead.source]?.label} />
              </div>

              {property && (
                <div className="rounded-md border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-500">Property</p>
                  <a href={`/properties/${property.id}`} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-3 hover:text-gold-300">
                    <img src={property.images[0]} alt="" className="h-14 w-20 rounded object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink-100">{property.title}</p>
                      <p className="text-[11px] text-ink-400">{property.location} · {property.id}</p>
                    </div>
                  </a>
                </div>
              )}

              {agent && (
                <div className="rounded-md border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-500">Assigned Agent</p>
                  <div className="mt-2 flex items-center gap-3">
                    <img src={agent.photo} alt="" className="h-12 w-12 rounded-full object-cover ring-1 ring-gold-500/30" />
                    <div>
                      <p className="text-sm text-ink-100">{agent.name}</p>
                      <p className="text-[11px] text-ink-400">{agent.title}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-500">Move to</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {COLUMNS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onMove(c.id)}
                      disabled={c.id === lead.status}
                      className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-widest transition-colors ${
                        c.id === lead.status
                          ? 'cursor-not-allowed border-gold-500/40 bg-gold-500/10 text-gold-300'
                          : 'border-white/10 text-ink-300 hover:border-gold-500/40'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-500">Activity Timeline</p>
                <ol className="relative mt-4 space-y-4 border-l border-white/10 pl-5">
                  {lead.timeline?.map((e, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-gold-500 ring-4 ring-[#0a0c18]" />
                      <p className="text-[10px] uppercase tracking-widest text-ink-400">{new Date(e.time).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                      <p className="mt-0.5 text-sm text-ink-100">{e.text}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Notes */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-500">Notes</p>
                <textarea
                  rows={3}
                  defaultValue={lead.notes}
                  className="mt-2 w-full rounded border border-white/10 bg-white/[0.03] p-3 text-sm text-ink-200 outline-none focus:border-gold-500/40"
                />
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={waLink({ text: `Hi ${lead.name},` })}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#25D366] py-2.5 text-xs font-semibold text-white"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
                <a href={`mailto:${lead.email}`} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/10 py-2.5 text-xs text-ink-200 hover:border-gold-500/40">
                  <Mail className="h-3.5 w-3.5" /> Email
                </a>
                <a href={`tel:${lead.phone}`} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/10 py-2.5 text-xs text-ink-200 hover:border-gold-500/40">
                  <Phone className="h-3.5 w-3.5" /> Call
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-md border border-white/5 bg-white/[0.02] p-3">
      <p className="text-[10px] font-medium uppercase tracking-widest text-ink-400">{label}</p>
      <p className="mt-1 text-sm text-ink-100">{value}</p>
    </div>
  )
}

function timeAgo(iso) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 60) return `${m}m`
  if (m < 1440) return `${Math.round(m / 60)}h`
  return `${Math.round(m / 1440)}d`
}
