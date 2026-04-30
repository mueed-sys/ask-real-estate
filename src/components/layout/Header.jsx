import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Menu, X, GitCompare, Heart, ShieldCheck } from 'lucide-react'
import { BRAND } from '../../lib/constants'
import { useFavorites } from '../../store/useFavorites'
import { useComparison } from '../../store/useComparison'

const NAV_LINKS = [
  { to: '/properties', key: 'nav.properties' },
  { to: '/areas', key: 'nav.areas' },
  { to: '/about', key: 'nav.about' },
  { to: '/agents', key: 'nav.agents' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/contact', key: 'nav.contact' },
]

export default function Header() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const favCount = useFavorites((s) => s.ids.length)
  const compareCount = useComparison((s) => s.ids.length)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/5 bg-ink-900/75 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-lux flex h-20 items-center justify-between gap-6">
        {/* Logo + wordmark */}
        <Link to="/" className="group flex items-center gap-3" aria-label={BRAND.shortName}>
          <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-1 ring-gold-500/30 transition-all group-hover:ring-gold-400">
            <img src="/logo.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover" />
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-lg tracking-wide text-ink-100">{BRAND.shortName}</span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-gold-500">
              {t('brand.since')}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                  isActive ? 'text-gold-400' : 'text-ink-200 hover:text-gold-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {t(link.key)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-gold-gradient"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Favorites + Compare quick links (icons) */}
          <Link
            to="/favorites"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink-200 transition-colors hover:text-gold-400 sm:inline-flex"
            aria-label="Favorites"
          >
            <Heart className="h-4.5 w-4.5" strokeWidth={1.5} />
            {favCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-ink-900">
                {favCount}
              </span>
            )}
          </Link>
          <Link
            to="/compare"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink-200 transition-colors hover:text-gold-400 sm:inline-flex"
            aria-label="Compare"
          >
            <GitCompare className="h-4.5 w-4.5" strokeWidth={1.5} />
            {compareCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-ink-900">
                {compareCount}
              </span>
            )}
          </Link>

          {/* Admin entry — subtle gold pill, opens dashboard */}
          <Link
            to="/dashboard"
            className="hidden items-center gap-1.5 rounded-full border border-gold-500/25 bg-gold-500/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gold-400 transition-all hover:border-gold-500/50 hover:bg-gold-500/10 hover:text-gold-300 lg:inline-flex"
            title="Admin dashboard"
          >
            <ShieldCheck className="h-3 w-3" strokeWidth={1.8} />
            Admin
          </Link>

          {/* CTA */}
          <Link to="/list-property" className="btn-gold hidden text-xs lg:inline-flex">
            {t('nav.list_property')}
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((s) => !s)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-100 transition-colors hover:text-gold-400 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden"
          >
            <div className="border-t border-white/5 bg-ink-900/95 backdrop-blur-xl">
              <div className="container-lux flex flex-col gap-1 py-6">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `border-l-2 px-4 py-3 text-base font-medium tracking-wide transition-colors ${
                        isActive
                          ? 'border-gold-500 text-gold-300'
                          : 'border-transparent text-ink-200 hover:border-gold-500/40 hover:text-gold-300'
                      }`
                    }
                  >
                    {t(link.key)}
                  </NavLink>
                ))}
                <Link
                  to="/tools/mortgage-calculator"
                  className="border-l-2 border-transparent px-4 py-3 text-base font-medium tracking-wide text-ink-200 transition-colors hover:border-gold-500/40 hover:text-gold-300"
                >
                  Mortgage Calculator
                  <span className="ml-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gold-300">Beta</span>
                </Link>
                <Link to="/list-property" className="btn-gold mt-4 text-xs">
                  {t('nav.list_property')}
                </Link>
                <Link
                  to="/dashboard"
                  className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-gold-300"
                >
                  <ShieldCheck className="h-3 w-3" /> Admin
                </Link>
                <div className="mt-3 flex items-center gap-3 px-4">
                  <Link to="/favorites" className="btn-ghost">
                    <Heart className="h-4 w-4" /> {t('nav.favorites')} ({favCount})
                  </Link>
                  <Link to="/compare" className="btn-ghost">
                    <GitCompare className="h-4 w-4" /> {t('nav.compare')} ({compareCount})
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
