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
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')
  const [maxPrice, setMaxPrice] = useState(PRICE_RANGE.max)
  const [bedrooms, setBedrooms] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('area', location)
    if (type) params.set('type', type)
    if (maxPrice !== PRICE_RANGE.max) params.set('priceMax', String(maxPrice))
    if (bedrooms) params.set('bedrooms', bedrooms)
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong w-full max-w-5xl rounded-[2px] p-3 shadow-gold-soft"
    >
      <div className="grid gap-1 lg:grid-cols-[1.2fr_1fr_1.4fr_0.8fr_auto]">
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
          className="btn-gold inline-flex h-full items-center justify-center gap-2 px-6 lg:px-8"
        >
          <Search className="h-4 w-4" /> {t('common.search')}
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

function PriceField({ label, value, onChange }) {
  return (
    <label className="block px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-widest text-ink-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink-100">
        BD 0 — BD {value.toLocaleString()}
      </p>
      <input
        type="range"
        min={PRICE_RANGE.min}
        max={PRICE_RANGE.max}
        step={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-gold-500"
      />
    </label>
  )
}
