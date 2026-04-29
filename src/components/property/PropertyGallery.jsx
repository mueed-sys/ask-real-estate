import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'

export default function PropertyGallery({ images = [], title = '' }) {
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length])
  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length])

  // Keyboard nav inside lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, next, prev])

  if (!images.length) return null

  return (
    <>
      <div className="grid gap-3">
        {/* Hero image */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="relative aspect-[16/9] overflow-hidden bg-ink-800"
          aria-label="Open photo gallery"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={images[active]}
              alt={`${title} — image ${active + 1}`}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/40 to-transparent" />
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink-900/70 px-3 py-1.5 text-[11px] uppercase tracking-widest text-ink-100 backdrop-blur-sm">
            <Maximize2 className="h-3 w-3" /> {active + 1} / {images.length}
          </span>
        </button>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative aspect-square overflow-hidden transition-all ${
                  i === active ? 'ring-1 ring-gold-500' : 'opacity-70 hover:opacity-100'
                }`}
                aria-label={`Show image ${i + 1}`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-md"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-200 transition-colors hover:border-gold-500/40 hover:text-gold-300"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <button
              className="absolute left-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-ink-200 transition-colors hover:border-gold-500/40 hover:text-gold-300"
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <motion.img
              key={active}
              src={images[active]}
              alt={`${title} — image ${active + 1}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[88vh] max-w-[88vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute right-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-ink-200 transition-colors hover:border-gold-500/40 hover:text-gold-300"
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-ink-900/70 px-4 py-1.5 text-[11px] uppercase tracking-widest text-ink-100 backdrop-blur-sm">
              {active + 1} / {images.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
