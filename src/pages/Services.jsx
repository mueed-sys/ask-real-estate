import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import Reveal from '../components/common/Reveal'
import SectionHeader from '../components/common/SectionHeader'
import services from '../data/services.json'
import { BRAND, SITE_URL } from '../lib/constants'

export default function Services() {
  const { t } = useTranslation()
  const [active, setActive] = useState(services[0].id)
  const sectionRefs = useRef({})

  useEffect(() => {
    const observers = services.map(({ id }) => {
      const el = sectionRefs.current[id]
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Helmet>
        <title>{`Our Services — ${BRAND.shortName}`}</title>
        <meta name="description" content={`Full-spectrum real estate services in Bahrain — brokerage, property management, valuation, facility management, interior design, OA management and hospitality lettings. ${BRAND.legalName}.`} />
        <link rel="canonical" href={`${SITE_URL}/services`} />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 pb-20 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,175,55,0.12),transparent_60%)]" />
        <div className="container-lux relative">
          <Reveal>
            <span className="eyebrow">{t('sections.services_eyebrow')}</span>
            <h1 className="mt-4 font-display text-h1-mob font-bold text-ink-100 lg:text-h1">
              {t('sections.services_title')}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
              From the first client meeting to final handover — ASK delivers every real estate service in-house, under one roof, to one consistent standard.
            </p>
          </Reveal>

          {/* Pill nav */}
          <div className="mt-10 flex flex-wrap gap-2">
            {services.map(({ id, title }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all ${
                  active === id
                    ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                    : 'border-white/10 text-ink-300 hover:border-gold-500/30 hover:text-gold-400'
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service sections */}
      <div className="bg-ink-bg">
        {services.map((service, i) => {
          const even = i % 2 === 0
          return (
            <section
              key={service.id}
              id={service.id}
              ref={(el) => { sectionRefs.current[service.id] = el }}
              className="py-section"
            >
              <div className="container-lux">
                <div className={`flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20 ${even ? '' : 'lg:flex-row-reverse'}`}>
                  {/* Image */}
                  <Reveal className="flex-1" delay={0.05}>
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={service.image}
                        alt={service.title}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
                      <span className="absolute bottom-5 left-5 rounded-full border border-gold-500/40 bg-ink-950/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-300 backdrop-blur-sm">
                        {service.title}
                      </span>
                    </div>
                  </Reveal>

                  {/* Copy */}
                  <div className="flex-1">
                    <Reveal>
                      <span className="eyebrow">{service.tagline}</span>
                      <h2 className="mt-4 font-display text-h2-mob font-bold text-ink-100 lg:text-h2">
                        {service.title}
                      </h2>
                      <p className="mt-5 text-base leading-relaxed text-ink-300">{service.description}</p>

                      <ul className="mt-7 space-y-2.5">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm text-ink-200">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" strokeWidth={1.5} />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Link
                        to="/contact"
                        className="btn-gold mt-8 inline-flex items-center gap-2"
                      >
                        Enquire About This Service
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Reveal>
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink-950 py-section">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1),transparent_65%)]" />
        <div className="container-lux relative text-center">
          <Reveal>
            <h2 className="font-display text-h2-mob font-bold text-ink-100 lg:text-h2">
              Not sure which service you need?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-ink-300">
              Talk to one of our consultants and we'll recommend the right combination for your situation.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact" className="btn-gold inline-flex items-center gap-2">
                Get In Touch <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-400 transition-colors hover:text-gold-300"
              >
                Browse Properties <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
