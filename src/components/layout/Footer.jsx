import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, MapPin, Instagram, MessageCircle, ExternalLink } from 'lucide-react'
import { BRAND, CONTACT, OFFICE } from '../../lib/constants'
import { waLink } from '../../lib/whatsapp'

const NAV_GROUPS = [
  {
    titleKey: 'footer.quick_links',
    links: [
      { to: '/properties', key: 'nav.properties' },
      { to: '/areas', key: 'nav.areas' },
      { to: '/agents', key: 'nav.agents' },
      { to: '/blog', key: 'nav.blog' },
      { to: '/about', key: 'nav.about' },
      { to: '/list-property', key: 'nav.list_property' },
      { to: '/tools/mortgage-calculator', label: 'Mortgage Calculator', beta: true },
    ],
  },
]

const HOURS = [
  { dayKey: 'office_hours.sun_wed', timeKey: 'office_hours.sun_wed_time' },
  { dayKey: 'office_hours.thu', timeKey: 'office_hours.thu_time' },
  { dayKey: 'office_hours.fri', timeKey: 'office_hours.fri_time' },
  { dayKey: 'office_hours.sat', timeKey: 'office_hours.sat_time' },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-ink-950">
      {/* Decorative gold horizon line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-40" />

      <div className="container-lux relative grid gap-12 py-20 md:grid-cols-12">
        {/* Brand column */}
        <div className="md:col-span-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ring-1 ring-gold-500/30">
              <img src="/logo.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl tracking-wide text-ink-100">{BRAND.shortName}</span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-gold-500">
                {t('brand.since')}
              </span>
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-300">{t('footer.about_blurb')}</p>

          <div className="mt-6 flex items-center gap-3">
            <a
              href={`https://instagram.com/${CONTACT.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-all hover:border-gold-500/40 hover:text-gold-300"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-all hover:border-gold-500/40 hover:text-gold-300"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-all hover:border-gold-500/40 hover:text-gold-300"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Nav links */}
        {NAV_GROUPS.map((group) => (
          <div key={group.titleKey} className="md:col-span-2">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-widest text-gold-500">
              {t(group.titleKey)}
            </h4>
            <ul className="mt-5 space-y-3">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-2 text-sm text-ink-300 transition-colors hover:text-gold-300"
                  >
                    {link.label || t(link.key)}
                    {link.beta && (
                      <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gold-300">
                        Beta
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div className="md:col-span-3">
          <h4 className="font-sans text-[11px] font-semibold uppercase tracking-widest text-gold-500">
            {t('contact.title')}
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-ink-300">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
              <span>{OFFICE.full}</span>
            </li>
            <li>
              <a href={`tel:${CONTACT.phone}`} className="flex gap-3 transition-colors hover:text-gold-300">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
                <span>{CONTACT.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 transition-colors hover:text-gold-300"
              >
                <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
                <span>{CONTACT.whatsappDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex gap-3 transition-colors hover:text-gold-300"
              >
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
                <span>{CONTACT.email}</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Office hours */}
        <div className="md:col-span-3">
          <h4 className="font-sans text-[11px] font-semibold uppercase tracking-widest text-gold-500">
            {t('contact.hours_label')}
          </h4>
          <ul className="mt-5 space-y-2.5 text-sm">
            {HOURS.map((row) => (
              <li key={row.dayKey} className="flex items-center justify-between gap-4">
                <span className="text-ink-300">{t(row.dayKey)}</span>
                <span className="text-ink-200">{t(row.timeKey)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <a
              href={OFFICE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-gold-500 transition-colors hover:text-gold-300"
            >
              View on Google Maps
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="relative border-t border-white/5 bg-ink-950">
        <div className="container-lux flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} {BRAND.legalName}. {t('footer.rights')}
          </p>
          <p className="text-[11px] uppercase tracking-widest text-ink-400">
            {t('footer.rera')}: {BRAND.rera.join(' · ')}
          </p>
          <p className="max-w-3xl text-xs leading-relaxed text-ink-400">
            {t('footer.credit_before')}
            <a
              href="https://msstech.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-500 transition-colors hover:text-gold-300"
            >
              msstech.ai
            </a>
            {t('footer.credit_after')}
          </p>
        </div>
      </div>
    </footer>
  )
}
