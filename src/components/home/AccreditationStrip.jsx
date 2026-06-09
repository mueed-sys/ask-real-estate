import { BRAND } from '../../lib/constants'
import Reveal from '../common/Reveal'

const BADGES = [
  { label: 'RERA', sub: 'Licensed Broker' },
  { label: 'RICS', sub: 'Accredited Firm' },
  { label: 'IVSC', sub: 'Valuation Standards' },
  { label: 'ISO 9001', sub: 'Quality Certified' },
]

export default function AccreditationStrip() {
  return (
    <div className="relative border-y border-white/[0.06] bg-ink-card/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)]" />
      <div className="container-lux relative py-8">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-500 sm:block">
              {BRAND.legalName}
            </p>
            <div className="h-10 w-px bg-white/10 hidden sm:block" />
            {BADGES.map(({ label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="font-display text-lg font-bold text-ink-100">{label}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink-400">{sub}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
