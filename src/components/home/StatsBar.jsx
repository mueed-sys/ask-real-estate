import { useTranslation } from 'react-i18next'
import { Award, Users, Home as HomeIcon, ShieldCheck } from 'lucide-react'
import CountUp from '../common/CountUp'
import Reveal from '../common/Reveal'
import { STATS } from '../../lib/constants'

export default function StatsBar() {
  const { t } = useTranslation()

  const items = [
    {
      icon: Award,
      value: STATS.yearsExperience,
      labelKey: 'stats.experience',
      format: (n) => `${n}+`,
      param: 'years',
    },
    {
      icon: Users,
      value: STATS.happyClients,
      labelKey: 'stats.clients',
      format: (n) => `${(n / 1000).toFixed(0)}K+`,
      param: 'count',
    },
    {
      icon: HomeIcon,
      value: STATS.propertiesListed,
      labelKey: 'stats.listings',
      format: (n) => `${n.toLocaleString()}+`,
      param: 'count',
    },
    {
      icon: ShieldCheck,
      value: null,
      labelKey: 'stats.rera',
      static: true,
    },
  ]

  return (
    <Reveal>
      <div className="relative grid gap-px overflow-hidden rounded-sm border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="bg-ink-850/90 px-6 py-8 text-center">
              <Icon className="mx-auto h-6 w-6 text-gold-500" strokeWidth={1.4} />
              <p className="mt-3 font-numbers text-4xl font-semibold tracking-tight tabular-nums text-gold-gradient md:text-6xl">
                {item.static ? (
                  <span>RERA</span>
                ) : (
                  <CountUp to={item.value} format={item.format} duration={1800} />
                )}
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-ink-300">
                {item.static ? 'Licensed Brokerage' : t(item.labelKey, { [item.param]: '' }).replace(/\d+\+\s?/, '')}
              </p>
            </div>
          )
        })}
      </div>
    </Reveal>
  )
}
