import { Link, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ArrowUpRight } from 'lucide-react'

import PropertyCard from '../components/property/PropertyCard'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'

import areas from '../data/areas.json'
import properties from '../data/properties.json'
import { localized, formatPriceWithCurrency } from '../lib/format'
import { BRAND, SITE_URL } from '../lib/constants'

export default function AreaDetail() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const area = areas.find((a) => a.slug === slug)
  if (!area) return <Navigate to="/areas" replace />

  const inArea = properties.filter((p) => p.location === area.name)

  return (
    <>
      <Helmet>
        <title>{`${area.name} — Properties in Bahrain | ${BRAND.shortName}`}</title>
        <meta name="description" content={area.description} />
        <link rel="canonical" href={`${SITE_URL}/areas/${area.slug}`} />
      </Helmet>

      {/* Hero */}
      <section className="relative -mt-20 flex min-h-[60vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={area.image} alt={area.name} className="h-full w-full object-cover" fetchpriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-ink-900/20" />
        </div>
        <div className="container-lux relative z-10 pb-16 pt-32">
          <Reveal>
            <span className="eyebrow">{t('nav.areas')}</span>
            <h1 className="mt-5 font-display text-6xl leading-tight text-ink-100 md:text-7xl lg:text-8xl">
              {localized(area, 'name', lang)}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-ink-200">{localized(area, 'tagline', lang)}</p>
            <div className="gold-rule mt-6" />
          </Reveal>
        </div>
      </section>

      {/* Description + key stats */}
      <section className="container-lux py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="text-base leading-relaxed text-ink-200">{localized(area, 'description', lang)}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-white/5 bg-white/5">
              <Stat label={t('areas_page.average_rent')} value={`${formatPriceWithCurrency(area.avg_rent_bd, lang)}/m`} />
              <Stat label={t('areas_page.average_sale')} value={formatPriceWithCurrency(area.avg_sale_bd, lang)} />
              <Stat label={t('areas_page.available')} value={area.property_count} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Amenities */}
      <section className="container-lux py-12">
        <Reveal>
          <h2 className="font-display text-3xl text-ink-100">{t('areas_page.amenities_nearby')}</h2>
          <div className="gold-rule" />
        </Reveal>
        <div className="mt-8 flex flex-wrap gap-3">
          {area.amenities.map((a) => (
            <span key={a} className="rounded-full border border-white/10 bg-ink-850/40 px-4 py-2 text-sm text-ink-200">
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* Properties */}
      <section className="container-lux py-20">
        <SectionHeader
          eyebrow={t('common.results')}
          title={`Properties in ${area.name}`}
        />
        {inArea.length === 0 ? (
          <Reveal>
            <div className="card-lux mt-12 px-6 py-16 text-center">
              <p className="text-ink-300">No properties in this area right now.</p>
              <Link to="/contact" className="btn-outline mt-4 inline-flex items-center gap-2 text-xs">
                Contact us
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {inArea.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-ink-950 py-16">
        <div className="container-lux text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl text-ink-100 md:text-4xl">
              Can't find what you're looking for in {area.name}?
            </h2>
            <Link to="/contact" className="btn-gold mt-8 inline-flex items-center gap-2 text-xs">
              Contact us
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-ink-850/90 px-5 py-6 text-center">
      <p className="text-[10px] font-medium uppercase tracking-widest text-gold-500">{label}</p>
      <p className="mt-3 font-display text-2xl text-ink-100">{value}</p>
    </div>
  )
}
