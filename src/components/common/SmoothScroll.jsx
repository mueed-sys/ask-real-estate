import { useEffect } from 'react'
import Lenis from 'lenis'

// Buttery-smooth scroll across the entire site. Disabled when the OS reports
// reduced-motion preference so we never override accessibility settings.
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      // Leave touch on its native default — only smooth wheel/trackpad scrolling
      // so mobile drag/scroll behavior stays untouched.
    })

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return null
}
