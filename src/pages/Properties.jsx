import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { LayoutGrid, Rows3, SlidersHorizontal, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'

import PropertyCard from '../components/property/PropertyCard'
import PropertyFilters from '../components/property/PropertyFilters'
import SectionHeader from '../components/common/SectionHeader'

import properties from '../data/properties.json'
import { PRICE_RANGE, BRAND, SITE_URL } from '../lib/constants'

const PER_PAGE = 12

const DEFAULT_FILTERS = {
  areas: [],
  types: [],
  priceMin: PRICE_RANGE.min,
  priceMax: PRICE_RANGE.max,
  bedrooms: '',
  bathrooms: '',
  furnished: 'all',
  purpose: 'all',
  sort: 'newest',
}

// Read URL params into the filter state shape.
function filtersFromParams(params) {
  return {
    areas: params.get('area') ? params.get('area').split(',').filter(Boolean) : [],
    types: params.get('type') ? params.get('type').split(',').filter(Boolean) : [],
    priceMin: Number(params.get('priceMin') ?? PRICE_RANGE.min),
    priceMax: Number(params.get('priceMax') ?? PRICE_RANGE.max),
    bedrooms: params.get('bedrooms') ?? '',
    bathrooms: params.get('bathrooms') ?? '',
    furnished: params.get('furnished') ?? 'all',
    purpose: params.get('purpose') ?? 'all',
    sort: params.get('sort') ?? 'newest',
  }
}

function filtersToParams(filters) {
  const p = new URLSearchParams()
  if (filters.areas.length) p.set('area', filters.areas.join(','))
  if (filters.types.length) p.set('type', filters.types.join(','))
  if (filters.priceMin !== PRICE_RANGE.min) p.set('priceMin', String(filters.priceMin))
  if (filters.priceMax !== PRICE_RANGE.max) p.set('priceMax', String(filters.priceMax))
  if (filters.bedrooms) p.set('bedrooms', filters.bedrooms)
  if (filters.bathrooms) p.set('bathrooms', filters.bathrooms)
  if (filters.furnished !== 'all') p.set('furnished', filters.furnished)
  if (filters.purpose !== 'all') p.set('purpose', filters.purpose)
  if (filters.sort !== 'newest') p.set('sort', filters.sort)
  return p
}

function applyFilters(list, f) {
  let out = list

  if (f.areas.length) out = out.filter((p) => f.areas.includes(p.location))
  if (f.types.length) out = out.filter((p) => f.types.includes(p.type))
  out = out.filter((p) => p.price >= f.priceMin && p.price <= Math.max(f.priceMax, p.price === 0 ? 0 : 1))
  // Allow listings priced higher than max only if max is at the slider ceiling
  if (f.priceMax < PRICE_RANGE.max) out = out.filter((p) => p.price <= f.priceMax)

  if (f.bedrooms === 'Studio') out = out.filter((p) => p.bedrooms === 0)
  else if (f.bedrooms === '5+') out = out.filter((p) => p.bedrooms >= 5)
  else if (f.bedrooms) out = out.filter((p) => p.bedrooms === Number(f.bedrooms))

  if (f.bathrooms === '4+') out = out.filter((p) => p.bathrooms >= 4)
  else if (f.bathrooms) out = out.filter((p) => p.bathrooms === Number(f.bathrooms))

  if (f.furnished === 'furnished') out = out.filter((p) => p.furnished === true)
  else if (f.furnished === 'unfurnished') out = out.filter((p) => p.furnished === false)

  if (f.purpose !== 'all') out = out.filter((p) => p.purpose === f.purpose)

  switch (f.sort) {
    case 'price_low':
      out = [...out].sort((a, b) => a.price - b.price)
      break
    case 'price_high':
      out = [...out].sort((a, b) => b.price - a.price)
      break
    case 'largest':
      out = [...out].sort((a, b) => b.sqm - a.sqm)
      break
    default:
      out = [...out].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
  return out
}

export default function Properties() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const [filters, setFilters] = useState(() => filtersFromParams(params))
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Sync URL params -> filter state when params change (e.g., browser back).
  useEffect(() => {
    setFilters(filtersFromParams(params))
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()])

  // Sync filter state -> URL when filters change.
  useEffect(() => {
    const next = filtersToParams(filters)
    if (next.toString() !== params.toString()) {
      setParams(next, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const filtered = useMemo(() => applyFilters(properties, filters), [filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const setFilter = (updater) => {
    setFilters((prev) => (typeof updater === 'function' ? updater(prev) : updater))
    setPage(1)
  }
  const clearAll = () => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  return (
    <>
      <Helmet>
        <title>Properties for Rent & Sale in Bahrain — {BRAND.shortName}</title>
        <meta
          name="description"
          content={`Browse ${properties.length}+ properties for rent and sale across Bahrain — Juffair, Seef, Amwaj, Riffa, Bahrain Bay and more.`}
        />
        <link rel="canonical" href={`${SITE_URL}/properties`} />
      </Helmet>

      <div className="container-lux pb-24 pt-12">
        {/* Page header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow={t('common.results')}
            title={t('nav.properties')}
            subtitle={t('common.results_count', { shown: visible.length, total: filtered.length })}
          />

          <div className="flex items-center gap-3">
            {/* Mobile filter button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-ink-200 lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t('common.filter')}
            </button>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => setFilter((f) => ({ ...f, sort: e.target.value }))}
              className="rounded-sm border border-white/10 bg-ink-900/40 px-3 py-2 text-xs text-ink-200 outline-none transition-colors focus:border-gold-500/40"
            >
              <option value="newest">{t('filters.newest')}</option>
              <option value="price_low">{t('filters.price_low')}</option>
              <option value="price_high">{t('filters.price_high')}</option>
              <option value="largest">{t('filters.largest')}</option>
            </select>

            {/* View toggle */}
            <div className="flex rounded-sm border border-white/10 p-0.5">
              <ViewBtn active={view === 'grid'} onClick={() => setView('grid')} icon={LayoutGrid} />
              <ViewBtn active={view === 'list'} onClick={() => setView('list')} icon={Rows3} />
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <PropertyFilters filters={filters} set={setFilter} onClear={clearAll} />
          </div>

          {/* Results */}
          <div>
            {filtered.length === 0 ? (
              <div className="card-lux flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
                <Inbox className="h-12 w-12 text-gold-500/60" />
                <h3 className="font-display text-2xl text-ink-100">{t('common.no_results')}</h3>
                <p className="max-w-sm text-sm text-ink-300">{t('common.no_results_hint')}</p>
                <button onClick={clearAll} className="btn-outline mt-2 text-xs">
                  {t('filters.clear_all')}
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    view === 'grid'
                      ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'
                      : 'flex flex-col gap-5'
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {visible.map((p, i) => (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
                      >
                        <PropertyCard property={p} variant={view === 'list' ? 'list' : 'grid'} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <PageBtn disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} aria-label="Previous">
                      <ChevronLeft className="h-4 w-4" />
                    </PageBtn>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const n = idx + 1
                      return (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`inline-flex h-9 min-w-9 items-center justify-center rounded-sm border px-3 text-sm font-medium transition-colors ${
                            n === safePage
                              ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                              : 'border-white/10 text-ink-300 hover:border-gold-500/40 hover:text-gold-300'
                          }`}
                        >
                          {n}
                        </button>
                      )
                    })}
                    <PageBtn disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)} aria-label="Next">
                      <ChevronRight className="h-4 w-4" />
                    </PageBtn>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink-950/70 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm shadow-gold-strong lg:hidden"
            >
              <PropertyFilters
                filters={filters}
                set={setFilter}
                onClear={clearAll}
                onClose={() => setDrawerOpen(false)}
                isMobile
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function ViewBtn({ active, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-sm transition-colors ${
        active ? 'bg-gold-500/10 text-gold-300' : 'text-ink-300 hover:text-gold-300'
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </button>
  )
}

function PageBtn({ children, disabled, ...rest }) {
  return (
    <button
      disabled={disabled}
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-ink-300 transition-colors hover:border-gold-500/40 hover:text-gold-300 disabled:cursor-not-allowed disabled:opacity-30"
      {...rest}
    >
      {children}
    </button>
  )
}
