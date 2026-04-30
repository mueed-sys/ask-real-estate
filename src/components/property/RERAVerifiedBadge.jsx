import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, ExternalLink } from 'lucide-react'

// Verified badge that expands on hover (desktop) or tap (mobile) into a panel
// showing license, inspector, inspection date, and last price update. Mock
// data filled in by the caller — props are simple strings.
export default function RERAVerifiedBadge({ license = 'B201806/0212', inspector, inspectedOn, lastPriceUpdate }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={(e) => {
          // Keep open if hovering the popover by checking related target
          if (!ref.current?.contains(e.relatedTarget)) setOpen(false)
        }}
        title="RERA-verified listing — click for inspection details"
        className="inline-flex items-center gap-1.5 rounded-full border border-success-500/40 bg-success-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-success-300 transition-colors hover:border-success-500/70"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <ShieldCheck className="h-3 w-3" strokeWidth={2.2} />
        RERA Verified
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            className="absolute left-1/2 top-full z-30 mt-3 w-72 -translate-x-1/2 overflow-hidden rounded-md border border-success-500/30 bg-ink-elevated shadow-2xl"
          >
            <header className="border-b border-white/8 bg-success-500/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success-300" strokeWidth={1.8} />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-success-200">
                  RERA Verified Listing
                </p>
              </div>
              <p className="mt-1 font-numbers text-sm font-bold text-ink-100">License {license}</p>
            </header>
            <ul className="divide-y divide-white/5 px-4 py-3 text-xs text-ink-200">
              {inspector && (
                <li className="flex items-center justify-between gap-3 py-1.5">
                  <span className="text-ink-400">Inspected by</span>
                  <span className="text-ink-100">{inspector}</span>
                </li>
              )}
              {inspectedOn && (
                <li className="flex items-center justify-between gap-3 py-1.5">
                  <span className="text-ink-400">Inspection date</span>
                  <span className="text-ink-100">{inspectedOn}</span>
                </li>
              )}
              {lastPriceUpdate && (
                <li className="flex items-center justify-between gap-3 py-1.5">
                  <span className="text-ink-400">Last price update</span>
                  <span className="text-ink-100">{lastPriceUpdate}</span>
                </li>
              )}
            </ul>
            <a
              href="https://www.rera.gov.bh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 border-t border-white/8 bg-white/[0.03] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300 hover:bg-white/[0.05]"
            >
              Verify on RERA <ExternalLink className="h-3 w-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
