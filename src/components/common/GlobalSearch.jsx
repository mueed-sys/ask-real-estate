import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, X, Building2, MapPin, Users, BookOpen, ArrowRight } from 'lucide-react'
import properties from '../../data/properties.json'
import areas from '../../data/areas.json'
import agents from '../../data/agents.json'

// Cmd-K / Ctrl-K global search — opens a centred command palette with
// fuzzy-style filtering across properties, areas, agents, and a static list
// of marketing pages. Results are grouped, keyboard-navigable, and route on
// Enter.
export default function GlobalSearch({ open, onClose }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Static list of pages so the palette covers nav too.
  const pages = [
    { kind: 'page', label: 'Home', to: '/' },
    { kind: 'page', label: 'Properties', to: '/properties' },
    { kind: 'page', label: 'Areas', to: '/areas' },
    { kind: 'page', label: 'Agents', to: '/agents' },
    { kind: 'page', label: 'Blog', to: '/blog' },
    { kind: 'page', label: 'About', to: '/about' },
    { kind: 'page', label: 'Contact', to: '/contact' },
    { kind: 'page', label: 'List Your Property', to: '/list-property' },
    { kind: 'page', label: 'Mortgage Calculator', to: '/tools/mortgage-calculator' },
    { kind: 'page', label: 'Invest', to: '/invest' },
    { kind: 'page', label: 'Private Collection', to: '/private-collection' },
  ]

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) {
      return [
        { group: 'Suggested', icon: Building2, items: pages.slice(0, 4).map((p) => ({ ...p, sub: '' })) },
      ]
    }

    const match = (s) => (s || '').toLowerCase().includes(term)

    const propertyHits = properties
      .filter(
        (p) =>
          match(p.title) ||
          match(p.location) ||
          match(p.address) ||
          match(p.id) ||
          match(p.type)
      )
      .slice(0, 6)
      .map((p) => ({
        kind: 'property',
        label: p.title,
        sub: `${p.location} · ${p.type}`,
        to: `/properties/${p.id}`,
      }))

    const areaHits = areas
      .filter((a) => match(a.name) || match(a.slug) || match(a.tagline))
      .slice(0, 5)
      .map((a) => ({
        kind: 'area',
        label: a.name,
        sub: a.tagline || '',
        to: `/areas/${a.slug}`,
      }))

    const agentHits = agents
      .filter((a) => match(a.name) || match(a.title) || match(a.email))
      .slice(0, 5)
      .map((a) => ({
        kind: 'agent',
        label: a.name,
        sub: a.title,
        to: `/agents/${a.id}`,
      }))

    const pageHits = pages
      .filter((p) => match(p.label))
      .slice(0, 5)
      .map((p) => ({ ...p, sub: '' }))

    const out = []
    if (propertyHits.length) out.push({ group: 'Properties', icon: Building2, items: propertyHits })
    if (areaHits.length)     out.push({ group: 'Areas',      icon: MapPin,    items: areaHits })
    if (agentHits.length)    out.push({ group: 'Agents',     icon: Users,     items: agentHits })
    if (pageHits.length)     out.push({ group: 'Pages',      icon: BookOpen,  items: pageHits })
    return out
  }, [q])

  // Flatten for keyboard navigation
  const flat = useMemo(() => results.flatMap((g) => g.items), [results])

  useEffect(() => {
    if (!open) return
    setQ('')
    setActive(0)
    setTimeout(() => inputRef.current?.focus(), 30)
  }, [open])

  useEffect(() => { setActive(0) }, [q])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, flat.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)) }
      if (e.key === 'Enter')     {
        const target = flat[active]
        if (target) { onClose(); navigate(target.to) }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, flat, active, navigate, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-md"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-ink-elevated shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)]"
            role="dialog"
            aria-label="Search ASK Real Estate"
          >
            <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
              <SearchIcon className="h-4 w-4 text-gold-400" strokeWidth={1.5} />
              <input
                ref={inputRef}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search properties, areas, agents…"
                className="flex-1 bg-transparent text-base text-ink-100 placeholder:text-ink-400 outline-none"
              />
              <kbd className="hidden rounded border border-white/15 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-ink-300 sm:inline">esc</kbd>
              <button onClick={onClose} className="rounded-md p-1 text-ink-300 hover:text-ink-100" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto py-2">
              {results.length === 0 && (
                <p className="px-5 py-10 text-center text-sm text-ink-400">No results for "{q}"</p>
              )}
              {results.map((g) => {
                const Icon = g.icon
                return (
                  <div key={g.group}>
                    <div className="flex items-center gap-2 px-5 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">
                      <Icon className="h-3 w-3" strokeWidth={1.6} /> {g.group}
                    </div>
                    <ul>
                      {g.items.map((it, i) => {
                        const overallIdx = flat.findIndex((f) => f === it)
                        const selected = overallIdx === active
                        return (
                          <li key={`${g.group}-${i}`}>
                            <button
                              type="button"
                              onMouseEnter={() => setActive(overallIdx)}
                              onClick={() => { onClose(); navigate(it.to) }}
                              className={`flex w-full items-center justify-between gap-3 px-5 py-2.5 text-left transition-colors ${
                                selected ? 'bg-gold-500/10 text-gold-200' : 'text-ink-100 hover:bg-white/[0.03]'
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm">{it.label}</p>
                                {it.sub && <p className="truncate text-[11px] text-ink-400">{it.sub}</p>}
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-ink-400" strokeWidth={1.6} />
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>

            <footer className="border-t border-white/8 px-5 py-2 text-[10px] uppercase tracking-[0.22em] text-ink-400">
              <span className="mr-3">↑↓ Navigate</span>
              <span className="mr-3">↵ Open</span>
              <span>esc Close</span>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
