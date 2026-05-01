import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, Crown, Mail, Phone } from 'lucide-react'

import properties from '../data/properties.json'
import PropertyCard from '../components/property/PropertyCard'
import Reveal from '../components/common/Reveal'
import SectionHeader from '../components/common/SectionHeader'
import { useToast } from '../store/useToast'
import { BRAND, SITE_URL } from '../lib/constants'

const STORAGE_KEY = 'ire.private-collection.unlocked'

// Curate the 5-10 most premium listings as the "private collection". We pick
// any sale property over BD 500k and any rental over BD 1500/mo, sorted by
// price desc, and pad with featured listings if we're under 5.
function pickPremium() {
  const top = properties.filter(
    (p) => (p.purpose === 'sale' && p.price >= 500_000) || (p.purpose === 'rent' && p.price >= 1500)
  )
  const featured = properties.filter((p) => p.featured && !top.includes(p))
  const merged = [...top, ...featured].slice(0, 8)
  return merged.sort((a, b) => b.price - a.price)
}

export default function PrivateCollection() {
  const [unlocked, setUnlocked] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const pushToast = useToast((s) => s.push)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(STORAGE_KEY) === '1') setUnlocked(true)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      pushToast('All three fields are required', { type: 'error' })
      return
    }
    if (!form.email.includes('@')) {
      pushToast('Enter a valid email', { type: 'error' })
      return
    }
    // Persist so the visitor doesn't re-gate next visit
    window.localStorage.setItem(STORAGE_KEY, '1')
    setUnlocked(true)
    pushToast('Welcome to the Private Collection')
  }

  const listings = pickPremium()

  return (
    <>
      <Helmet>
        <title>Private Collection — {BRAND.shortName}</title>
        <meta name="description" content="Off-market and ultra-premium residences. Access by request only." />
        <link rel="canonical" href={`${SITE_URL}/private-collection`} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-30" />
        <div className="container-lux relative pb-section pt-24 lg:pt-32">
          {!unlocked ? (
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
              <Reveal>
                <span className="eyebrow eyebrow-gold">
                  <Lock className="h-3 w-3" /> ACCESS BY REQUEST
                </span>
                <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                  <span className="block text-ink-100">The Private</span>
                  <span className="block text-gold-gradient">Collection</span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-[1.8] text-ink-200">
                  A small selection of off-market residences — penthouses, waterfront villas, and full
                  floor units that we do not list publicly. Brief details below; full dossiers shared on
                  request.
                </p>

                <ul className="mt-8 grid gap-3 text-sm text-ink-200 sm:grid-cols-2">
                  <Bullet>{listings.length} curated residences</Bullet>
                  <Bullet>BD 500K+ sale · BD 1,500+/mo rent</Bullet>
                  <Bullet>RERA verified by IRE consultants</Bullet>
                  <Bullet>No public listings or photos online</Bullet>
                </ul>
              </Reveal>

              <Reveal delay={0.15}>
                <form
                  onSubmit={handleSubmit}
                  className="card-lux p-6 sm:p-8"
                >
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-300" /> Confidential request
                  </div>
                  <p className="mt-3 text-sm text-ink-200">
                    Provide your details to view the collection. We never share or publish your information.
                  </p>

                  <div className="mt-6 space-y-3">
                    <Field label="Full name" icon={Crown}>
                      <input
                        type="text"
                        autoComplete="name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-ink-100 outline-none focus:border-gold-500/40"
                      />
                    </Field>
                    <Field label="Email" icon={Mail}>
                      <input
                        type="email"
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-ink-100 outline-none focus:border-gold-500/40"
                      />
                    </Field>
                    <Field label="Phone" icon={Phone}>
                      <input
                        type="tel"
                        autoComplete="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+973 …"
                        className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-ink-100 outline-none focus:border-gold-500/40"
                      />
                    </Field>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold-gradient text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-900 shadow-[0_8px_22px_-8px_rgba(212,175,55,0.55)]"
                  >
                    <Lock className="h-3.5 w-3.5" /> Reveal the collection
                  </button>
                  <p className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-ivory-400">
                    By submitting you agree to be contacted by an IRE consultant.
                  </p>
                </form>
              </Reveal>
            </div>
          ) : (
            <div>
              <Reveal>
                <span className="eyebrow eyebrow-gold">
                  <Crown className="h-3 w-3" /> ACCESS GRANTED
                </span>
                <h1 className="mt-5 font-display text-4xl leading-[1.05] text-ink-100 md:text-5xl">
                  Welcome to the Private Collection
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-ink-300">
                  The {listings.length} residences below are off-market. Contact your consultant for full
                  dossiers, viewing arrangements, and provenance.
                </p>
              </Reveal>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-12 grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-3"
              >
                {listings.map((p, i) => (
                  <Reveal key={p.id} delay={i * 0.06} className="h-full">
                    <PropertyCard property={p} />
                  </Reveal>
                ))}
              </motion.div>

              <div className="mt-16 text-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-900"
                >
                  Request full dossier →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <p className="mb-1.5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">
        <Icon className="h-3 w-3" /> {label}
      </p>
      {children}
    </label>
  )
}

function Bullet({ children }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
      <span>{children}</span>
    </li>
  )
}
