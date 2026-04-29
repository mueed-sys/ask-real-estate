// Display formatters for property data — keep these tiny & branding-aware.

export function formatPrice(value, locale = 'en') {
  if (value == null) return ''
  const localised = locale === 'ar' ? value.toLocaleString('ar-EG') : value.toLocaleString('en-US')
  return localised
}

export function formatPriceWithCurrency(value, locale = 'en') {
  const currency = locale === 'ar' ? 'د.ب' : 'BD'
  return `${currency} ${formatPrice(value, locale)}`
}

export function bedroomLabel(count, locale = 'en') {
  if (count === 0) return locale === 'ar' ? 'استوديو' : 'Studio'
  return String(count)
}

export function floorLabel(floor, locale = 'en') {
  if (floor === 0) return locale === 'ar' ? 'الطابق الأرضي' : 'Ground'
  return String(floor)
}

export function shortDate(iso, locale = 'en') {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(locale === 'ar' ? 'ar-BH' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Used to render localized property fields (title, description) based on locale,
// falling back to the English version if Arabic content is missing.
export function localized(obj, key, locale = 'en') {
  if (!obj) return ''
  if (locale === 'ar' && obj[`${key}_ar`]) return obj[`${key}_ar`]
  return obj[key] ?? ''
}
