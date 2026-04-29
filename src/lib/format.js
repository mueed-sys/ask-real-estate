// Display formatters for property data — English-only build.

export function formatPrice(value) {
  if (value == null) return ''
  return value.toLocaleString('en-US')
}

export function formatPriceWithCurrency(value) {
  return `BD ${formatPrice(value)}`
}

export function bedroomLabel(count) {
  if (count === 0) return 'Studio'
  return String(count)
}

export function floorLabel(floor) {
  if (floor === 0) return 'Ground'
  return String(floor)
}

export function shortDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Returns the property field as-is (Arabic alternates removed in v1).
// Kept for compatibility — accepts an optional locale arg that is now ignored.
export function localized(obj, key) {
  if (!obj) return ''
  return obj[key] ?? ''
}
