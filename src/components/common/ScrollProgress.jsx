import { motion, useScroll, useSpring } from 'framer-motion'

// Razor-thin gold line at the very top that tracks scroll progress across the
// document. Springs into place so it never feels jittery during fast scrolls.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.4,
  })

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-gold-700 via-gold-400 to-gold-300"
      aria-hidden="true"
    />
  )
}
