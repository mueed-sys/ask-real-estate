import { useMemo, useState } from 'react'
import { Filter, FileText, Edit, DollarSign, LogIn, Trash2, Eye, Download } from 'lucide-react'
import Panel from '../../components/dashboard/Panel'
import agents from '../../data/agents.json'
import properties from '../../data/properties.json'

// Synthesised audit log — covers each major action type the brief mentions.
function buildLog() {
  const types = ['edit', 'close', 'download', 'price', 'login', 'delete', 'view']
  const actors = agents.slice(0, 6)
  const baseDate = new Date(2026, 3, 30, 14, 12)
  const out = []
  for (let i = 0; i < 60; i++) {
    const t = types[i % types.length]
    const actor = actors[(i * 3) % actors.length]
    const property = properties[(i * 7) % properties.length]
    const ts = new Date(baseDate)
    ts.setMinutes(ts.getMinutes() - i * (8 + (i % 6) * 5))
    out.push({
      id: i + 1,
      ts,
      type: t,
      user: actor.name,
      target: property.id,
      detail: detailFor(t, property),
    })
  }
  return out
}

function detailFor(type, property) {
  switch (type) {
    case 'edit':     return `Updated description and 2 photos on ${property.id}`
    case 'close':    return `Marked lead L-${property.id.slice(-3)} as Closed`
    case 'download': return `Downloaded Tenancy Agreement for ${property.id}`
    case 'price':    return `Changed price from BD ${(property.price * 1.05).toFixed(0)} → BD ${property.price}`
    case 'login':    return 'Signed in via password (web)'
    case 'delete':   return `Removed photo IMG_${property.id.slice(-3)}_03 from ${property.id}`
    case 'view':     return `Opened public listing for ${property.id}`
    default:         return ''
  }
}

const ICONS = {
  edit:     { icon: Edit,     color: 'text-info-300' },
  close:    { icon: FileText, color: 'text-success-300' },
  download: { icon: Download, color: 'text-gold-300' },
  price:    { icon: DollarSign, color: 'text-warning-300' },
  login:    { icon: LogIn,    color: 'text-ink-200' },
  delete:   { icon: Trash2,   color: 'text-danger-300' },
  view:     { icon: Eye,      color: 'text-ivory-300' },
}

export default function DashAudit() {
  const log = useMemo(buildLog, [])
  const [type, setType] = useState('all')
  const [user, setUser] = useState('all')
  const filtered = log.filter((r) => (type === 'all' || r.type === type) && (user === 'all' || r.user === user))

  return (
    <div className="space-y-5">
      <Panel title="Activity Audit Log" subtitle="Compliance-ready, chronological record of every dashboard action" noPadding>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/5 px-5 py-3">
          <Filter className="h-3.5 w-3.5 text-gold-300" strokeWidth={1.6} />
          <Select label="Action" value={type} onChange={setType} options={[
            ['all', 'All actions'],
            ['edit', 'Listing edits'],
            ['close', 'Lead closures'],
            ['download', 'Document downloads'],
            ['price', 'Price changes'],
            ['login', 'Logins'],
            ['delete', 'Deletions'],
            ['view', 'Listing views'],
          ]} />
          <Select label="User" value={user} onChange={setUser} options={[['all', 'All users'], ...agents.map((a) => [a.name, a.name])]} />
          <p className="ml-auto text-[11px] text-ink-400">{filtered.length} of {log.length} entries</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.22em] text-ink-400">
                <th className="px-5 pb-2 pt-3">Time</th>
                <th className="px-5 pb-2 pt-3">User</th>
                <th className="px-5 pb-2 pt-3">Action</th>
                <th className="px-5 pb-2 pt-3">Target</th>
                <th className="px-5 pb-2 pt-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((r) => {
                const meta = ICONS[r.type]
                const Icon = meta.icon
                return (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-[12px] text-ink-300 tabular-nums">
                      {r.ts.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3 text-ink-200">{r.user}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <Icon className={`h-3.5 w-3.5 ${meta.color}`} strokeWidth={1.7} />
                        <span className={meta.color}>{r.type}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-ink-200">{r.target}</td>
                    <td className="px-5 py-3 text-[12px] text-ink-300">{r.detail}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-ink-300">
      <span className="text-[10px] uppercase tracking-[0.22em] text-ivory-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-ink-100 outline-none focus:border-gold-500/40"
      >
        {options.map(([val, lbl]) => (
          <option key={val} value={val} className="bg-ink-900">{lbl}</option>
        ))}
      </select>
    </label>
  )
}
