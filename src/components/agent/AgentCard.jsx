import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Phone, MessageCircle, Star, ArrowUpRight } from 'lucide-react'
import { waLink } from '../../lib/whatsapp'
import { localized } from '../../lib/format'

export default function AgentCard({ agent, variant = 'card' }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const name = localized(agent, 'name', lang)
  const title = localized(agent, 'title', lang)

  if (variant === 'compact') {
    return (
      <Link
        to={`/agents/${agent.id}`}
        className="card-lux group flex items-center gap-4 p-4"
      >
        <img
          src={agent.photo}
          alt={name}
          loading="lazy"
          className="h-14 w-14 flex-shrink-0 rounded-full object-cover ring-1 ring-gold-500/20"
        />
        <div className="flex-1">
          <p className="font-display text-lg leading-tight text-ink-100">{name}</p>
          <p className="text-xs uppercase tracking-widest text-gold-500">{title}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-ink-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-400" />
      </Link>
    )
  }

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.4 }}>
      <Link to={`/agents/${agent.id}`} className="card-lux flex h-full flex-col items-center px-6 pb-6 pt-8 text-center">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gold-gradient opacity-0 blur-md transition-opacity group-hover:opacity-30" />
          <img
            src={agent.photo}
            alt={name}
            loading="lazy"
            className="relative h-28 w-28 rounded-full object-cover ring-1 ring-gold-500/30"
          />
        </div>
        <h3 className="mt-5 font-display text-2xl leading-tight text-ink-100">{name}</h3>
        <p className="mt-1.5 text-[11px] uppercase tracking-widest text-gold-500">{title}</p>

        <div className="mt-3 inline-flex items-center gap-1 text-xs text-ink-300">
          <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
          <span className="font-medium text-ink-100">{agent.rating.toFixed(1)}</span>
          <span>·</span>
          <span>{agent.active_listings} listings</span>
        </div>

        <div className="my-5 h-px w-12 bg-gold-gradient opacity-50" />

        {/* Specializations */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {agent.specializations.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-widest text-ink-300"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Languages */}
        <div className="mt-4 flex items-center gap-2">
          {agent.languages.map((l) => (
            <span key={l.code} title={l.label} className="text-base">
              {l.flag}
            </span>
          ))}
        </div>

        {/* Quick contact */}
        <div className="mt-6 flex w-full items-center gap-2">
          <a
            href={waLink({ agent })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gold-gradient py-2 text-xs font-semibold tracking-wide text-ink-900 transition-transform hover:scale-105"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {t('common.send_whatsapp')}
          </a>
          <a
            href={`tel:${agent.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-gold-500/40 hover:text-gold-300"
            aria-label={`Call ${name}`}
          >
            <Phone className="h-3.5 w-3.5" />
          </a>
        </div>
      </Link>
    </motion.div>
  )
}
