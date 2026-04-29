import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../store/useToast'

export default function Toaster() {
  const toasts = useToast((s) => s.toasts)

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto rounded-full border border-gold-500/30 bg-ink-900/95 px-5 py-2.5 text-sm font-medium text-ink-100 shadow-gold-soft backdrop-blur-xl"
          >
            <span className="mr-2 text-gold-500">◆</span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
