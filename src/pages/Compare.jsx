import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { GitCompare, X, MapPin, Check, Minus } from 'lucide-react'

import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'

import properties from '../data/properties.json'
import { useComparison } from '../store/useComparison'
import { formatPriceWithCurrency, bedroomLabel, floorLabel, localized } from '../lib/format'
import { BRAND, SITE_URL } from '../lib/constants'

const SPEC_ROWS = [
  { key: 'price', label: (t) => t('search.price'), render: (p, t, lang) => formatPriceWithCurrency(p.price, lang) + (p.purpose === 'rent' ? t('common.per_month') : '') },
  { key: 'type', label: (t) => t('search.type'), render: (p) => p.type },
  { key: 'purpose', label: (t) => t('filters.purpose'), render: (p, t) => (p.purpose === 'rent' ? t('common.for_rent') : t('common.for_sale')) },
  { key: 'location', label: () => 'Location', render: (p) => p.location },
  { key: 'bedrooms', label: (t) => t('details.bedrooms'), render: (p) => bedroomLabel(p.bedrooms) },
  { key: 'bathrooms', label: (t) => t('details.bathrooms'), render: (p) => p.bathrooms },
  { key: 'sqm', label: (t) => t('details.area_sqm'), render: (p) => `${p.sqm} m²` },
  { key: 'floor', label: (t) => t('details.floor'), render: (p) => floorLabel(p.floor) },
  { key: 'parking', label: (t) => t('details.parking'), render: (p) => p.parking },
  { key: 'furnished', label: (t) => t('details.furnished'), render: (p, t) => (p.furnished ? t('details.yes') : t('details.no')) },
  { key: 'year_built', label: (t) => t('details.year_built'), render: (p) => p.year_built },
]

const AMENITY_KEYS = [
  'pool', 'gym', 'security_24_7', 'covered_parking', 'balcony', 'sea_view',
  'maids_room', 'storage', 'central_ac', 'built_in_wardrobes',
  'kitchen_appliances', 'internet', 'playground', 'concierge',
]

export default function Compare() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const ids = useComparison((s) => s.ids)
  const remove = useComparison((s) => s.remove)
  const clear = useComparison((s) => s.clear)

  const selected = properties.filter((p) => ids.includes(p.id))

  return (
    <>
      <Helmet>
        <title>{`${t('compare.title')} — ${BRAND.shortName}`}</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`${SITE_URL}/compare`} />
      </Helmet>

      <div className="container-lux pb-24 pt-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader eyebrow={t('nav.compare')} title={t('compare.title')} subtitle={t('compare.subtitle')} />
          {selected.length > 0 && (
            <button onClick={clear} className="btn-outline text-xs">
              {t('compare.clear_all')}
            </button>
          )}
        </div>

        {selected.length < 2 ? (
          <Reveal>
            <div className="card-lux mt-12 flex flex-col items-center gap-5 px-6 py-24 text-center">
              <GitCompare className="h-12 w-12 text-gold-500/60" strokeWidth={1.4} />
              <h2 className="font-display text-2xl text-ink-100">{t('compare.empty_title')}</h2>
              <p className="max-w-sm text-sm text-ink-300">{t('compare.empty_text')}</p>
              <Link to="/properties" className="btn-gold mt-2 text-xs">
                {t('compare.browse')}
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-44 border-b border-white/10 p-4" />
                  {selected.map((p) => (
                    <th key={p.id} className="min-w-[260px] border-b border-white/10 p-4 text-left align-bottom">
                      <div className="card-lux relative overflow-hidden">
                        <button
                          onClick={() => remove(p.id)}
                          className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink-900/80 text-ink-200 backdrop-blur-sm transition-colors hover:text-gold-300"
                          aria-label="Remove"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <Link to={`/properties/${p.id}`} className="block">
                          <img src={p.images[0]} alt={localized(p, 'title', lang)} className="aspect-[16/10] w-full object-cover" />
                          <div className="p-4">
                            <p className="font-display text-lg leading-tight text-ink-100">{localized(p, 'title', lang)}</p>
                            <p className="mt-1 inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-gold-500">
                              <MapPin className="h-3 w-3" /> {p.location}
                            </p>
                          </div>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map((row) => {
                  const values = selected.map((p) => row.render(p, t, lang))
                  const allSame = values.every((v) => v === values[0])
                  return (
                    <tr key={row.key}>
                      <td className="border-b border-white/5 p-4 align-top text-[11px] font-medium uppercase tracking-widest text-gold-500">
                        {row.label(t)}
                      </td>
                      {selected.map((p, i) => (
                        <td
                          key={p.id}
                          className={`border-b border-white/5 p-4 align-top text-sm ${
                            allSame ? 'text-ink-200' : 'font-medium text-ink-100'
                          }`}
                        >
                          {values[i]}
                        </td>
                      ))}
                    </tr>
                  )
                })}

                {/* Amenities row block */}
                <tr>
                  <td colSpan={selected.length + 1} className="border-b border-white/5 px-4 pb-2 pt-8 text-[11px] font-semibold uppercase tracking-widest text-gold-500">
                    {t('details.amenities')}
                  </td>
                </tr>
                {AMENITY_KEYS.map((key) => (
                  <tr key={key}>
                    <td className="border-b border-white/5 p-4 align-top text-sm text-ink-300">{t(`amenities.${key}`)}</td>
                    {selected.map((p) => (
                      <td key={p.id} className="border-b border-white/5 p-4 align-top">
                        {p.amenities.includes(key) ? (
                          <Check className="h-4 w-4 text-gold-500" />
                        ) : (
                          <Minus className="h-4 w-4 text-ink-600" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
