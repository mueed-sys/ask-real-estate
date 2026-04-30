import { Link } from 'react-router-dom'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import {
  Building2, Home as HomeIcon, Box, Crown, Briefcase, Map,
  ShieldCheck, MessageCircle, BookOpen, Handshake, Instagram, ArrowUpRight, Send,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import HeroSearch from '../components/home/HeroSearch'
import StatsBar from '../components/home/StatsBar'
import TestimonialCarousel from '../components/home/TestimonialCarousel'
import PropertyCard from '../components/property/PropertyCard'
import AreaCard from '../components/area/AreaCard'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'
import SplitText from '../components/common/SplitText'
import SectionDivider from '../components/common/SectionDivider'

import properties from '../data/properties.json'
import areas from '../data/areas.json'
import { CONTACT, SITE_URL, BRAND } from '../lib/constants'

const PROPERTY_TYPES = [
  { value: 'Apartment', icon: Building2 },
  { value: 'Villa', icon: HomeIcon },
  { value: 'Studio', icon: Box },
  { value: 'Penthouse', icon: Crown },
  { value: 'Commercial', icon: Briefcase },
  { value: 'Land', icon: Map },
]

const HOMEPAGE_AREAS = ['juffair', 'seef', 'amwaj', 'riffa', 'bahrain-bay', 'diplomatic-area']

export default function Home() {
  const { t } = useTranslation()
  const featured = properties.filter((p) => p.featured).slice(0, 6)
  const homepageAreas = HOMEPAGE_AREAS
    .map((slug) => areas.find((a) => a.slug === slug))
    .filter(Boolean)
  const typeCounts = PROPERTY_TYPES.map((typeInfo) => ({
    ...typeInfo,
    count: properties.filter((p) => p.type === typeInfo.value).length,
  }))

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
        <meta property="og:image" content={`${SITE_URL}/logo.jpg`} />
      </Helmet>

      {/* HERO */}
      <Hero />

      {/* STATS */}
      <section className="container-lux -mt-8 relative z-10 sm:-mt-12">
        <StatsBar />
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="container-lux py-16 sm:py-24 lg:py-32">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-12 sm:gap-6">
          <SectionHeader
            eyebrow={t('sections.featured_eyebrow')}
            title={t('sections.featured_title')}
            subtitle={t('sections.featured_subtitle')}
          />
          <Reveal delay={0.2}>
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-gold-500 transition-colors hover:text-gold-300"
            >
              {t('common.view_all')}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((property, i) => (
            <Reveal key={property.id} delay={i * 0.08}>
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* AREAS */}
      <section className="bg-ink-850/40 py-16 sm:py-24 lg:py-32">
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

      {/* PROPERTY TYPES */}
      <section className="container-lux py-16 sm:py-24 lg:py-32">
        <SectionHeader
          eyebrow={t('sections.types_eyebrow')}
          title={t('sections.types_title')}
          align="center"
        />
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-3 gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {typeCounts.map((typeInfo, i) => {
            const Icon = typeInfo.icon
            return (
              <Reveal key={typeInfo.value} delay={i * 0.05}>
                <Link
                  to={`/properties?type=${typeInfo.value}`}
                  className="card-lux group flex flex-col items-center gap-2 p-4 text-center sm:gap-3 sm:p-6"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 transition-all group-hover:border-gold-500 group-hover:bg-gold-500/10 sm:h-14 sm:w-14">
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={1.4} />
                  </div>
                  <p className="font-display text-sm leading-tight text-ink-100 sm:text-lg">{typeInfo.value}</p>
                  <p className="text-[9px] font-medium uppercase tracking-widest text-gold-500 sm:text-[10px]">
                    {typeInfo.count} listed
                  </p>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      <SectionDivider />

      {/* WHY CHOOSE IRE */}
      <section className="relative overflow-hidden bg-ink-950 py-16 sm:py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-50" />
        <div className="container-lux relative">
          <SectionHeader
            eyebrow={t('sections.why_eyebrow')}
            title={t('sections.why_title')}
            subtitle={t('sections.why_subtitle')}
            align="center"
          />
          <div className="mt-10 grid gap-4 sm:mt-16 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, t: 'why.verified_title', d: 'why.verified_text' },
              { icon: MessageCircle, t: 'why.whatsapp_title', d: 'why.whatsapp_text' },
              { icon: BookOpen, t: 'why.knowledge_title', d: 'why.knowledge_text' },
              { icon: Handshake, t: 'why.support_title', d: 'why.support_text' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="card-lux flex h-full flex-col p-5 sm:p-8">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/5 text-gold-400 sm:h-12 sm:w-12">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.4} />
                    </div>
                    <h3 className="mt-4 font-display text-lg text-ink-100 sm:mt-6 sm:text-xl">{t(item.t)}</h3>
                    <div className="mt-2 h-px w-8 bg-gold-gradient sm:mt-3" />
                    <p className="mt-3 text-sm leading-relaxed text-ink-300 sm:mt-4">{t(item.d)}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* TESTIMONIALS */}
      <section className="container-lux py-16 sm:py-24 lg:py-32">
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
      <section className="bg-ink-850/40 py-16 sm:py-24 lg:py-32">
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
                    alt="IRE Bahrain Instagram"
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
      <section className="relative overflow-hidden bg-ink-950 py-16 sm:py-24 lg:py-32">
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
  const sectionRef = useRef(null)

  // Mouse parallax — translate the bg layers a few pixels off the cursor.
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const parallaxX = useSpring(mouseX, { stiffness: 50, damping: 18, mass: 0.6 })
  const parallaxY = useSpring(mouseY, { stiffness: 50, damping: 18, mass: 0.6 })

  // Scroll-linked: as the user scrolls past the hero, fade the content out
  // and shift it up slightly while the bg pushes the opposite way.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onMove = (e) => {
      const w = window.innerWidth
      const h = window.innerHeight
      // Range -1..1 from center; multiply for shift amount in px.
      mouseX.set(((e.clientX / w) - 0.5) * -24)
      mouseY.set(((e.clientY / h) - 0.5) * -16)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  return (
    <section
      ref={sectionRef}
      className="relative -mt-20 flex min-h-[100vh] items-center overflow-hidden"
    >
      {/* Layered cinematic background */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, scale: bgScale }}
      >
        {/* Image: ken-burns slow zoom + mouse parallax */}
        <motion.div
          className="absolute -inset-[6%]"
          style={{ x: parallaxX, y: parallaxY }}
        >
          <img
            src="/images/hero/bahrain-bay-panorama.webp"
            alt="Bahrain Bay at sunset — Four Seasons Hotel, Bahrain Financial Harbour and Manama skyline"
            fetchpriority="high"
            className="ken-burns h-full w-full object-cover object-center"
          />
        </motion.div>

        {/* Diagonal darkening — heavier on the lower-left where the headline sits */}
        <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/90 via-ink-950/55 to-ink-950/20" />

        {/* Soft top + bottom feather so the section seams blend into the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-900" />

        {/* Warm gold radial accent anchoring the headline */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_70%,rgba(212,175,55,0.22),transparent_55%)]" />

        {/* Atmospheric godrays drifting across the sunset */}
        <div className="pointer-events-none absolute inset-0 godrays" aria-hidden="true" />

        {/* Subtle floating sparkles / motes of light */}
        <div className="pointer-events-none absolute inset-0 sparkles" aria-hidden="true" />
      </motion.div>

      {/* Foreground content — drifts up and fades on scroll */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-lux relative z-10 pb-16 pt-28 sm:pb-24 sm:pt-32"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow"
        >
          IRE BAHRAIN · SINCE 2008
        </motion.span>

        {/* Two-line cinematic headline */}
        <h1 className="mt-6 text-balance leading-[0.95]">
          <span className="block font-sans font-normal text-[clamp(1.5rem,3.6vw,2.6rem)] leading-snug text-ink-100">
            <SplitText
              text="Your Trusted Partner in"
              type="word"
              initialDelay={0.25}
              stagger={0.07}
              y="0.6em"
              duration={0.85}
            />
          </span>
          <span className="mt-2 block font-display font-extrabold leading-[0.95] tracking-tight text-[clamp(3.25rem,11vw,9.5rem)]">
            <SplitText
              text="Bahrain Real Estate"
              type="letter"
              initialDelay={0.7}
              stagger={0.035}
              y="0.5em"
              duration={1.0}
              gradient
            />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-xl text-base leading-[1.7] text-ink-200 sm:mt-9 sm:text-lg"
        >
          The Kingdom's premier property portfolio. 17 years of excellence,
          4,000+ properties, one trusted name.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 sm:mt-12 lg:mt-16"
        >
          <HeroSearch />
        </motion.div>
      </motion.div>

      {/* Refined scroll cue: hairline column with a gold dot riding down */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.1 }}
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <span className="relative block h-12 w-px overflow-hidden bg-gradient-to-b from-transparent via-gold-500/40 to-transparent">
          <span className="scroll-dot absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        </span>
        <p className="mt-3 text-center text-[9px] uppercase tracking-[0.4em] text-gold-500/70">Scroll</p>
      </motion.div>
    </section>
  )
}
