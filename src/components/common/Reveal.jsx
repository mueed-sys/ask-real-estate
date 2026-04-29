import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// Lightweight scroll-reveal wrapper. Use for any block that should animate in
// when it enters the viewport. `delay` staggers child reveals.
export default function Reveal({ children, delay = 0, y = 24, className = '', once = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-80px 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
