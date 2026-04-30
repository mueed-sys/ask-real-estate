import { Zap, Info } from 'lucide-react'

// Map unit type/size to mock EWA monthly bill ranges (BD). These are realistic
// averages for Bahraini units; would be admin-editable in production.
const RANGE = {
  studio: [15, 25],
  '1br':  [25, 40],
  '2br':  [35, 60],
  '3br':  [50, 80],
  villa:  [80, 150],
}

function bracketFor(p) {
  if (p.type?.toLowerCase() === 'villa') return 'villa'
  const beds = p.bedrooms || 0
  if (beds === 0) return 'studio'
  if (beds === 1) return '1br'
  if (beds === 2) return '2br'
  return '3br'
}

export default function EWAEstimate({ property }) {
  const key = bracketFor(property)
  const [low, high] = RANGE[key]
  return (
    <section aria-labelledby="ewa-est-title" className="card-lux p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-warning-500/30 bg-warning-500/10 text-warning-300">
          <Zap className="h-4 w-4" strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <h3 id="ewa-est-title" className="font-display text-lg text-ink-100">
            Estimated Monthly Bills
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-ink-300">
            EWA (Electricity & Water Authority) — based on average usage for similar units in {property.location}.
          </p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-numbers text-3xl font-bold tracking-tight text-warning-300">
              BD {low}–{high}
            </span>
            <span className="text-sm text-ink-300">/ month</span>
          </div>

          <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-ink-400" title="Based on summer + winter average">
            <Info className="h-3 w-3" strokeWidth={1.6} />
            Cooling/AC usage is the largest variable in summer.
          </p>
        </div>
      </div>
    </section>
  )
}
