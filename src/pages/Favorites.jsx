import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Heart } from 'lucide-react'

import PropertyCard from '../components/property/PropertyCard'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'

import properties from '../data/properties.json'
import { useFavorites } from '../store/useFavorites'
import { BRAND, SITE_URL } from '../lib/constants'

export default function Favorites() {
  const { t } = useTranslation()
  const ids = useFavorites((s) => s.ids)
  const saved = properties.filter((p) => ids.includes(p.id))

  return (
    <>
      <Helmet>
        <title>{`${t('favorites.title')} — ${BRAND.shortName}`}</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`${SITE_URL}/favorites`} />
      </Helmet>

      <div className="container-lux pb-24 pt-12">
        <SectionHeader eyebrow={t('nav.favorites')} title={t('favorites.title')} />

        {saved.length === 0 ? (
          <Reveal>
            <div className="card-lux mt-12 flex flex-col items-center gap-5 px-6 py-24 text-center">
              <Heart className="h-12 w-12 text-gold-500/60" strokeWidth={1.4} />
              <h2 className="font-display text-2xl text-ink-100">{t('favorites.empty_title')}</h2>
              <p className="max-w-sm text-sm text-ink-300">{t('favorites.empty_text')}</p>
              <Link to="/properties" className="btn-gold mt-2 text-xs">
                {t('favorites.browse')}
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
