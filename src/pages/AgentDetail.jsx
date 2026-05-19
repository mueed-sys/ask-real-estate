import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Phone, MessageCircle, Mail, Star, Clock, Briefcase, Award, ArrowLeft } from 'lucide-react'

import PropertyCard from '../components/property/PropertyCard'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'

import agents from '../data/agents.json'
import properties from '../data/properties.json'
import testimonials from '../data/testimonials.json'
import { waLink } from '../lib/whatsapp'
import { localized } from '../lib/format'
import { BRAND, SITE_URL } from '../lib/constants'

export default function AgentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const agent = agents.find((a) => a.id === id)
  if (!agent) return <Navigate to="/agents" replace />

  const listings = properties.filter((p) => p.agent_id === agent.id)
  const agentTestimonials = testimonials.filter((t) => t.agent === agent.name)

  return (
    <>
      <Helmet>
        <title>{`${agent.name} — ${BRAND.shortName}`}</title>
        <meta name="description" content={agent.bio} />
        <link rel="canonical" href={`${SITE_URL}/agents/${agent.id}`} />
      </Helmet>

      {/* Back button */}
      <div className="container-lux pt-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-500 hover:text-gold-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Back to Agents
        </button>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-30" />
        <div className="container-lux relative grid gap-12 py-16 md:grid-cols-[auto_1fr] md:items-center">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gold-gradient opacity-20 blur-2xl" />
              <img
                src={agent.photo}
                alt={agent.name}
                className="relative h-48 w-48 rounded-full object-cover ring-2 ring-gold-500/30 md:h-56 md:w-56"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="eyebrow">{localized(agent, 'title', lang)}</span>
            <h1 className="mt-4 font-display text-5xl leading-tight text-ink-100 md:text-6xl">
              {localized(agent, 'name', lang)}
            </h1>
            <div className="gold-rule mt-5" />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-200">
              {localized(agent, 'bio', lang)}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={waLink({ agent })} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 text-xs">
                <MessageCircle className="h-3.5 w-3.5" /> {t('common.send_whatsapp')}
              </a>
              <a href={`tel:${agent.phone}`} className="btn-outline inline-flex items-center gap-2 text-xs">
                <Phone className="h-3.5 w-3.5" /> {t('common.call')}
              </a>
              <a href={`mailto:${agent.email}`} className="btn-outline inline-flex items-center gap-2 text-xs">
                <Mail className="h-3.5 w-3.5" /> {t('common.email')}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink-950 py-12">
        <div className="container-lux">
          <div className="grid gap-px overflow-hidden rounded-sm border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={Briefcase} label={t('agent_card.active_listings', { count: '' })} value={agent.active_listings} />
            <Stat icon={Award} label={t('agent_card.deals_closed')} value={agent.deals_closed_year} />
            <Stat icon={Star} label={t('agent_card.experience')} value={`${agent.years_with_ire}y`} />
            <Stat icon={Clock} label={t('agent_card.response_time')} value={agent.response_time} />
          </div>
        </div>
      </section>

      {/* Languages + Specializations */}
      <section className="container-lux py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="eyebrow">{t('agent_card.languages')}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {agent.languages.map((l) => (
                <div key={l.code} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-850/40 px-4 py-2 text-sm text-ink-100">
                  <span className="text-lg">{l.flag}</span>
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">{t('agent_card.specializations')}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {agent.specializations.map((s) => (
                <span key={s} className="rounded-full border border-gold-500/30 bg-gold-500/5 px-4 py-2 text-sm text-gold-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      {listings.length > 0 && (
        <section className="container-lux py-16">
          <SectionHeader title={`${t('agent_card.active_listings', { count: listings.length })}`} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {agentTestimonials.length > 0 && (
        <section className="bg-ink-850/40 py-16">
          <div className="container-lux">
            <SectionHeader eyebrow={t('sections.testimonials_eyebrow')} title="Client Testimonials" />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {agentTestimonials.map((tm) => (
                <Reveal key={tm.id}>
                  <div className="card-lux p-8">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < tm.rating ? 'fill-gold-500 text-gold-500' : 'text-ink-600'}`} />
                      ))}
                    </div>
                    <p className="mt-5 font-display text-xl leading-snug text-ink-100">"{localized(tm, 'quote', lang)}"</p>
                    <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
                      <div>
                        <p className="font-display text-lg text-ink-100">{localized(tm, 'name', lang)}</p>
                        <p className="text-[11px] uppercase tracking-widest text-gold-500">{localized(tm, 'role', lang)}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-ink-850/90 px-6 py-7 text-center">
      <Icon className="mx-auto h-5 w-5 text-gold-500" strokeWidth={1.4} />
      <p className="mt-3 font-display text-3xl text-gold-gradient">{value}</p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-ink-300">{label}</p>
    </div>
  )
}
