import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, X } from 'lucide-react'

const KEY = 'ire.dashboardMobileNoticeDismissed'

// One-time mobile notice that surfaces when an admin opens the dashboard on a
// phone. Tells them desktop is the canonical experience while reassuring them
// the mobile version works for quick checks. Dismiss persists in localStorage.
export default function MobileNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(KEY) === '1') return
    if (window.matchMedia('(max-width: 1023px)').matches) {
      // small delay so it animates in after the page settles
      const t = setTimeout(() => setShow(true), 400)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = () => {
    setShow(false)
    if (typeof window !== 'undefined') localStorage.setItem(KEY, '1')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-50 rounded-md border border-gold-500/30 bg-[#0a0c18]/95 p-4 shadow-2xl backdrop-blur-xl lg:hidden"
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-gold-500/30 bg-gold-500/10 text-gold-400">
              <Monitor className="h-4 w-4" strokeWidth={1.6} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-500">Heads up</p>
              <p className="mt-1 text-sm leading-snug text-ink-100">
                The dashboard is designed primarily for desktop. This mobile view is
                streamlined for quick checks — open on a laptop for the full experience.
              </p>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="-m-1 flex-shrink-0 rounded p-1 text-ink-300 hover:text-gold-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={dismiss}
            className="mt-3 inline-flex w-full items-center justify-center rounded border border-white/10 py-2 text-[11px] font-semibold uppercase tracking-widest text-ink-200 hover:border-gold-500/40 hover:text-gold-300"
          >
            Got it
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
