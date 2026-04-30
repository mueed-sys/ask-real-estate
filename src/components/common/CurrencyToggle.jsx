import { useState, useRef, useEffect } from 'react'
import { useCurrency, CURRENCIES } from '../../store/useCurrency'
import { ChevronDown } from 'lucide-react'

// Header currency switcher — small dropdown listing BD / USD / SAR / AED.
// Selection persists to localStorage via the zustand persist middleware so
// every visit honours the visitor's preferred currency.
export default function CurrencyToggle({ className = '' }) {
  const code = useCurrency((s) => s.code)
  const setCurrency = useCurrency((s) => s.setCurrency)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Change currency"
        className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-200 transition-colors hover:border-gold-500/40 hover:text-gold-300"
      >
        {code}
        <ChevronDown className="h-3 w-3" strokeWidth={1.6} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-32 overflow-hidden rounded-md border border-white/10 bg-ink-elevated shadow-2xl"
        >
          {Object.values(CURRENCIES).map((c) => {
            const active = c.code === code
            return (
              <li key={c.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => { setCurrency(c.code); setOpen(false) }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors ${
                    active ? 'bg-gold-500/10 text-gold-300' : 'text-ink-200 hover:bg-white/[0.04] hover:text-ink-100'
                  }`}
                >
                  <span className="font-semibold tracking-wide">{c.code}</span>
                  <span className="text-[10px] text-ink-400">{c.symbol}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
