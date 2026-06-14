import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Conversion rates pivoting from BD. Approximate, kept inline so the toggle
// works offline; agents can refresh these in CMS later.
//   1 BD = 2.65 USD = 9.94 SAR = 9.73 AED
export const CURRENCIES = {
  BD:  { code: 'BD',  symbol: 'BD',  rate: 1,    locale: 'en-BH', minDigits: 0 },
  USD: { code: 'USD', symbol: '$',   rate: 2.65, locale: 'en-US', minDigits: 0 },
  SAR: { code: 'SAR', symbol: 'SAR', rate: 9.94, locale: 'en-SA', minDigits: 0 },
  AED: { code: 'AED', symbol: 'AED', rate: 9.73, locale: 'en-AE', minDigits: 0 },
}

export const useCurrency = create(
  persist(
    (set) => ({
      code: 'BD',
      setCurrency: (code) => set({ code }),
    }),
    { name: 'ask-currency' }
  )
)

// Convert a BD amount to the active currency. Returns the numeric value.
export function convert(bdAmount, code) {
  const cfg = CURRENCIES[code] || CURRENCIES.BD
  return bdAmount * cfg.rate
}

// Format a converted value with locale-specific grouping. Doesn't include the
// symbol — caller decides how to render it (component / template).
export function formatNumber(amount, code) {
  const cfg = CURRENCIES[code] || CURRENCIES.BD
  return new Intl.NumberFormat(cfg.locale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: cfg.minDigits,
  }).format(amount)
}
