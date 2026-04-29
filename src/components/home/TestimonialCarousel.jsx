import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import testimonials from '../../data/testimonials.json'
import { localized } from '../../lib/format'

export default function TestimonialCarousel() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const t = testimonials[active]

  return (
    <div className="relative">
      <Quote className="absolute -top-2 left-0 h-16 w-16 text-gold-500/15" />

      <div className="relative min-h-[260px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 px-2"
          >
            <div className="mb-5 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < t.rating ? 'fill-gold-500 text-gold-500' : 'text-ink-600'}`}
                />
              ))}
            </div>

            <p className="font-display text-2xl leading-snug text-ink-100 md:text-3xl">
              "{localized(t, 'quote', lang)}"
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" />
              <div className="text-end">
                <p className="font-display text-lg text-ink-100">{localized(t, 'name', lang)}</p>
                <p className="text-[11px] uppercase tracking-widest text-gold-500">{localized(t, 'role', lang)}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setActive((i) => (i - 1 + testimonials.length) % testimonials.length)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-gold-500/40 hover:text-gold-300"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-1 transition-all duration-500 ${
                i === active ? 'w-10 bg-gold-gradient' : 'w-3 bg-ink-600 hover:bg-ink-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setActive((i) => (i + 1) % testimonials.length)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-gold-500/40 hover:text-gold-300"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
