import { useTranslation } from 'react-i18next'
import { X, RotateCcw } from 'lucide-react'
import areas from '../../data/areas.json'
import { PROPERTY_TYPES, BEDROOM_OPTIONS, BATHROOM_OPTIONS, PRICE_RANGE } from '../../lib/constants'

// Sidebar filter panel. Pure controlled component — receives state + setters.
// Used inline on desktop and inside a slide-over drawer on mobile.
export default function PropertyFilters({ filters, set, onClose, onClear, isMobile }) {
  const { t } = useTranslation()

  const toggleArea = (name) => {
    set((f) => ({
      ...f,
      areas: f.areas.includes(name) ? f.areas.filter((x) => x !== name) : [...f.areas, name],
    }))
  }
  const toggleType = (value) => {
    set((f) => ({
      ...f,
      types: f.types.includes(value) ? f.types.filter((x) => x !== value) : [...f.types, value],
    }))
  }

  return (
    <aside className="flex h-full flex-col gap-7 overflow-y-auto bg-ink-900 p-6 lg:bg-transparent lg:p-0">
      {isMobile && (
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-display text-2xl text-ink-100">{t('filters.title')}</h2>
          <button onClick={onClose} aria-label="Close filters">
            <X className="h-5 w-5 text-ink-200" />
          </button>
        </header>
      )}

      {/* AREAS */}
      <FilterGroup title={t('filters.areas')}>
        <div className="space-y-2">
          {areas.map((area) => (
            <label key={area.slug} className="flex cursor-pointer items-center gap-3 group">
              <input
                type="checkbox"
                checked={filters.areas.includes(area.name)}
                onChange={() => toggleArea(area.name)}
                className="h-4 w-4 accent-gold-500"
              />
              <span className="text-sm text-ink-200 transition-colors group-hover:text-gold-300">
                {area.name}
              </span>
              <span className="ml-auto text-[11px] text-ink-400">{area.property_count}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* TYPES */}
      <FilterGroup title={t('filters.types')}>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((typeInfo) => (
            <button
              key={typeInfo.value}
              type="button"
              onClick={() => toggleType(typeInfo.value)}
              className={`rounded-sm border px-3 py-2 text-xs font-medium transition-all ${
                filters.types.includes(typeInfo.value)
                  ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                  : 'border-white/10 text-ink-200 hover:border-gold-500/40'
              }`}
            >
              {typeInfo.value}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* PRICE */}
      <FilterGroup title={t('filters.price_range')}>
        <p className="mb-3 text-sm text-ink-200">
          BD {filters.priceMin.toLocaleString()} — BD {filters.priceMax.toLocaleString()}
        </p>
        <div className="relative h-10">
          {/* Dual-handle range slider */}
          <input
            type="range"
            min={PRICE_RANGE.min}
            max={PRICE_RANGE.max}
            step={50}
            value={filters.priceMin}
            onChange={(e) => {
              const v = Math.min(Number(e.target.value), filters.priceMax - 50)
              set((f) => ({ ...f, priceMin: v }))
            }}
            className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent accent-gold-500 [&::-webkit-slider-thumb]:pointer-events-auto"
          />
          <input
            type="range"
            min={PRICE_RANGE.min}
            max={PRICE_RANGE.max}
            step={50}
            value={filters.priceMax}
            onChange={(e) => {
              const v = Math.max(Number(e.target.value), filters.priceMin + 50)
              set((f) => ({ ...f, priceMax: v }))
            }}
            className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent accent-gold-500 [&::-webkit-slider-thumb]:pointer-events-auto"
          />
        </div>
      </FilterGroup>

      {/* BEDROOMS */}
      <FilterGroup title={t('filters.bedrooms')}>
        <div className="flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map((b) => (
            <Pill
              key={b}
              active={filters.bedrooms === b}
              onClick={() => set((f) => ({ ...f, bedrooms: f.bedrooms === b ? '' : b }))}
            >
              {b}
            </Pill>
          ))}
        </div>
      </FilterGroup>

      {/* BATHROOMS */}
      <FilterGroup title={t('filters.bathrooms')}>
        <div className="flex flex-wrap gap-2">
          {BATHROOM_OPTIONS.map((b) => (
            <Pill
              key={b}
              active={filters.bathrooms === b}
              onClick={() => set((f) => ({ ...f, bathrooms: f.bathrooms === b ? '' : b }))}
            >
              {b}
            </Pill>
          ))}
        </div>
      </FilterGroup>

      {/* FURNISHED */}
      <FilterGroup title={t('filters.furnished')}>
        <div className="flex gap-2">
          {[
            { value: 'all', label: t('filters.all') },
            { value: 'furnished', label: t('filters.furnished_only') },
            { value: 'unfurnished', label: t('filters.unfurnished') },
          ].map((opt) => (
            <Pill
              key={opt.value}
              active={filters.furnished === opt.value}
              onClick={() => set((f) => ({ ...f, furnished: opt.value }))}
            >
              {opt.label}
            </Pill>
          ))}
        </div>
      </FilterGroup>

      {/* PURPOSE */}
      <FilterGroup title={t('filters.purpose')}>
        <div className="flex gap-2">
          {[
            { value: 'all', label: t('filters.all') },
            { value: 'rent', label: t('filters.for_rent') },
            { value: 'sale', label: t('filters.for_sale') },
          ].map((opt) => (
            <Pill
              key={opt.value}
              active={filters.purpose === opt.value}
              onClick={() => set((f) => ({ ...f, purpose: opt.value }))}
            >
              {opt.label}
            </Pill>
          ))}
        </div>
      </FilterGroup>

      {/* CLEAR */}
      <button
        type="button"
        onClick={onClear}
        className="mt-4 inline-flex items-center justify-center gap-1.5 border border-white/10 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-ink-300 transition-colors hover:border-gold-500/40 hover:text-gold-300"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        {t('filters.clear_all')}
      </button>
    </aside>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gold-500">{title}</h3>
      {children}
    </div>
  )
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
        active
          ? 'border-gold-500 bg-gold-500/10 text-gold-300'
          : 'border-white/10 text-ink-200 hover:border-gold-500/40'
      }`}
    >
      {children}
    </button>
  )
}
