import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Instagram, ArrowUpRight, Send } from 'lucide-react'
import { useState } from 'react'

import HeroSearch from '../components/home/HeroSearch'
import StatsBar from '../components/home/StatsBar'
import TestimonialCarousel from '../components/home/TestimonialCarousel'
import EditorialMoment from '../components/home/EditorialMoment'
import HomeMap from '../components/home/HomeMap'
import WhyUs from '../components/home/WhyUs'
import AccreditationStrip from '../components/home/AccreditationStrip'
import PropertyCard from '../components/property/PropertyCard'
import AreaCard from '../components/area/AreaCard'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'

import properties from '../data/properties.json'
import areas from '../data/areas.json'
import { CONTACT, SITE_URL, BRAND } from '../lib/constants'

const HOMEPAGE_AREAS = ['juffair', 'seef', 'amwaj', 'riffa', 'bahrain-bay', 'diplomatic-area']

export default function Home() {
  const { t } = useTranslation()
  const featured = properties.filter((p) => p.featured).slice(0, 6)
  const homepageAreas = HOMEPAGE_AREAS
    .map((slug) => areas.find((a) => a.slug === slug))
    .filter(Boolean)

  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <>
      <Helmet>
        <title>{`${BRAND.shortName} — ${t('brand.tagline')}`}</title>
        <meta name="description" content={`${t('brand.tagline')} — ${BRAND.legalName}, RERA licensed since ${BRAND.founded}.`} />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta property="og:title" content={`${BRAND.shortName} — ${t('brand.tagline')}`} />
        <meta property="og:description" content={t('brand.tagline')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={`${SITE_URL}/ask-logo.png`} />
      </Helmet>

      {/* HERO */}
      <Hero />

      {/* EDITORIAL MOMENT — magazine spotlight on a featured neighbourhood */}
      <section className="py-section">
        <EditorialMoment />
      </section>

      {/* STATS */}
      <section className="container-lux relative z-10">
        <StatsBar />
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="container-lux py-section">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-12 sm:gap-6">
          <SectionHeader
            eyebrow={t('sections.featured_eyebrow')}
            title={t('sections.featured_title')}
            subtitle={t('sections.featured_subtitle')}
          />
          <Reveal delay={0.2}>
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-gold-300 transition-colors hover:text-gold-200"
            >
              {t('common.view_all')}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 md:gap-8 lg:grid-cols-3">
          {featured.map((property, i) => (
            <Reveal key={property.id} delay={i * 0.08} className="h-full">
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* INTERACTIVE BAHRAIN MAP — Zillow-tier discovery layer */}
      <section className="py-section">
        <HomeMap />
      </section>

      {/* AREAS */}
      <section className="bg-ink-card/40 py-section">
        <div className="container-lux">
          <SectionHeader
            eyebrow={t('sections.areas_eyebrow')}
            title={t('sections.areas_title')}
            subtitle={t('sections.areas_subtitle')}
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {homepageAreas.map((area, i) => (
              <Reveal key={area.slug} delay={i * 0.06}>
                <AreaCard area={area} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* WHY CHOOSE ASK */}
      <section className="py-section">
        <WhyUs />
      </section>

      {/* ACCREDITATION STRIP */}
      <AccreditationStrip />

      {/* TESTIMONIALS */}
      <section className="container-lux py-section">
        <div className="mx-auto max-w-3xl">
          <SectionHeader
            eyebrow={t('sections.testimonials_eyebrow')}
            title={t('sections.testimonials_title')}
            align="center"
          />
          <div className="mt-8 sm:mt-12">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="bg-ink-850/40 py-section">
        <div className="container-lux">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow={t('sections.instagram_eyebrow')}
              title={t('sections.instagram_title')}
            />
            <Reveal delay={0.15}>
              <a
                href={`https://instagram.com/${CONTACT.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-500 transition-colors hover:text-gold-300"
              >
                <Instagram className="h-4 w-4" />
                @{CONTACT.instagram} · {CONTACT.instagramFollowers.toLocaleString()}+ followers
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </Reveal>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 md:grid-cols-6">
            {[
              'photo-1564013799919-ab600027ffc6',
              'photo-1493809842364-78817add7ffb',
              'photo-1605276374104-dee2a0ed3cd6',
              'photo-1564540583246-934409427776',
              'photo-1571055107559-3e67626fa8be',
              'photo-1502672260266-1c1ef2d93688',
            ].map((id, i) => (
              <Reveal key={id} delay={i * 0.04}>
                <a
                  href={`https://instagram.com/${CONTACT.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden"
                >
                  <img
                    src={`https://images.unsplash.com/${id}?w=400&auto=format&fit=crop&q=80`}
                    alt="ASK Real Estate Instagram"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-ink-950/0 opacity-0 transition-all group-hover:bg-ink-950/60 group-hover:opacity-100">
                    <Instagram className="h-6 w-6 text-gold-300" />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="relative overflow-hidden bg-ink-950 py-section">
        <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-full bg-radial-gold opacity-30" />
        <div className="container-lux relative">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow mx-auto justify-center">{t('sections.newsletter_eyebrow')}</span>
              <h2 className="mt-3 font-display text-3xl leading-tight text-ink-100 sm:mt-4 sm:text-4xl md:text-5xl">
                {t('sections.newsletter_title')}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-ink-300 sm:mt-4 sm:text-base">{t('sections.newsletter_subtitle')}</p>

              <motion.form
                onSubmit={handleSubscribe}
                className="mx-auto mt-8 flex max-w-lg flex-col gap-2 sm:mt-10 sm:flex-row"
                animate={subscribed ? { opacity: 0.4, y: -8 } : {}}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('sections.newsletter_placeholder')}
                  className="flex-1 rounded-sm border border-white/10 bg-ink-900/60 px-5 py-3 text-sm text-ink-100 outline-none transition-colors focus:border-gold-500/40"
                  disabled={subscribed}
                />
                <button type="submit" className="btn-gold inline-flex items-center gap-1.5 text-xs">
                  <Send className="h-3.5 w-3.5" />
                  {t('sections.newsletter_subscribe')}
                </button>
              </motion.form>

              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-sm text-gold-300"
                >
                  ◆ {t('sections.newsletter_success')}
                </motion.p>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative -mt-20 flex min-h-[100vh] items-center overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero/bahrain-bay-panorama.webp"
          alt="Bahrain Bay at sunset — Four Seasons Hotel, Bahrain Financial Harbour and Manama skyline"
          fetchpriority="high"
          className="h-full w-full object-cover object-center"
        />
        {/* Diagonal darkening — heavy on the lower-left where the headline lives, fading toward the sunset on the upper-right */}
        <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/90 via-ink-950/55 to-ink-950/20" />
        {/* Soft top + bottom feather so the section seams blend into the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-900" />
        {/* Warm gold accent behind the headline */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_70%,rgba(212,175,55,0.22),transparent_55%)]" />
      </div>

      {/* Content */}
      <div className="container-lux relative z-10 pb-16 pt-28 sm:pb-24 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="eyebrow">
            ASK REAL ESTATE · EST. 2016
          </span>

          {/* Two-line headline — Line 1 in DM Sans for "trusted partner" framing,
              Line 2 the commanding Playfair Display 800 gold-gradient block. */}
          <h1 className="mt-6 text-balance leading-[0.95]">
            <span className="block font-sans font-normal text-[clamp(1.5rem,3.6vw,2.6rem)] leading-snug text-ink-100">
              Bahrain's Premier
            </span>
            <span
              className="mt-2 block font-display font-extrabold leading-[0.95] tracking-tight text-[clamp(2.25rem,8vw,7rem)]"
              style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', wordBreak: 'normal', overflowWrap: 'break-word' }}
            >
              Real Estate &amp; Asset Management Firm
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-[1.7] text-ink-200 sm:mt-9 sm:text-lg">
            RERA licensed. RICS accredited. $3B+ assets under management since 2016 — one trusted name in Bahrain property.
          </p>
        </motion.div>

        <div className="mt-8 sm:mt-12 lg:mt-16">
          <HeroSearch />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="h-10 w-px bg-gradient-to-b from-gold-500 to-transparent"
        />
      </div>
    </section>
  )
}
