import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Award, Sparkles, Lightbulb, Users, ArrowUpRight } from 'lucide-react'

import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'
import AgentCard from '../components/agent/AgentCard'

import agents from '../data/agents.json'
import { BRAND, SITE_URL, STATS } from '../lib/constants'

const TIMELINE = [
  { year: 2016, key: 'timeline.y2016' },
  { year: 2017, key: 'timeline.y2017' },
  { year: 2018, key: 'timeline.y2018' },
  { year: 2019, key: 'timeline.y2019' },
  { year: 2020, key: 'timeline.y2020' },
  { year: 2021, key: 'timeline.y2021' },
  { year: 2023, key: 'timeline.y2023' },
  { year: 2024, key: 'timeline.y2024' },
]

const VALUES = [
  { icon: Award, t: 'values.trust_title', d: 'values.trust_text' },
  { icon: Sparkles, t: 'values.excellence_title', d: 'values.excellence_text' },
  { icon: Lightbulb, t: 'values.innovation_title', d: 'values.innovation_text' },
  { icon: Users, t: 'values.client_title', d: 'values.client_text' },
]

export default function About() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>{`${t('about.title')} — ${BRAND.shortName}`}</title>
        <meta name="description" content={t('about.subtitle')} />
        <link rel="canonical" href={`${SITE_URL}/about`} />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2400&auto=format&fit=crop&q=80"
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/80 via-ink-900/95 to-ink-900" />
        </div>
        <div className="container-lux relative py-24 lg:py-32">
          <Reveal>
            <span className="eyebrow">{BRAND.shortName}</span>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-tight text-ink-100 md:text-7xl">
              {t('about.title')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-200">{t('about.subtitle')}</p>
            <div className="gold-rule mt-8" />
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="container-lux py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <Reveal>
            <span className="eyebrow">{t('sections.story_title')}</span>
            <h2 className="mt-4 font-display text-4xl leading-tight text-ink-100 md:text-5xl">
              Nine years of Bahrain real estate.
            </h2>
            <div className="gold-rule mt-6" />
          </Reveal>
          <div className="space-y-5 text-base leading-relaxed text-ink-200">
            <Reveal delay={0.1}><p>{t('about.story_p1')}</p></Reveal>
            <Reveal delay={0.2}><p>{t('about.story_p2')}</p></Reveal>
            <Reveal delay={0.3}><p>{t('about.story_p3')}</p></Reveal>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-ink-950 py-16">
        <div className="container-lux">
          <div className="grid grid-cols-3 divide-x divide-white/5 text-center">
            {[
              { value: `${STATS.yearsExperience}+`, label: 'Years' },
              { value: `${(STATS.happyClients / 1000).toFixed(0)}K+`, label: 'Clients' },
              { value: `${STATS.propertiesListed.toLocaleString()}+`, label: 'Properties' },
            ].map((s) => (
              <div key={s.label} className="px-6">
                <p className="font-display text-5xl text-gold-gradient md:text-6xl">{s.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-ink-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-lux py-24">
        <SectionHeader eyebrow="Our History" title={t('sections.timeline_title')} align="center" />

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-gold-500/0 via-gold-500/40 to-gold-500/0 md:block" />
          {TIMELINE.map((item, i) => (
            <Reveal key={item.year} delay={i * 0.05}>
              <div className={`relative flex flex-col gap-4 py-6 md:flex-row md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="flex-1 md:text-right">
                  {i % 2 === 0 ? (
                    <>
                      <p className="font-display text-3xl text-gold-gradient">{item.year}</p>
                      <p className="mt-2 text-base text-ink-200">{t(item.key)}</p>
                    </>
                  ) : (
                    <div />
                  )}
                </div>
                <div className="hidden md:flex md:items-center">
                  <div className="h-3 w-3 rounded-full border-2 border-gold-500 bg-ink-900" />
                </div>
                <div className="flex-1">
                  {i % 2 !== 0 ? (
                    <>
                      <p className="font-display text-3xl text-gold-gradient">{item.year}</p>
                      <p className="mt-2 text-base text-ink-200">{t(item.key)}</p>
                    </>
                  ) : (
                    <div />
                  )}
                </div>
                {/* Mobile fallback */}
                <div className="md:hidden">
                  <p className="font-display text-3xl text-gold-gradient">{item.year}</p>
                  <p className="mt-2 text-base text-ink-200">{t(item.key)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink-850/40 py-24">
        <div className="container-lux">
          <SectionHeader eyebrow={t('sections.values_title')} title={t('sections.values_title')} align="center" />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon
              return (
                <Reveal key={v.t} delay={i * 0.08}>
                  <div className="card-lux flex h-full flex-col items-center p-8 text-center">
                    <Icon className="h-7 w-7 text-gold-500" strokeWidth={1.4} />
                    <h3 className="mt-5 font-display text-2xl text-ink-100">{t(v.t)}</h3>
                    <div className="my-3 h-px w-8 bg-gold-gradient" />
                    <p className="text-sm leading-relaxed text-ink-300">{t(v.d)}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-lux py-24">
        <SectionHeader eyebrow={t('agents_page.title')} title={t('sections.team_title')} align="center" />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.06}>
              <AgentCard agent={a} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink-950 py-24">
        <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-30" />
        <div className="container-lux relative text-center">
          <Reveal>
            <span className="eyebrow mx-auto justify-center">Start Your Journey</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight text-ink-100 md:text-5xl">
              {t('about.cta_title')}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-ink-300">{t('about.cta_text')}</p>
            <Link to="/properties" className="btn-gold mt-8 inline-flex items-center gap-2 text-xs">
              {t('about.cta_button')}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
