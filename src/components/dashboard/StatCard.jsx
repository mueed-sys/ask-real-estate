import { TrendingUp, TrendingDown } from 'lucide-react'
import CountUp from '../common/CountUp'

// Compact KPI card — icon + label + animated number + optional trend chip.
export default function StatCard({
  icon: Icon,
  label,
  value,
  format = (n) => n.toLocaleString(),
  prefix = '',
  suffix = '',
  trend,        // { dir: 'up' | 'down', text: '+12 this week' }
  duration = 1500,
}) {
  return (
    <div className="rounded-md border border-white/5 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-300">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-gold-500" strokeWidth={1.5} />}
      </div>
      <p className="mt-3 font-numbers text-5xl tracking-wider text-gold-gradient leading-none">
        {prefix}
        <CountUp to={value} format={format} duration={duration} />
        {suffix}
      </p>
      {trend && (
        <div
          className={`mt-3 inline-flex items-center gap-1 text-[11px] font-medium ${
            trend.dir === 'up' ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {trend.dir === 'up' ? (
            <TrendingUp className="h-3 w-3" strokeWidth={2} />
          ) : (
            <TrendingDown className="h-3 w-3" strokeWidth={2} />
          )}
          {trend.text}
        </div>
      )}
    </div>
  )
}
