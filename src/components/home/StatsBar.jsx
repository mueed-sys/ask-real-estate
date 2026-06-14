import { TrendingUp, Home as HomeIcon, ShieldCheck, Calendar, Award } from 'lucide-react'
import Reveal from '../common/Reveal'

const STATS = [
  {
    icon: TrendingUp,
    display: '$3B+',
    label: 'AUM',
  },
  {
    icon: HomeIcon,
    display: '261+',
    label: 'Properties',
  },
  {
    icon: ShieldCheck,
    display: 'RICS',
    label: 'Accredited',
  },
  {
    icon: Calendar,
    display: 'Since 2016',
    label: 'Established',
  },
  {
    icon: Award,
    display: '9 Years',
    label: 'Experience',
  },
]

export default function StatsBar() {
  return (
    <Reveal>
      <div className="relative grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/5 bg-white/5 lg:grid-cols-5">
        {STATS.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="bg-ink-850/90 px-3 py-5 text-center sm:px-6 sm:py-8">
              <Icon className="mx-auto h-5 w-5 text-gold-500 sm:h-6 sm:w-6" strokeWidth={1.4} />
              <p className="mt-2 font-numbers text-2xl font-bold tracking-tight tabular-nums text-gold-gradient sm:mt-3 sm:text-4xl md:text-5xl">
                {item.display}
              </p>
              <p className="mt-1 text-[9px] font-medium uppercase tracking-widest text-ink-300 sm:text-[11px]">
                {item.label}
              </p>
            </div>
          )
        })}
      </div>
    </Reveal>
  )
}
