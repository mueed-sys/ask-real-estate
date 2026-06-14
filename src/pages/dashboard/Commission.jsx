import { useMemo } from 'react'
import { Download, TrendingUp } from 'lucide-react'
import Panel from '../../components/dashboard/Panel'
import agents from '../../data/agents.json'
import properties from '../../data/properties.json'
import { useToast } from '../../store/useToast'

// Mock closed deals — synthesised from properties + agents so rates flow.
// Rentals = 1 month rent commission. Sales = 2% of price.
function buildClosed() {
  const closed = []
  agents.forEach((agent, i) => {
    const pickedRent = properties.filter((p) => p.purpose === 'rent' && p.agent_id === agent.id).slice(0, 2 + (i % 2))
    const pickedSale = properties.filter((p) => p.purpose === 'sale' && p.agent_id === agent.id).slice(0, 1 + (i % 2))
    pickedRent.forEach((p, j) => {
      closed.push({
        id: `R-${p.id}-${j}`,
        agent,
        property: p,
        type: 'rent',
        commission: p.price, // 1 month
        closedOn: `${10 + (j * 4)} Apr 2026`,
        period: 'monthly',
      })
    })
    pickedSale.forEach((p, j) => {
      closed.push({
        id: `S-${p.id}-${j}`,
        agent,
        property: p,
        type: 'sale',
        commission: Math.round(p.price * 0.02),
        closedOn: `${5 + (j * 6)} Apr 2026`,
        period: '2% of sale',
      })
    })
  })
  return closed
}

export default function DashCommission() {
  const pushToast = useToast((s) => s.push)
  const closed = useMemo(buildClosed, [])

  const monthly = useMemo(() => {
    const map = new Map()
    closed.forEach((d) => {
      const cur = map.get(d.agent.id) || { agent: d.agent, month: 0, ytd: 0, count: 0 }
      cur.month += d.commission
      cur.ytd   += d.commission * 4 // mock 4× rolled-up YTD
      cur.count += 1
      map.set(d.agent.id, cur)
    })
    return [...map.values()].sort((a, b) => b.month - a.month)
  }, [closed])

  const teamMonth = monthly.reduce((s, a) => s + a.month, 0)
  const teamYtd   = monthly.reduce((s, a) => s + a.ytd,   0)

  const exportCsv = () => {
    const now = new Date()
    const monthName = now.toLocaleString('en-US', { month: 'long' }).toLowerCase()
    const year = now.getFullYear()
    const filename = `ask-commission-${monthName}-${year}.csv`

    const header = ['Agent', 'Property', 'Type', 'Closed', 'Commission BD'].join(',')
    const rows = closed.map((d) => [d.agent.name, d.property.id, d.type, d.closedOn, d.commission].join(','))
    const csv = [header, ...rows].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    pushToast('Exported to CSV — sent to /Downloads')
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Headline stats */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
        <Stat label="Team commission · this month" value={teamMonth} sub={`${closed.length} deals closed`} />
        <Stat label="Team commission · YTD" value={teamYtd} sub="Rolling 12 months" muted />
        <Stat label="Avg per agent" value={Math.round(teamMonth / monthly.length)} sub="This month" muted />
      </div>

      {/* Per agent */}
      <Panel
        title="By Agent"
        subtitle="Auto-calculated when a lead is moved to Closed"
        action={
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 rounded-md border border-gold-500/30 bg-gold-500/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300 hover:bg-gold-500/10"
          >
            <Download className="h-3.5 w-3.5" /> Export to Payroll
          </button>
        }
        noPadding
      >
        <ul className="divide-y divide-white/5">
          {monthly.map(({ agent, month, ytd, count }, i) => (
            <li key={agent.id} className="flex items-center gap-4 px-5 py-4">
              <img src={agent.photo} alt="" className="h-10 w-10 rounded-full object-cover ring-1 ring-gold-500/30" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink-100">{agent.name}</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-ivory-300">{agent.title}</p>
              </div>
              <div className="text-right">
                <p className="font-numbers text-base font-bold text-gold-300">BD {month.toLocaleString()}</p>
                <p className="text-[11px] text-ink-400">{count} deal{count === 1 ? '' : 's'} · YTD BD {ytd.toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      {/* Per property */}
      <Panel title="By Property" subtitle="Closed deals · April 2026" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.22em] text-ink-400">
                <th className="px-5 pb-2 pt-3">Property</th>
                <th className="px-5 pb-2 pt-3">Agent</th>
                <th className="px-5 pb-2 pt-3">Type</th>
                <th className="px-5 pb-2 pt-3">Closed</th>
                <th className="px-5 pb-2 pt-3 text-right">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {closed.map((d) => (
                <tr key={d.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <p className="text-ink-100">{d.property.title}</p>
                    <p className="text-[11px] text-ink-400">{d.property.id} · {d.property.location}</p>
                  </td>
                  <td className="px-5 py-3 text-ink-200">{d.agent.name.split(' ')[0]}</td>
                  <td className="px-5 py-3 text-ink-300">{d.period}</td>
                  <td className="px-5 py-3 text-ink-300">{d.closedOn}</td>
                  <td className="px-5 py-3 text-right font-numbers font-bold text-gold-300">BD {d.commission.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

function Stat({ label, value, sub, muted }) {
  return (
    <div className={`card-lux p-5 ${muted ? '' : 'ring-1 ring-gold-500/25'}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">{label}</p>
      <p className="mt-3 font-numbers text-3xl font-extrabold tracking-tight text-gold-gradient sm:text-4xl">
        BD {value.toLocaleString()}
      </p>
      {sub && <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-ink-400">
        <TrendingUp className="h-3 w-3" /> {sub}
      </p>}
    </div>
  )
}
