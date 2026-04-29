import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GitCompare, X } from 'lucide-react'
import { useComparison } from '../../store/useComparison'

// Floating bar at the bottom of every page when 1+ properties are selected
// for comparison. Hidden on the /compare page itself.
export default function CompareBar({ hidden }) {
  const { t } = useTranslation()
  const ids = useComparison((s) => s.ids)
  const clear = useComparison((s) => s.clear)
  const count = ids.length

  return (
    <AnimatePresence>
      {!hidden && count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-4 bottom-4 z-30 mx-auto max-w-md md:left-1/2 md:right-auto md:bottom-6 md:-translate-x-1/2"
        >
          <div className="glass-strong flex items-center gap-3 rounded-full px-5 py-3 shadow-gold-soft">
            <GitCompare className="h-4 w-4 flex-shrink-0 text-gold-500" />
            <span className="flex-1 text-xs font-medium tracking-wide text-ink-100 sm:text-sm">
              {t(count === 1 ? 'compare.selected_one' : 'compare.selected_other', { count })}
            </span>
            <Link
              to="/compare"
              className="inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-1.5 text-xs font-semibold tracking-wide text-ink-900 transition-transform hover:scale-105"
            >
              {t('compare.compare_now')}
            </Link>
            <button
              onClick={clear}
              className="text-ink-300 transition-colors hover:text-gold-400"
              aria-label="Clear comparison"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
