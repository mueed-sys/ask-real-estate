import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Menu, X, Heart, Search as SearchIcon, Lock } from 'lucide-react'
import { BRAND } from '../../lib/constants'
import { useFavorites } from '../../store/useFavorites'
import CurrencyToggle from '../common/CurrencyToggle'
import GlobalSearch from '../common/GlobalSearch'

const NAV_LINKS = [
  { to: '/properties',         key: 'nav.properties' },
  { to: '/areas',              key: 'nav.areas' },
  { to: '/invest',             label: 'Invest' },
  { to: '/private-collection', label: 'Private', icon: Lock },
  { to: '/about',              key: 'nav.about' },
  { to: '/agents',             key: 'nav.agents' },
  { to: '/blog',               key: 'nav.blog' },
  { to: '/contact',            key: 'nav.contact' },
]

export default function Header() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const favCount = useFavorites((s) => s.ids.length)

  // Shrink header on scroll: 72px → 56px with smooth transition.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change.
  useEffect(() => { setOpen(false) }, [location.pathname])

  // Cmd-K / Ctrl-K opens global search; Ctrl+Shift+A jumps to admin.
  useEffect(() => {
    const onKey = (e) => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key.toLowerCase() === 'k' && !e.shiftKey) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        navigate('/dashboard')
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navigate])

  const visibleLinks = NAV_LINKS

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>

      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-out ${
          scrolled
            ? 'h-14 border-b border-white/8 bg-ink-bg/85 backdrop-blur-xl'
            : 'h-[72px] border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-wide flex h-full items-center justify-between gap-4">
          {/* Logo + wordmark */}
          <Link to="/" className="group flex items-center gap-3" aria-label={BRAND.shortName}>
            <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-gold-500/30 transition-all group-hover:ring-gold-400">
              <img src="/logo.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover" />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-base tracking-tight text-ink-100">{BRAND.shortName}</span>
              <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.22em] text-ivory-300">
                {t('brand.since')}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {visibleLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                      isActive ? 'text-gold-300' : 'text-ink-200 hover:text-ink-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {Icon && <Icon className="h-3 w-3" strokeWidth={1.5} />}
                      {link.label || t(link.key)}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3 -bottom-0.5 h-px bg-gold-gradient"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cmd-K search trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-ink-300 transition-colors hover:border-gold-500/40 hover:text-gold-300 sm:inline-flex"
              aria-label="Search"
              title="Search (⌘K)"
            >
              <SearchIcon className="h-3.5 w-3.5" strokeWidth={1.6} />
              <kbd className="hidden rounded border border-white/15 bg-white/[0.04] px-1.5 py-0 text-[10px] font-medium md:inline">⌘K</kbd>
            </button>
            {/* mobile-only search icon */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-200 transition-colors hover:text-gold-300 sm:hidden"
              aria-label="Search"
            >
              <SearchIcon className="h-4 w-4" strokeWidth={1.6} />
            </button>

            <CurrencyToggle className="hidden sm:inline-flex" />

            <Link
              to="/favorites"
              className="relative hidden h-9 w-9 items-center justify-center rounded-full text-ink-200 transition-colors hover:text-gold-300 sm:inline-flex"
              aria-label="Favorites"
              title="Saved properties"
            >
              <Heart className="h-4 w-4" strokeWidth={1.5} />
              {favCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-ink-900">
                  {favCount}
                </span>
              )}
            </Link>

            {/* Primary CTA — gold pill aligned to nav baseline */}
            <Link
              to="/list-property"
              className="hidden h-9 items-center justify-center rounded-full bg-gold-gradient px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-900 shadow-[0_8px_22px_-8px_rgba(212,175,55,0.55)] transition-all hover:shadow-[0_14px_28px_-6px_rgba(212,175,55,0.7)] lg:inline-flex"
            >
              {t('nav.list_property')}
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen((s) => !s)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-100 transition-colors hover:text-gold-300 lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile menu — editorial serif headers + currency + search */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden"
            >
              <div className="border-t border-white/8 bg-ink-bg/97 backdrop-blur-xl">
                <div className="container-lux flex flex-col gap-1 py-6">
                  <button
                    onClick={() => { setOpen(false); setSearchOpen(true) }}
                    className="mb-3 flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-ink-300 hover:border-gold-500/40"
                  >
                    <SearchIcon className="h-4 w-4 text-gold-400" strokeWidth={1.6} />
                    Search properties, areas, agents…
                  </button>

                  {visibleLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                          `flex items-center gap-2 border-l-2 px-4 py-3 font-display text-2xl tracking-tight transition-colors ${
                            isActive ? 'border-gold-500 text-gold-200' : 'border-transparent text-ink-100 hover:border-gold-500/40 hover:text-gold-200'
                          }`
                        }
                      >
                        {Icon && <Icon className="h-4 w-4 text-ink-300" strokeWidth={1.5} />}
                        {link.label || t(link.key)}
                      </NavLink>
                    )
                  })}

                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/8 px-4 pt-4">
                    <CurrencyToggle />
                    <Link to="/favorites" className="text-xs uppercase tracking-[0.22em] text-ink-300 hover:text-gold-300">
                      Favorites · {favCount}
                    </Link>
                  </div>

                  <Link
                    to="/list-property"
                    className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-gold-gradient text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-900"
                  >
                    {t('nav.list_property')}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
