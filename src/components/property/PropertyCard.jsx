import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Heart, BedDouble, Bath, Maximize2, MapPin, GitCompare, MessageCircle, Sparkles,
} from 'lucide-react'
import { useFavorites } from '../../store/useFavorites'
import { useComparison } from '../../store/useComparison'
import { useToast } from '../../store/useToast'
import { formatPriceWithCurrency, bedroomLabel, localized } from '../../lib/format'
import { waLink } from '../../lib/whatsapp'

// Compact / luxury / list variants share data but differ in dimension.
// Default variant fits a 3-column grid on desktop.
export default function PropertyCard({ property, variant = 'grid', showCompare = true, eager = false }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const isFav = useFavorites((s) => s.isFavorite(property.id))
  const toggleFav = useFavorites((s) => s.toggle)
  const isCompare = useComparison((s) => s.isInCompare(property.id))
  const toggleCompare = useComparison((s) => s.toggle)
  const pushToast = useToast((s) => s.push)

  const handleFav = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFav(property.id)
    pushToast(isFav ? t('toast.saved_removed') : t('toast.saved_added'))
  }

  const handleCompare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const result = toggleCompare(property.id)
    if (result.atMax) {
      pushToast(t('toast.compare_max'), { type: 'error' })
      return
    }
    pushToast(result.added ? t('toast.compare_added') : t('toast.compare_removed'))
  }

  const handleWhatsapp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(waLink({ property }), '_blank', 'noopener')
  }

  const title = localized(property, 'title', lang)
  const price = formatPriceWithCurrency(property.price, lang)
  const period =
    property.purpose === 'rent'
      ? property.price_period === 'year'
        ? t('common.per_year')
        : t('common.per_month')
      : ''

  if (variant === 'list') {
    return (
      <Link to={`/properties/${property.id}`} className="card-lux group flex flex-col gap-0 sm:flex-row">
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:w-72 sm:flex-shrink-0">
          <img
            src={property.images[0]}
            alt={title}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <Badges property={property} t={t} />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-4 p-6">
          <div>
            <h3 className="font-display text-2xl text-ink-100">{title}</h3>
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-500">
              <MapPin className="h-3 w-3" /> {property.location}
            </p>
            <Specs property={property} t={t} className="mt-4" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-gold-gradient font-display text-3xl">{price}</span>
              {period && <span className="ml-1 text-sm text-ink-300">{period}</span>}
            </div>
            <CardActions {...{ isFav, isCompare, handleFav, handleCompare, handleWhatsapp, showCompare, t }} />
          </div>
        </div>
      </Link>
    )
  }

  // Default grid variant
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/properties/${property.id}`} className="card-lux flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[0]}
            alt={title}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* gradient overlay for text legibility on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent" />
          <Badges property={property} t={t} />
          <FavBtn isFav={isFav} onClick={handleFav} />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <h3 className="font-display text-xl leading-tight text-ink-100">{title}</h3>
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gold-500">
              <MapPin className="h-3 w-3" /> {property.location}
            </p>
          </div>

          <div>
            <span className="text-gold-gradient font-display text-3xl leading-none">{price}</span>
            {period && <span className="ml-1 text-sm text-ink-300">{period}</span>}
          </div>

          <Specs property={property} t={t} />

          <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex items-center gap-2">
              {property.furnished && (
                <span className="text-[10px] font-medium uppercase tracking-widest text-ink-300">
                  {t('filters.furnished_only')}
                </span>
              )}
            </div>
            <CardActions {...{ isFav, isCompare, handleFav, handleCompare, handleWhatsapp, showCompare, t }} compact />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function Badges({ property, t }) {
  return (
    <div className="absolute left-4 top-4 flex items-center gap-2">
      {property.featured && (
        <span className="inline-flex items-center gap-1 rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-900">
          <Sparkles className="h-3 w-3" /> {t('common.featured')}
        </span>
      )}
      <span className="rounded-full border border-white/15 bg-ink-900/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-100 backdrop-blur-sm">
        {property.purpose === 'rent' ? t('common.for_rent') : t('common.for_sale')}
      </span>
      <span className="rounded-full border border-white/15 bg-ink-900/70 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-ink-200 backdrop-blur-sm">
        {property.type}
      </span>
    </div>
  )
}

function Specs({ property, t, className = '' }) {
  return (
    <div className={`flex items-center gap-5 text-sm text-ink-300 ${className}`}>
      <span className="inline-flex items-center gap-1.5">
        <BedDouble className="h-4 w-4 text-gold-500" />
        {bedroomLabel(property.bedrooms, 'en')}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Bath className="h-4 w-4 text-gold-500" />
        {property.bathrooms}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Maximize2 className="h-4 w-4 text-gold-500" />
        {property.sqm} m²
      </span>
    </div>
  )
}

function FavBtn({ isFav, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Save to favorites"
      className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-ink-900/70 text-ink-100 backdrop-blur-sm transition-all hover:border-gold-500/40 hover:text-gold-300"
    >
      <Heart
        className={`h-4 w-4 transition-all ${isFav ? 'fill-gold-500 text-gold-500' : ''}`}
        strokeWidth={1.6}
      />
    </button>
  )
}

function CardActions({ isFav, isCompare, handleCompare, handleWhatsapp, showCompare, t, compact }) {
  return (
    <div className="flex items-center gap-2">
      {showCompare && (
        <button
          onClick={handleCompare}
          aria-label="Compare"
          className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium tracking-wide transition-colors ${
            isCompare
              ? 'border-gold-500/60 bg-gold-500/10 text-gold-300'
              : 'border-white/10 text-ink-300 hover:border-gold-500/40 hover:text-gold-300'
          }`}
        >
          <GitCompare className="h-3.5 w-3.5" />
          {!compact && <span>{t('nav.compare')}</span>}
        </button>
      )}
      <button
        onClick={handleWhatsapp}
        aria-label="WhatsApp"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-[#25D366]/50 hover:text-[#25D366]"
      >
        <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  )
}
