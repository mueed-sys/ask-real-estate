import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calculator } from 'lucide-react'
import { formatPriceWithCurrency } from '../../lib/format'

// Standard amortisation: M = P[r(1+r)^n] / [(1+r)^n - 1]
function monthlyPayment({ principal, annualRate, years }) {
  if (principal <= 0) return 0
  const monthlyRate = annualRate / 100 / 12
  const n = years * 12
  if (monthlyRate === 0) return principal / n
  const factor = Math.pow(1 + monthlyRate, n)
  return (principal * monthlyRate * factor) / (factor - 1)
}

const TERM_OPTIONS = [10, 15, 20, 25, 30]

export default function MortgageCalculator({ defaultPrice = 100000, isRental = false }) {
  const { t } = useTranslation()

  const [price, setPrice] = useState(defaultPrice)
  const [downPct, setDownPct] = useState(20)
  const [rate, setRate] = useState(5.5)
  const [years, setYears] = useState(25)

  const { loanAmount, monthly, totalPayment, totalInterest } = useMemo(() => {
    const downPayment = (price * downPct) / 100
    const principal = price - downPayment
    const m = monthlyPayment({ principal, annualRate: rate, years })
    const total = m * years * 12
    return {
      loanAmount: principal,
      monthly: m,
      totalPayment: total,
      totalInterest: total - principal,
    }
  }, [price, downPct, rate, years])

  return (
    <section className="card-lux p-6 lg:p-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{t('mortgage.title')}</p>
          <h3 className="mt-3 font-display text-2xl text-ink-100">{t('mortgage.title')}</h3>
          <p className="mt-1.5 text-sm text-ink-300">{t('mortgage.subtitle')}</p>
        </div>
        <Calculator className="h-6 w-6 flex-shrink-0 text-gold-500" />
      </header>

      {isRental && (
        <p className="mt-5 rounded-sm border border-gold-500/20 bg-gold-500/5 p-3 text-xs text-gold-200">
          {t('mortgage.rental_note')}
        </p>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Inputs column */}
        <div className="space-y-5">
          <Field label={t('mortgage.property_price')} value={price.toLocaleString()}>
            <input
              type="number"
              min={0}
              step={1000}
              value={price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
              className="w-full bg-transparent font-display text-2xl text-ink-100 outline-none"
            />
          </Field>

          <Field label={t('mortgage.down_payment')} value={`${downPct}% · ${formatPriceWithCurrency((price * downPct) / 100)}`}>
            <input
              type="range"
              min={0}
              max={70}
              step={5}
              value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))}
              className="w-full accent-gold-500"
            />
          </Field>

          <Field label={t('mortgage.interest_rate')} value={`${rate}%`}>
            <input
              type="number"
              min={0}
              max={20}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
              className="w-full bg-transparent font-display text-2xl text-ink-100 outline-none"
            />
          </Field>

          <Field label={t('mortgage.loan_term')}>
            <div className="flex flex-wrap gap-2">
              {TERM_OPTIONS.map((y) => (
                <button
                  key={y}
                  onClick={() => setYears(y)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                    years === y
                      ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                      : 'border-white/10 text-ink-300 hover:border-gold-500/40'
                  }`}
                >
                  {y} {t('mortgage.years')}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Results column */}
        <div className="rounded-sm border border-gold-500/20 bg-gold-500/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-widest text-gold-500">{t('mortgage.monthly_payment')}</p>
          <p className="mt-2 font-numbers text-5xl font-bold leading-none tracking-tight tabular-nums text-gold-gradient">
            {formatPriceWithCurrency(Math.round(monthly))}
          </p>

          <div className="mt-6 space-y-3 border-t border-white/5 pt-5 text-sm">
            <Row label={t('mortgage.loan_amount')} value={formatPriceWithCurrency(Math.round(loanAmount))} />
            <Row label={t('mortgage.total_payment')} value={formatPriceWithCurrency(Math.round(totalPayment))} />
            <Row label={t('mortgage.total_interest')} value={formatPriceWithCurrency(Math.round(totalInterest))} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, value, children }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-medium uppercase tracking-widest text-ink-300">{label}</span>
        {value != null && <span className="text-xs text-ink-200">{value}</span>}
      </div>
      <div className="mt-2 rounded-sm border border-white/10 bg-ink-900/40 px-3 py-2.5 transition-colors focus-within:border-gold-500/40">
        {children}
      </div>
    </label>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-300">{label}</span>
      <span className="font-display text-lg text-ink-100">{value}</span>
    </div>
  )
}
