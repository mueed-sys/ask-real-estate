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
    <div className="rounded-md border border-white/5 bg-white/[0.02] p-3 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-ink-300 sm:text-[10px]">{label}</p>
        {Icon && <Icon className="h-3.5 w-3.5 flex-shrink-0 text-gold-500 sm:h-4 sm:w-4" strokeWidth={1.5} />}
      </div>
      <p className="mt-2 font-numbers text-2xl font-semibold leading-none tracking-tight tabular-nums text-gold-gradient sm:mt-3 sm:text-3xl md:text-4xl">
        {prefix}
        <CountUp to={value} format={format} duration={duration} />
        {suffix}
      </p>
      {trend && (
        <div
          className={`mt-2 inline-flex items-center gap-1 text-[10px] font-medium sm:mt-3 sm:text-[11px] ${
            trend.dir === 'up' ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {trend.dir === 'up' ? (
            <TrendingUp className="h-3 w-3" strokeWidth={2} />
          ) : (
            <TrendingDown className="h-3 w-3" strokeWidth={2} />
          )}
          <span className="truncate">{trend.text}</span>
        </div>
      )}
    </div>
  )
}
