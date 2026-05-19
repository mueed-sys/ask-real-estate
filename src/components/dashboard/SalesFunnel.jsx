import { motion } from 'framer-motion'
import leadsData from '../../data/dashboard/leads.json'
import agentsData from '../../data/agents.json'

function buildStages(leads) {
  const total = leads.length
  const reached = (statuses) => leads.filter((l) => statuses.includes(l.status)).length
  const counts = [
    total,
    reached(['contacted', 'viewing', 'negotiating', 'closed']),
    reached(['viewing', 'negotiating', 'closed']),
    reached(['negotiating', 'closed']),
    reached(['closed']),
  ]
  const FILLS = [
    { fill: 'rgba(212,175,55,0.85)', text: '#0a0b14' },
    { fill: 'rgba(212,175,55,0.7)',  text: '#0a0b14' },
    { fill: 'rgba(212,175,55,0.55)', text: '#fff' },
    { fill: 'rgba(212,175,55,0.4)',  text: '#fff' },
    { fill: 'rgba(212,175,55,0.3)',  text: '#fff' },
  ]
  const LABELS = ['Inquiries', 'Leads', 'Viewings', 'Offers', 'Closed']
  const KEYS = ['inquiries', 'leads', 'viewings', 'offers', 'closed']
  return KEYS.map((key, i) => ({ key, label: LABELS[i], count: counts[i], ...FILLS[i] }))
}

function buildPerAgent(leads) {
  return agentsData.map((agent) => {
    const mine = leads.filter((l) => l.agent_id === agent.id)
    const r = (statuses) => mine.filter((l) => statuses.includes(l.status)).length
    return {
      name: agent.name.split(' ')[0],
      I: mine.length,
      L: r(['contacted', 'viewing', 'negotiating', 'closed']),
      V: r(['viewing', 'negotiating', 'closed']),
      O: r(['negotiating', 'closed']),
      C: r(['closed']),
    }
  }).filter((a) => a.I > 0)
}

const STAGES = buildStages(leadsData)
const PER_AGENT = buildPerAgent(leadsData)

function pctOfPrev(stages, i) {
  if (i === 0) return null
  const prev = stages[i - 1].count
  if (!prev) return 0
  return ((stages[i].count / prev) * 100).toFixed(0)
}

export default function SalesFunnel() {
  const max = STAGES[0].count
  return (
    <section aria-labelledby="funnel-title" className="card-lux p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="funnel-title" className="font-display text-xl text-ink-100 sm:text-2xl">Sales Funnel</h2>
          <p className="mt-1 text-xs text-ink-400">Inquiry → Closed · last 30 days</p>
        </div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-ivory-300">
          Overall conversion · {((STAGES[STAGES.length - 1].count / STAGES[0].count) * 100).toFixed(1)}%
        </p>
      </header>

      <div className="mt-6 space-y-3">
        {STAGES.map((s, i) => {
          const pct = (s.count / max) * 100
          const conv = pctOfPrev(STAGES, i)
          return (
            <div key={s.key} className="flex items-center gap-4">
              <div className="w-24 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory-300 sm:w-32">
                {s.label}
              </div>
              <div className="relative flex-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-12 items-center rounded-r-md px-4"
                  style={{ background: s.fill, color: s.text }}
                >
                  <span className="font-numbers text-base font-bold">{s.count.toLocaleString()}</span>
                </motion.div>
              </div>
              <div className="w-20 text-right text-xs sm:w-24">
                {conv != null ? <span className="text-ink-200">{conv}% <span className="text-ink-400">conv.</span></span> : <span className="text-ink-400">—</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Per-agent breakdown */}
      <div className="mt-8 overflow-x-auto">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">By agent</p>
        <table className="mt-3 w-full min-w-[480px] text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-[0.22em] text-ink-400">
              <th className="pb-2 pr-4">Agent</th>
              <th className="pb-2 px-2 text-right">Inq.</th>
              <th className="pb-2 px-2 text-right">Leads</th>
              <th className="pb-2 px-2 text-right">View.</th>
              <th className="pb-2 px-2 text-right">Offer</th>
              <th className="pb-2 pl-2 text-right">Closed</th>
              <th className="pb-2 pl-4 text-right">Conv.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {PER_AGENT.map((a) => (
              <tr key={a.name}>
                <td className="py-2.5 pr-4 text-ink-100">{a.name}</td>
                <td className="px-2 py-2.5 text-right tabular-nums text-ink-200">{a.I}</td>
                <td className="px-2 py-2.5 text-right tabular-nums text-ink-200">{a.L}</td>
                <td className="px-2 py-2.5 text-right tabular-nums text-ink-200">{a.V}</td>
                <td className="px-2 py-2.5 text-right tabular-nums text-ink-200">{a.O}</td>
                <td className="pl-2 py-2.5 text-right font-semibold tabular-nums text-gold-300">{a.C}</td>
                <td className="pl-4 py-2.5 text-right tabular-nums text-ink-200">{((a.C / a.I) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
