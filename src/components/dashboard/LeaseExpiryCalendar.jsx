import { useMemo } from 'react'
import properties from '../../data/properties.json'
import agents from '../../data/agents.json'

// Mock active tenancies. In production this would come from the leases store
// — for now we synthesise from rental properties + agent assignment, with
// renewal dates spread realistically across the next 6 months.
function buildTenancies() {
  const rentals = properties.filter((p) => p.purpose === 'rent').slice(0, 12)
  const today = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  return rentals.map((p, i) => {
    const seed = (p.id || 'X').charCodeAt(p.id.length - 1)
    const daysOut = (seed * 17 + i * 23) % 180 // 0–180 days
    const expires = new Date(today)
    expires.setDate(expires.getDate() + daysOut)
    return {
      id: p.id,
      property: p,
      tenant: ['Yousef Al Ali', 'Layla Hassan', 'Marc Renou', 'Sara Aziz', 'Tom Walker', 'Noor Faisal'][i % 6],
      agent: agents[i % agents.length],
      expires,
      daysOut,
    }
  })
}

function urgencyColor(days) {
  if (days < 30) return { fill: '#E5484D', label: '< 30 days' }
  if (days < 60) return { fill: '#F59E0B', label: '30 – 60 days' }
  if (days < 90) return { fill: '#F2C35F', label: '60 – 90 days' }
  return                { fill: '#10B981', label: '> 90 days' }
}

export default function LeaseExpiryCalendar() {
  const rows = useMemo(() => buildTenancies().sort((a, b) => a.daysOut - b.daysOut), [])
  const horizon = 180

  return (
    <section aria-labelledby="lease-title" className="card-lux p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="lease-title" className="font-display text-xl text-ink-100 sm:text-2xl">Lease Expiry Calendar</h2>
          <p className="mt-1 text-xs text-ink-400">Next 6 months · {rows.length} active tenancies</p>
        </div>
        <ul className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-ink-300">
          {[
            { fill: '#E5484D', label: '< 30 days' },
            { fill: '#F59E0B', label: '30 – 60' },
            { fill: '#F2C35F', label: '60 – 90' },
            { fill: '#10B981', label: '> 90' },
          ].map((it) => (
            <li key={it.label} className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: it.fill }} />
              {it.label}
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-[0.22em] text-ink-400">
              <th className="pb-2 pr-4">Property</th>
              <th className="pb-2 pr-4">Tenant</th>
              <th className="pb-2 pr-4">Agent</th>
              <th className="pb-2 pr-4">Expires</th>
              <th className="pb-2 pl-4">Timeline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r) => {
              const u = urgencyColor(r.daysOut)
              const left = (r.daysOut / horizon) * 100
              return (
                <tr key={r.id} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 pr-4">
                    <p className="truncate text-ink-100">{r.property.title}</p>
                    <p className="truncate text-[11px] text-ink-400">{r.property.location}</p>
                  </td>
                  <td className="py-2.5 pr-4 text-ink-200">{r.tenant}</td>
                  <td className="py-2.5 pr-4 text-ink-300">{r.agent.name.split(' ')[0]}</td>
                  <td className="py-2.5 pr-4 text-ink-200">
                    <span className="font-semibold">{r.daysOut}d</span>
                    <span className="ml-1 text-[11px] text-ink-400">
                      {r.expires.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </td>
                  <td className="py-2.5 pl-4">
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <span className="absolute left-0 top-0 h-full" style={{ width: `${Math.min(left, 100)}%`, background: u.fill }} />
                      <span className="absolute h-2 w-2 rounded-full ring-2 ring-ink-bg" style={{ left: `calc(${Math.min(left, 100)}% - 4px)`, background: u.fill }} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
