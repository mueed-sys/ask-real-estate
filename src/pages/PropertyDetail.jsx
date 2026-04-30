import { useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import {
  MapPin, BedDouble, Bath, Maximize2, Layers, Car, Sofa, Calendar, Hash, Check,
  Phone, MessageCircle, Mail, Star, Twitter, Facebook, Link2, Heart, GitCompare,
  Building2, Sparkles, Sun, Waves,
} from 'lucide-react'

import PropertyGallery from '../components/property/PropertyGallery'
import MortgageCalculator from '../components/property/MortgageCalculator'
import PropertyCard from '../components/property/PropertyCard'
import RERAVerifiedBadge from '../components/property/RERAVerifiedBadge'
import EWAEstimate from '../components/property/EWAEstimate'
import PriceHistoryChart from '../components/property/PriceHistoryChart'
import BookingCalendar from '../components/property/BookingCalendar'
import NearbyMap from '../components/property/NearbyMap'
import MobilePropertyBar from '../components/property/MobilePropertyBar'
import Reveal from '../components/common/Reveal'
import Price from '../components/common/Price'

import properties from '../data/properties.json'
import agents from '../data/agents.json'
import { bedroomLabel, floorLabel } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { useFavorites } from '../store/useFavorites'
import { useComparison } from '../store/useComparison'
import { useToast } from '../store/useToast'
import { SITE_URL, BRAND } from '../lib/constants'

// Premium areas qualify for the cinematic video hero treatment.
const PREMIUM_AREAS = new Set(['Bahrain Bay', 'Reef Island', 'Amwaj Islands'])

// Amenity grouping for the new sectioned amenities row. Items not present on
// the listing are dimmed; missing keys hidden so the section never feels
// padded with nos.
const AMENITY_GROUPS = [
  { title: 'Building', icon: Building2, keys: ['pool', 'gym', 'security_24_7', 'covered_parking', 'concierge'] },
  { title: 'Unit',     icon: Sparkles,  keys: ['balcony', 'built_in_wardrobes', 'central_ac', 'kitchen_appliances', 'maids_room', 'storage', 'internet'] },
  { title: 'Lifestyle',icon: Waves,     keys: ['sea_view', 'playground'] },
]

export default function PropertyDetail() {
  const { id } = useParams()
  const { t } = useTranslation()

  const property = properties.find((p) => p.id === id)

  const isFav = useFavorites((s) => s.isFavorite(id))
  const toggleFav = useFavorites((s) => s.toggle)
  const isCompare = useComparison((s) => s.isInCompare(id))
  const toggleCompare = useComparison((s) => s.toggle)
  const pushToast = useToast((s) => s.push)
  const bookingRef = useRef(null)

  if (!property) {
    return <Navigate to="/properties" replace />
  }

  const agent = agents.find((a) => a.id === property.agent_id)
  const similar = properties
    .filter((p) => p.id !== property.id && (p.location === property.location || Math.abs(p.price - property.price) < 200))
    .slice(0, 4)

  const title = property.title
  const description = property.description
  const period =
    property.purpose === 'rent'
      ? property.price_period === 'year' ? t('common.per_year') : t('common.per_month')
      : 'total'
  const isPremium = PREMIUM_AREAS.has(property.location)

  const handleFav = () => {
    toggleFav(property.id)
    pushToast(isFav ? t('toast.saved_removed') : t('toast.saved_added'))
  }
  const handleCompare = () => {
    const result = toggleCompare(property.id)
    if (result.atMax) return pushToast(t('toast.compare_max'), { type: 'error' })
    pushToast(result.added ? t('toast.compare_added') : t('toast.compare_removed'))
  }
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      pushToast(t('toast.link_copied'))
    } catch {
      pushToast('Could not copy', { type: 'error' })
    }
  }

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <>
      <Helmet>
        <title>{`${title} — ${BRAND.shortName}`}</title>
        <meta name="description" content={(property.description || '').slice(0, 160)} />
        <link rel="canonical" href={`${SITE_URL}/properties/${property.id}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={(property.description || '').slice(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/properties/${property.id}`} />
        <meta property="og:image" content={property.images[0]} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            name: title,
            description: property.description,
            url: `${SITE_URL}/properties/${property.id}`,
            image: property.images,
            datePosted: property.created_at,
            offers: { '@type': 'Offer', price: property.price, priceCurrency: 'BHD', availability: 'https://schema.org/InStock' },
            address: { '@type': 'PostalAddress', streetAddress: property.address, addressLocality: property.location, addressCountry: 'BH' },
            geo: { '@type': 'GeoCoordinates', latitude: property.lat, longitude: property.lng },
          })}
        </script>
      </Helmet>

      <div className="container-lux pb-32 pt-12 print:pt-8">
        {/* Header */}
        <Reveal>
          <header className="mb-8 flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/15 bg-ink-card/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-100">
                  {property.purpose === 'rent' ? t('common.for_rent') : t('common.for_sale')}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-200">
                  {property.type}
                </span>
                {property.featured && (
                  <span className="rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-900">
                    {t('common.featured')}
                  </span>
                )}
                <RERAVerifiedBadge
                  inspector={agent?.name}
                  inspectedOn="12 Apr 2026"
                  lastPriceUpdate="22 Apr 2026"
                />
              </div>
              <h1 className="font-sans text-3xl font-semibold leading-tight tracking-tight text-ink-100 md:text-4xl lg:text-5xl">{title}</h1>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-300">
                <MapPin className="h-4 w-4 text-ivory-300" />
                {property.address}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.lat},${property.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs uppercase tracking-[0.22em] text-gold-300 hover:text-gold-200"
                >
                  View on Google Maps →
                </a>
              </p>
            </div>

            <div className="text-right">
              <Price bd={property.price} unit={period} size="56px" className="justify-end" />
              <div className="mt-4 flex items-center justify-end gap-2 print:hidden">
                <button
                  onClick={handleFav}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-xs font-medium tracking-wide transition-colors ${
                    isFav ? 'border-gold-500 bg-gold-500/10 text-gold-300' : 'border-white/10 text-ink-300 hover:border-gold-500/40'
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-gold-500' : ''}`} />
                  {isFav ? t('common.saved') : t('common.save')}
                </button>
                <button
                  onClick={handleCompare}
                  title="Compare with another property"
                  className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-xs font-medium tracking-wide transition-colors ${
                    isCompare ? 'border-gold-500 bg-gold-500/10 text-gold-300' : 'border-white/10 text-ink-300 hover:border-gold-500/40'
                  }`}
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  {t('nav.compare')}
                </button>
              </div>
            </div>
          </header>
        </Reveal>

        {/* Hero — cinematic video for premium areas, gallery otherwise */}
        <Reveal delay={0.1}>
          {isPremium ? (
            <PremiumVideoHero property={property} onBook={scrollToBooking} />
          ) : (
            <PropertyGallery images={property.images} title={title} />
          )}
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-12">
            {/* Quick details grid */}
            <Reveal>
              <section>
                <h2 className="font-display text-2xl text-ink-100 sm:text-3xl">{t('details.overview')}</h2>
                <div className="gold-rule" />
                <DetailGrid property={property} t={t} />
              </section>
            </Reveal>

            {/* Description */}
            <Reveal>
              <section>
                <h2 className="font-display text-2xl text-ink-100 sm:text-3xl">{t('details.description')}</h2>
                <div className="gold-rule" />
                <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-[1.8] text-ink-200">
                  {description}
                </p>
              </section>
            </Reveal>

            {/* Amenities — grouped */}
            <Reveal>
              <section>
                <h2 className="font-display text-2xl text-ink-100 sm:text-3xl">{t('details.amenities')}</h2>
                <div className="gold-rule" />
                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                  {AMENITY_GROUPS.map((g) => {
                    const Icon = g.icon
                    const items = g.keys.filter((k) => property.amenities.includes(k))
                    return (
                      <div key={g.title} className="rounded-md border border-white/8 bg-ink-card/40 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">
                          <Icon className="h-3.5 w-3.5 text-ivory-300" strokeWidth={1.6} /> {g.title}
                        </div>
                        <ul className="mt-3 space-y-2">
                          {items.length === 0 && (
                            <li className="text-xs italic text-ink-400">— Not listed —</li>
                          )}
                          {items.map((k) => (
                            <li key={k} className="flex items-center gap-2 text-sm text-ink-100">
                              <Check className="h-3.5 w-3.5 flex-shrink-0 text-success-300" strokeWidth={2} />
                              <span>{t(`amenities.${k}`)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </section>
            </Reveal>

            {/* EWA bills */}
            <Reveal>
              <EWAEstimate property={property} />
            </Reveal>

            {/* Map + Nearby */}
            <Reveal>
              <section>
                <h2 className="font-display text-2xl text-ink-100 sm:text-3xl">{t('details.location_map')}</h2>
                <div className="gold-rule" />
                <p className="mt-3 text-sm text-ink-300">{t('details.nearby')}</p>
                <div className="mt-6">
                  <NearbyMap property={property} />
                </div>
              </section>
            </Reveal>

            {/* Price history — sale only */}
            {property.purpose === 'sale' && (
              <Reveal>
                <PriceHistoryChart property={property} />
              </Reveal>
            )}

            {/* Booking calendar */}
            <Reveal>
              <div ref={bookingRef}>
                <BookingCalendar agent={agent} property={property} />
              </div>
            </Reveal>

            {/* Mortgage Calculator — sale only */}
            {property.purpose === 'sale' && (
              <Reveal>
                <MortgageCalculator defaultPrice={property.price} />
              </Reveal>
            )}

            {/* Share */}
            <Reveal>
              <section className="card-lux p-6 print:hidden">
                <h2 className="font-display text-xl text-ink-100">{t('share.title')}</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  <ShareBtn icon={Link2} label={t('share.copy')} onClick={handleCopyLink} />
                  <ShareBtn
                    icon={MessageCircle}
                    label={t('share.whatsapp')}
                    href={waLink({ text: `Check out this property on IRE Bahrain: ${title} — ${typeof window !== 'undefined' ? window.location.href : SITE_URL}` })}
                  />
                  <ShareBtn
                    icon={Twitter}
                    label={t('share.twitter')}
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : SITE_URL)}`}
                  />
                  <ShareBtn
                    icon={Facebook}
                    label={t('share.facebook')}
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : SITE_URL)}`}
                  />
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-ink-200 transition-colors hover:border-gold-500/40 hover:text-gold-300"
                  >
                    <Sun className="h-3.5 w-3.5" /> Print
                  </button>
                </div>
              </section>
            </Reveal>
          </div>

          {/* Sticky agent rail */}
          {agent && (
            <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start print:hidden">
              <AgentInquiryCard agent={agent} property={property} onSchedule={scrollToBooking} />
            </aside>
          )}
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <section className="mt-24 print:hidden">
            <Reveal>
              <h2 className="font-display text-2xl text-ink-100 sm:text-3xl">{t('sections.similar_title')}</h2>
              <div className="gold-rule" />
            </Reveal>
            <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08} className="h-full">
                  <PropertyCard property={p} showCompare={false} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky bottom action bar */}
      <MobilePropertyBar agent={agent} property={property} onSchedule={scrollToBooking} />
    </>
  )
}

/* ============================ PREMIUM VIDEO HERO ============================ */
// Royalty-free Pexels stock loops — vetted, generic luxury skyline / waterfront
// imagery. Loops muted/autoplay with a dark overlay so the headline stays
// readable. Falls back to the hero image if the video fails to load.
function PremiumVideoHero({ property, onBook }) {
  const FALLBACKS = [
    'https://cdn.pixabay.com/video/2023/05/25/164588-830029303_large.mp4',
    'https://cdn.pixabay.com/video/2024/01/03/195099-901318681_large.mp4',
  ]
  const idx = (property.id || 'A').charCodeAt(property.id.length - 1) % FALLBACKS.length
  return (
    <section className="relative aspect-[16/9] w-full overflow-hidden rounded-md sm:aspect-[21/9]">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={property.images[0]}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={FALLBACKS[idx]} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-bg via-ink-bg/30 to-ink-bg/50" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-10">
        <div className="max-w-xl">
          <span className="eyebrow eyebrow-gold">PREMIUM RESIDENCE</span>
          <p className="mt-2 font-display text-2xl leading-[1.1] text-ink-100 sm:text-4xl">{property.title}</p>
        </div>
        <button
          onClick={onBook}
          className="hidden h-12 items-center gap-2 rounded-full bg-gold-gradient px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-900 shadow-[0_8px_22px_-8px_rgba(212,175,55,0.55)] sm:inline-flex"
        >
          <Calendar className="h-4 w-4" /> Book Viewing
        </button>
      </div>
    </section>
  )
}

function DetailGrid({ property, t }) {
  const items = [
    { icon: BedDouble, label: t('details.bedrooms'), value: bedroomLabel(property.bedrooms) },
    { icon: Bath, label: t('details.bathrooms'), value: property.bathrooms },
    { icon: Maximize2, label: t('details.area_sqm'), value: `${property.sqm} m²` },
    { icon: Layers, label: t('details.floor'), value: floorLabel(property.floor) },
    { icon: Car, label: t('details.parking'), value: property.parking },
    { icon: Sofa, label: t('details.furnished'), value: property.furnished ? t('details.yes') : t('details.no') },
    { icon: Calendar, label: t('details.year_built'), value: property.year_built },
    { icon: Hash, label: t('details.property_id'), value: property.id },
  ]
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item, i) => {
        const Icon = item.icon
        return (
          <div key={i} className="rounded-md border border-white/8 bg-ink-card/40 p-4">
            <Icon className="h-5 w-5 text-ivory-300" strokeWidth={1.5} />
            <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-400">{item.label}</p>
            <p className="mt-1 font-numbers text-lg font-bold text-ink-100">{item.value}</p>
          </div>
        )
      })}
    </div>
  )
}

function AgentInquiryCard({ agent, property, onSchedule }) {
  const { t } = useTranslation()
  return (
    <div className="card-lux p-6">
      <div className="flex items-center gap-4">
        <img
          src={agent.photo}
          alt={agent.name}
          loading="lazy"
          className="h-16 w-16 rounded-full object-cover ring-1 ring-gold-500/30"
        />
        <div className="min-w-0">
          <p className="font-display text-xl leading-tight text-ink-100">{agent.name}</p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-ivory-300">{agent.title}</p>
          <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-ink-300">
            <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
            {agent.rating.toFixed(1)} · {agent.active_listings} listings
          </p>
        </div>
      </div>

      <button
        onClick={onSchedule}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-900 shadow-[0_8px_22px_-8px_rgba(212,175,55,0.55)]"
      >
        <Calendar className="h-4 w-4" /> Schedule Viewing
      </button>
      <a
        href={waLink({ property })}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp Inquiry
      </a>
      <a
        href={`tel:${agent.phone}`}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/5 py-3 text-sm font-medium text-gold-300 transition-colors hover:bg-gold-500/10"
      >
        <Phone className="h-4 w-4" /> {agent.phone}
      </a>
      <a
        href={`mailto:${agent.email}?subject=${encodeURIComponent(`Inquiry: ${property.id}`)}`}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 py-3 text-sm font-medium text-ink-200 transition-colors hover:border-gold-500/40"
      >
        <Mail className="h-4 w-4" /> {t('common.email')}
      </a>

      <Link
        to={`/agents/${agent.id}`}
        className="mt-5 block text-center text-xs uppercase tracking-[0.22em] text-gold-300 transition-colors hover:text-gold-200"
      >
        {t('agent_card.view_all_listings', { name: agent.name })} →
      </Link>
    </div>
  )
}

function ShareBtn({ icon: Icon, label, href, onClick }) {
  const Comp = href ? 'a' : 'button'
  const props = href
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { onClick, type: 'button' }
  return (
    <Comp
      {...props}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-ink-200 transition-colors hover:border-gold-500/40 hover:text-gold-300"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Comp>
  )
}
