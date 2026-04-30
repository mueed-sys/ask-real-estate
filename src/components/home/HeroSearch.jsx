import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Search, MapPin, Building2, BedDouble, ChevronDown } from 'lucide-react'
import areas from '../../data/areas.json'
import { PROPERTY_TYPES, BEDROOM_OPTIONS, PRICE_RANGE } from '../../lib/constants'

// Glass-morphism floating search bar over the hero image.
export default function HeroSearch() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [purpose, setPurpose] = useState('rent')   // 'rent' | 'sale'
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')
  const [maxPrice, setMaxPrice] = useState(PRICE_RANGE.max)
  const [bedrooms, setBedrooms] = useState('')

  // Scale the price slider depending on rent vs sale — different orders of magnitude.
  // Sale ceilings sit at BD 500k with 25k snaps; rent at BD 5,000/mo with 50 snaps.
  const priceCfg =
    purpose === 'sale'
      ? { min: 0, max: 500_000, step: 25_000, default: 500_000, unit: 'total' }
      : { min: PRICE_RANGE.min, max: PRICE_RANGE.max, step: 50, default: PRICE_RANGE.max, unit: '/month' }

  // Reset price ceiling when toggling between rent/sale so the slider doesn't
  // get stuck at the wrong scale.
  const handlePurpose = (next) => {
    setPurpose(next)
    setMaxPrice(next === 'sale' ? 500_000 : PRICE_RANGE.max)
  }

  const submit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (purpose) params.set('purpose', purpose)
    if (location) params.set('area', location)
    if (type) params.set('type', type)
    if (maxPrice !== priceCfg.default) params.set('priceMax', String(maxPrice))
    if (bedrooms) params.set('bedrooms', bedrooms)
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-5xl rounded-[3px] border border-white/10 bg-ink-950/35 p-2.5 shadow-gold-soft backdrop-blur-2xl"
    >
      {/* Rent / Sale segmented control — sliding gold pill behind the active
          option using framer-motion's shared layout, so the active state is
          unmistakable instead of two adjacent buttons. */}
      <div className="mb-2 flex w-full max-w-[260px] items-center rounded-full border border-white/15 bg-ink-950/40 p-1 backdrop-blur-sm">
        {[
          { value: 'rent', label: 'For Rent' },
          { value: 'sale', label: 'For Sale' },
        ].map((opt) => {
          const active = purpose === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handlePurpose(opt.value)}
              aria-pressed={active}
              className="relative flex-1 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="purpose-pill"
                  transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                  className="absolute inset-0 rounded-full bg-gold-gradient shadow-[0_4px_18px_-4px_rgba(212,175,55,0.5)]"
                />
              )}
              <span className={`relative z-10 ${active ? 'text-ink-900' : 'text-ink-200'}`}>{opt.label}</span>
            </button>
          )
        })}
      </div>

      <div className="grid items-stretch gap-1 lg:grid-cols-[1.2fr_1fr_1.4fr_0.8fr_auto]">
        <SelectField
          icon={MapPin}
          label={t('search.location')}
          value={location}
          onChange={setLocation}
          options={[{ value: '', label: t('search.any_location') }, ...areas.map((a) => ({ value: a.name, label: a.name }))]}
        />
        <SelectField
          icon={Building2}
          label={t('search.type')}
          value={type}
          onChange={setType}
          options={[{ value: '', label: t('search.any_type') }, ...PROPERTY_TYPES.map((p) => ({ value: p.value, label: p.value }))]}
        />
        <PriceField
          label={t('search.price')}
          value={maxPrice}
          onChange={setMaxPrice}
          cfg={priceCfg}
        />
        <SelectField
          icon={BedDouble}
          label={t('search.bedrooms')}
          value={bedrooms}
          onChange={setBedrooms}
          options={[{ value: '', label: t('search.any_bedrooms') }, ...BEDROOM_OPTIONS.map((b) => ({ value: b, label: b }))]}
        />
        <button
          type="submit"
          aria-label={t('common.search')}
          className="btn-gold inline-flex h-12 items-center justify-center gap-2 self-center px-5 text-xs lg:ml-1"
        >
          <Search className="h-4 w-4" />
          <span>{t('common.search')}</span>
        </button>
      </div>
    </motion.form>
  )
}

function SelectField({ icon: Icon, label, value, onChange, options }) {
  return (
    <label className="group relative block rounded-sm transition-colors hover:bg-white/[0.02]">
      <div className="flex items-center gap-2.5 px-4 py-3">
        <Icon className="h-4 w-4 flex-shrink-0 text-gold-500" strokeWidth={1.5} />
        <div className="flex-1">
          <p className="text-[10px] font-medium uppercase tracking-widest text-ink-400">{label}</p>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-transparent text-sm font-medium text-ink-100 outline-none"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value} className="bg-ink-900 text-ink-100">
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-ink-400 transition-transform group-hover:translate-y-0.5" />
      </div>
    </label>
  )
}

function PriceField({ label, value, onChange, cfg }) {
  // Cap value to current cfg.max in case we're transitioning between rent/sale
  const safeValue = Math.min(value, cfg.max)
  return (
    <label className="block px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-widest text-ink-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink-100">
        BD 0 — BD {safeValue.toLocaleString()}{' '}
        <span className="text-ink-400">{cfg.unit}</span>
      </p>
      <input
        type="range"
        aria-label={label}
        min={cfg.min}
        max={cfg.max}
        step={cfg.step}
        value={safeValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-gold-500"
      />
    </label>
  )
}
