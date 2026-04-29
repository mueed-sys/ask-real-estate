import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

// Count-up number animator that fires once when scrolled into view.
// Format prop allows callers to wrap the rendered number ("4,000+", "$24K", etc.)
export default function CountUp({ to = 100, duration = 1600, format = (n) => n.toLocaleString() }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * to))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  return <span ref={ref}>{format(value)}</span>
}
