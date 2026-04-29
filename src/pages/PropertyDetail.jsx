import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import {
  MapPin, BedDouble, Bath, Maximize2, Layers, Car, Sofa, Calendar, Hash, Check, X,
  Phone, MessageCircle, Mail, Star, Share2, Twitter, Facebook, Link2, Heart, GitCompare,
} from 'lucide-react'

import PropertyGallery from '../components/property/PropertyGallery'
import MortgageCalculator from '../components/property/MortgageCalculator'
import PropertyCard from '../components/property/PropertyCard'
import Reveal from '../components/common/Reveal'

import properties from '../data/properties.json'
import agents from '../data/agents.json'
import { formatPriceWithCurrency, bedroomLabel, floorLabel, localized } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { useFavorites } from '../store/useFavorites'
import { useComparison } from '../store/useComparison'
import { useToast } from '../store/useToast'
import { SITE_URL, BRAND, OFFICE } from '../lib/constants'

const ALL_AMENITIES = [
  'pool', 'gym', 'security_24_7', 'covered_parking', 'balcony', 'sea_view',
  'maids_room', 'storage', 'central_ac', 'built_in_wardrobes', 'kitchen_appliances',
  'internet', 'playground', 'concierge',
]

export default function PropertyDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const property = properties.find((p) => p.id === id)
  const [showArabic, setShowArabic] = useState(lang === 'ar')

  const isFav = useFavorites((s) => s.isFavorite(id))
  const toggleFav = useFavorites((s) => s.toggle)
  const isCompare = useComparison((s) => s.isInCompare(id))
  const toggleCompare = useComparison((s) => s.toggle)
  const pushToast = useToast((s) => s.push)

  if (!property) {
    return <Navigate to="/properties" replace />
  }

  const agent = agents.find((a) => a.id === property.agent_id)
  const similar = properties
    .filter((p) => p.id !== property.id && (p.location === property.location || Math.abs(p.price - property.price) < 200))
    .slice(0, 4)

  const title = localized(property, 'title', lang)
  const description = showArabic ? property.description_ar : property.description
  const price = formatPriceWithCurrency(property.price, lang)
  const period =
    property.purpose === 'rent'
      ? property.price_period === 'year' ? t('common.per_year') : t('common.per_month')
      : ''

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
        {/* RealEstateListing JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            name: title,
            description: property.description,
            url: `${SITE_URL}/properties/${property.id}`,
            image: property.images,
            datePosted: property.created_at,
            offers: {
              '@type': 'Offer',
              price: property.price,
              priceCurrency: 'BHD',
              availability: 'https://schema.org/InStock',
            },
            address: {
              '@type': 'PostalAddress',
              streetAddress: property.address,
              addressLocality: property.location,
              addressCountry: 'BH',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: property.lat,
              longitude: property.lng,
            },
          })}
        </script>
      </Helmet>

      <div className="container-lux pb-32 pt-12">
        {/* Header */}
        <Reveal>
          <header className="mb-8 flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-gold-500/30 bg-gold-500/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-300">
                  {property.purpose === 'rent' ? t('common.for_rent') : t('common.for_sale')}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-ink-200">
                  {property.type}
                </span>
                {property.featured && (
                  <span className="rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-900">
                    {t('common.featured')}
                  </span>
                )}
              </div>
              <h1 className="font-display text-4xl leading-tight text-ink-100 md:text-5xl lg:text-6xl">{title}</h1>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-300">
                <MapPin className="h-4 w-4 text-gold-500" />
                {property.address}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.lat},${property.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs uppercase tracking-widest text-gold-500 hover:text-gold-300"
                >
                  View on Google Maps →
                </a>
              </p>
            </div>

            <div className="text-right">
              <p className="text-gold-gradient font-display text-5xl leading-none">{price}</p>
              {period && <p className="mt-1 text-sm text-ink-300">{period}</p>}
              <div className="mt-4 flex items-center justify-end gap-2">
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

        {/* Gallery */}
        <Reveal delay={0.1}>
          <PropertyGallery images={property.images} title={title} />
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-12">
            {/* Quick details grid */}
            <Reveal>
              <section>
                <h2 className="font-display text-3xl text-ink-100">{t('details.description')}</h2>
                <div className="gold-rule" />
                <DetailGrid property={property} t={t} />
              </section>
            </Reveal>

            {/* Description */}
            <Reveal>
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-3xl text-ink-100">{t('details.description')}</h2>
                  <button
                    onClick={() => setShowArabic((s) => !s)}
                    className="text-xs uppercase tracking-widest text-gold-500 hover:text-gold-300"
                  >
                    {showArabic ? t('common.show_english') : t('common.show_arabic')}
                  </button>
                </div>
                <div className="gold-rule" />
                <p className={`mt-6 max-w-3xl whitespace-pre-line text-base leading-relaxed text-ink-200 ${showArabic ? 'text-right' : ''}`}>
                  {description}
                </p>
              </section>
            </Reveal>

            {/* Amenities */}
            <Reveal>
              <section>
                <h2 className="font-display text-3xl text-ink-100">{t('details.amenities')}</h2>
                <div className="gold-rule" />
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {ALL_AMENITIES.map((key) => {
                    const has = property.amenities.includes(key)
                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-3 rounded-sm border px-4 py-3 text-sm ${
                          has
                            ? 'border-gold-500/20 bg-gold-500/[0.04] text-ink-100'
                            : 'border-white/5 text-ink-500 line-through'
                        }`}
                      >
                        {has ? (
                          <Check className="h-4 w-4 flex-shrink-0 text-gold-500" />
                        ) : (
                          <X className="h-4 w-4 flex-shrink-0 text-ink-600" />
                        )}
                        <span>{t(`amenities.${key}`)}</span>
                      </div>
                    )
                  })}
                </div>
              </section>
            </Reveal>

            {/* Map */}
            <Reveal>
              <section>
                <h2 className="font-display text-3xl text-ink-100">{t('details.location_map')}</h2>
                <div className="gold-rule" />
                <div className="mt-6 overflow-hidden rounded-sm border border-white/10">
                  <iframe
                    title="Property location"
                    src={`https://maps.google.com/maps?q=${property.lat},${property.lng}&z=15&output=embed`}
                    className="h-80 w-full"
                    loading="lazy"
                  />
                </div>
              </section>
            </Reveal>

            {/* Nearby */}
            <Reveal>
              <section>
                <h2 className="font-display text-3xl text-ink-100">{t('details.nearby')}</h2>
                <div className="gold-rule" />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {Object.entries(property.nearby).map(([key, info]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-sm border border-white/5 bg-ink-850/40 px-5 py-4"
                    >
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-gold-500">{key}</p>
                        <p className="mt-1 text-sm text-ink-100">{info.name}</p>
                      </div>
                      <p className="text-sm font-medium text-gold-300">{info.distance}</p>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Mortgage Calculator */}
            <Reveal>
              <MortgageCalculator
                defaultPrice={property.purpose === 'sale' ? property.price : property.price * 200}
                isRental={property.purpose === 'rent'}
              />
            </Reveal>

            {/* Share */}
            <Reveal>
              <section className="card-lux p-6">
                <h2 className="font-display text-2xl text-ink-100">{t('share.title')}</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  <ShareBtn icon={Link2} label={t('share.copy')} onClick={handleCopyLink} />
                  <ShareBtn
                    icon={MessageCircle}
                    label={t('share.whatsapp')}
                    href={waLink({ text: `Check out this property on IRE Bahrain: ${title} — ${window.location.href}` })}
                  />
                  <ShareBtn
                    icon={Twitter}
                    label={t('share.twitter')}
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`}
                  />
                  <ShareBtn
                    icon={Facebook}
                    label={t('share.facebook')}
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  />
                </div>
                <button
                  onClick={() => pushToast('Reported. Thank you.', { type: 'info' })}
                  className="mt-6 text-xs text-ink-400 underline-offset-2 hover:text-gold-300 hover:underline"
                >
                  {t('common.report')}
                </button>
              </section>
            </Reveal>
          </div>

          {/* Sticky agent card */}
          {agent && (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <AgentInquiryCard agent={agent} property={property} />
            </aside>
          )}
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <section className="mt-24">
            <Reveal>
              <h2 className="font-display text-3xl text-ink-100">{t('sections.similar_title')}</h2>
              <div className="gold-rule" />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <PropertyCard property={p} showCompare={false} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
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
          <div key={i} className="rounded-sm border border-white/5 bg-ink-850/40 p-4">
            <Icon className="h-5 w-5 text-gold-500" strokeWidth={1.4} />
            <p className="mt-3 text-[10px] font-medium uppercase tracking-widest text-ink-400">{item.label}</p>
            <p className="mt-1 font-display text-xl text-ink-100">{item.value}</p>
          </div>
        )
      })}
    </div>
  )
}

function AgentInquiryCard({ agent, property }) {
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
          <p className="text-[10px] uppercase tracking-widest text-gold-500">{agent.title}</p>
          <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-ink-300">
            <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
            {agent.rating.toFixed(1)} · {agent.active_listings} listings
          </p>
        </div>
      </div>

      <a
        href={waLink({ property })}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp Inquiry
      </a>
      <a
        href={`tel:${agent.phone}`}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-gold-500/30 bg-gold-500/5 py-3 text-sm font-medium text-gold-300 transition-colors hover:bg-gold-500/10"
      >
        <Phone className="h-4 w-4" /> {agent.phone}
      </a>
      <a
        href={`mailto:${agent.email}?subject=${encodeURIComponent(`Inquiry: ${property.id}`)}`}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-white/10 py-3 text-sm font-medium text-ink-200 transition-colors hover:border-gold-500/40"
      >
        <Mail className="h-4 w-4" /> {t('common.email')}
      </a>

      <Link
        to={`/agents/${agent.id}`}
        className="mt-5 block text-center text-xs uppercase tracking-widest text-gold-500 transition-colors hover:text-gold-300"
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
