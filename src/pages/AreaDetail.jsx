import { Link, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ArrowUpRight, MapPin, Footprints, Coffee, GraduationCap, Dumbbell, Moon, Car as CarIcon, Quote } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

import PropertyCard from '../components/property/PropertyCard'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'
import Price from '../components/common/Price'

import areas from '../data/areas.json'
import properties from '../data/properties.json'
import guides from '../data/area-guides.json'
import { localized } from '../lib/format'
import { BRAND, SITE_URL } from '../lib/constants'

export default function AreaDetail() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const area = areas.find((a) => a.slug === slug)
  if (!area) return <Navigate to="/areas" replace />

  const guide = guides[slug] || {}
  const inArea = properties.filter((p) => p.location === area.name)

  // Build the 24-month chart shape from the trend array.
  const trend = (guide.rent_trend || []).map((v, i) => {
    const d = new Date(2026, 3, 1)
    d.setMonth(d.getMonth() - (23 - i))
    return { month: d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }), price: v }
  })

  return (
    <>
      <Helmet>
        <title>{`${area.name} — Renting & buying in Bahrain | ${BRAND.shortName}`}</title>
        <meta name="description" content={(guide.voice || area.description || '').slice(0, 160)} />
        <link rel="canonical" href={`${SITE_URL}/areas/${area.slug}`} />
      </Helmet>

      {/* Hero */}
      <section className="relative -mt-[72px] flex min-h-[58vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={area.image} alt={area.name} className="h-full w-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-bg via-ink-bg/60 to-ink-bg/20" />
        </div>
        <div className="container-lux relative z-10 pb-16 pt-32">
          <Reveal>
            <span className="eyebrow eyebrow-gold">NEIGHBOURHOOD GUIDE</span>
            <h1 className="mt-5 font-display text-5xl leading-[1.04] tracking-tight text-ink-100 md:text-6xl lg:text-7xl">
              {localized(area, 'name', lang)}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-ink-200">{localized(area, 'tagline', lang)}</p>
            <div className="gold-rule mt-6" />
          </Reveal>
        </div>
      </section>

      {/* Vital signs strip */}
      <section className="border-b border-white/8 bg-ink-card/30">
        <div className="container-lux grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
          <Vital icon={Footprints} label="Walk Score" value={guide.walk_score ?? '—'} suffix="/100" />
          <Vital icon={Moon} label="Nearest Mosque" value={guide.nearest_mosque || '—'} sub={guide.prayer_note} />
          <Vital icon={CarIcon} label="Traffic" value={guide.traffic || '—'} />
          <Vital
            icon={MapPin}
            label="Average Rent"
            value={<Price bd={area.avg_rent_bd} unit="/mo" size="22px" />}
            sub={`${area.property_count} listings`}
          />
        </div>
      </section>

      {/* Consultant voice */}
      {guide.voice && (
        <section className="container-lux py-section">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <Reveal>
              <Quote className="h-8 w-8 text-gold-300" strokeWidth={1.4} />
              <blockquote className="mt-4 max-w-3xl font-display text-xl leading-[1.55] text-ink-100 sm:text-2xl">
                {guide.voice}
              </blockquote>
              <footer className="mt-6 text-[11px] uppercase tracking-[0.22em] text-ivory-300">
                — {guide.consultant_name} · {guide.consultant_role}
              </footer>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="card-lux p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">
                  Avg rent · last 24 months
                </p>
                <div className="mt-4 h-40 w-full">
                  <ResponsiveContainer>
                    <AreaChart data={trend} margin={{ top: 4, right: 0, bottom: 0, left: -10 }}>
                      <defs>
                        <linearGradient id="rentFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#d4af37" stopOpacity={0.45} />
                          <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="month" stroke="rgba(196,200,219,0.5)" fontSize={9} tickLine={false} axisLine={false} interval={5} />
                      <YAxis hide domain={['dataMin', 'dataMax']} />
                      <Tooltip
                        contentStyle={{ background: '#171B36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 11 }}
                        formatter={(v) => [`BD ${v.toLocaleString()}`, 'Avg rent']}
                      />
                      <Area type="monotone" dataKey="price" stroke="#d4af37" strokeWidth={2} fill="url(#rentFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Top 3 nearby — cafes, schools, gyms */}
      {(guide.cafes || guide.schools || guide.gyms) && (
        <section className="bg-ink-card/40 py-section">
          <div className="container-lux">
            <SectionHeader eyebrow="LIFE NEARBY" title="Top picks within reach" />
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <NearbyColumn icon={Coffee} title="Cafés & Restaurants" items={guide.cafes} />
              <NearbyColumn icon={GraduationCap} title="Schools" items={guide.schools} />
              <NearbyColumn icon={Dumbbell} title="Gyms & Fitness" items={guide.gyms} />
            </div>
          </div>
        </section>
      )}

      {/* Listings in this area */}
      <section className="container-lux py-section" id="listings">
        <SectionHeader
          eyebrow={t('common.results')}
          title={`Listings in ${area.name}`}
        />
        {inArea.length === 0 ? (
          <Reveal>
            <div className="card-lux mt-10 px-6 py-16 text-center">
              <p className="text-ink-300">No listings in this area right now.</p>
              <Link to="/contact" className="btn-outline mt-4 inline-flex items-center gap-2 text-xs">
                Contact us
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-10 grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-3">
            {inArea.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06} className="h-full">
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-ink-950 py-section">
        <div className="container-lux text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl text-ink-100 md:text-4xl">
              Can't find what you're looking for in {area.name}?
            </h2>
            <Link to="/contact" className="btn-gold mt-8 inline-flex items-center gap-2 text-xs">
              Talk to {guide.consultant_name?.split(' ')[0] || 'us'}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function Vital({ icon: Icon, label, value, sub, suffix }) {
  return (
    <div className="bg-ink-card/60 px-5 py-5">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
        {label}
      </div>
      <p className="mt-2 truncate font-display text-lg text-ink-100">
        {value}
        {suffix && <span className="ml-1 text-sm text-ink-400">{suffix}</span>}
      </p>
      {sub && <p className="mt-0.5 truncate text-[11px] text-ink-400">{sub}</p>}
    </div>
  )
}

function NearbyColumn({ icon: Icon, title, items = [] }) {
  return (
    <div className="card-lux p-6">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.6} /> {title}
      </div>
      <ul className="mt-4 divide-y divide-white/5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3 py-3">
            <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink-100">{it.name}</p>
              <p className="mt-0.5 text-xs text-ink-300">{it.blurb}</p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-ivory-300">{it.distance}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
