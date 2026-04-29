import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { localized, formatPriceWithCurrency } from '../../lib/format'

export default function AreaCard({ area, variant = 'home' }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const name = localized(area, 'name', lang)
  const tagline = localized(area, 'tagline', lang)

  if (variant === 'detailed') {
    return (
      <motion.div whileHover={{ y: -6 }}>
        <Link
          to={`/areas/${area.slug}`}
          className="card-lux group relative block overflow-hidden"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={area.image}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
          </div>
          <div className="p-6">
            <h3 className="font-display text-3xl text-ink-100">{name}</h3>
            <p className="mt-1.5 text-sm text-ink-300">{tagline}</p>

            <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="uppercase tracking-widest text-ink-400">{t('areas_page.average_rent')}</p>
                <p className="mt-1 font-display text-lg text-gold-400">{formatPriceWithCurrency(area.avg_rent_bd)}<span className="text-xs text-ink-300">/m</span></p>
              </div>
              <div>
                <p className="uppercase tracking-widest text-ink-400">{t('areas_page.available')}</p>
                <p className="mt-1 font-display text-lg text-gold-400">{area.property_count}</p>
              </div>
            </div>

            <div className="mt-5 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-500 transition-colors group-hover:text-gold-300">
              {t('common.explore')}
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // home variant — image-only card with overlay
  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      <Link
        to={`/areas/${area.slug}`}
        className="group relative block aspect-[4/5] overflow-hidden rounded-sm"
      >
        <img
          src={area.image}
          alt={name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent transition-opacity group-hover:from-ink-950/95" />

        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-gold-500">
            <MapPin className="h-3 w-3" /> {area.property_count} {t('areas_page.available')}
          </p>
          <h3 className="mt-2 font-display text-3xl leading-none text-ink-100">{name}</h3>
          <div className="mt-2 h-px w-8 bg-gold-gradient transition-all duration-500 group-hover:w-16" />
          <p className="mt-3 max-h-0 overflow-hidden text-xs text-ink-200 opacity-0 transition-all duration-500 group-hover:max-h-12 group-hover:opacity-100">
            {tagline}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
