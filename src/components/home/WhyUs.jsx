import { useTranslation } from 'react-i18next'
import { ShieldCheck, MessageCircle, BarChart2, Layers } from 'lucide-react'
import SectionHeader from '../common/SectionHeader'
import Reveal from '../common/Reveal'

const ITEMS = [
  { icon: ShieldCheck, titleKey: 'why.verified_title', textKey: 'why.verified_text' },
  { icon: MessageCircle, titleKey: 'why.whatsapp_title', textKey: 'why.whatsapp_text' },
  { icon: BarChart2, titleKey: 'why.knowledge_title', textKey: 'why.knowledge_text' },
  { icon: Layers, titleKey: 'why.support_title', textKey: 'why.support_text' },
]

export default function WhyUs() {
  const { t } = useTranslation()

  return (
    <div className="container-lux">
      <SectionHeader
        eyebrow={t('sections.why_eyebrow')}
        title={t('sections.why_title')}
        subtitle={t('sections.why_subtitle')}
      />

      <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, titleKey, textKey }, i) => (
          <Reveal key={titleKey} delay={i * 0.08}>
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-card p-6 transition-all hover:border-gold-500/20 hover:shadow-gold-soft">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.05),transparent_60%)] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/20 bg-gold-500/[0.08]">
                  <Icon className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink-100">{t(titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{t(textKey)}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
