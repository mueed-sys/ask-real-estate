import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// Hairline gold line that draws in from the center when the divider scrolls
// into view. Used to break up the long home page into chapters without adding
// visual weight.
export default function SectionDivider({ className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })

  return (
    <div ref={ref} className={`relative flex items-center justify-center py-10 sm:py-16 ${className}`}>
      <motion.span
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="block h-px w-40 origin-center bg-gradient-to-r from-transparent via-gold-500/60 to-transparent sm:w-80"
        style={{ willChange: 'transform, opacity' }}
      />
      <motion.span
        initial={{ opacity: 0, scale: 0.6 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute text-[10px] tracking-[0.6em] text-gold-500/70"
      >
        ◆
      </motion.span>
    </div>
  )
}
