import { useCurrency, CURRENCIES, convert, formatNumber } from '../../store/useCurrency'

// Premium price treatment: small muted currency symbol + bold gold-gradient
// number + small muted unit. The component listens to the currency store
// directly so toggling in the header re-renders every visible price.
//
// `bd` is the canonical Bahraini-dinar amount; everything else flows from it.
// `unit` is shown after the number ("/month", "total", etc.).
// `size` controls the visual scale via tailwind text-[…] sizes — pass a
// numeric pixel value as a string ("32px", "44px") for fine control.
export default function Price({ bd, unit, size = '36px', className = '' }) {
  const code = useCurrency((s) => s.code)
  const cfg = CURRENCIES[code] || CURRENCIES.BD
  const amount = convert(bd, code)
  const display = formatNumber(amount, code)

  return (
    <span className={`price-row ${className}`} style={{ fontSize: size }}>
      <span className="price-currency">{cfg.symbol}</span>
      <span className="price-amount">{display}</span>
      {unit && <span className="price-unit">{unit}</span>}
    </span>
  )
}
