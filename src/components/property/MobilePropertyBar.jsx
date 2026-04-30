import { Phone, MessageCircle, Calendar } from 'lucide-react'
import { waLink } from '../../lib/whatsapp'

// Sticky bottom action bar for mobile property pages. Three persistent
// actions: WhatsApp, Call, Schedule Viewing. Hidden on lg+ where the right
// rail's sticky agent card serves the same purpose.
export default function MobilePropertyBar({ agent, property, onSchedule }) {
  if (!agent) return null
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-bg/95 px-3 py-2.5 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center gap-2">
        <a
          href={`tel:${agent.phone}`}
          className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] text-xs font-semibold uppercase tracking-[0.18em] text-ink-200"
          aria-label={`Call ${agent.name}`}
        >
          <Phone className="h-3.5 w-3.5" /> Call
        </a>
        <a
          href={waLink({ property })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#25D366] text-xs font-semibold uppercase tracking-[0.18em] text-white"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
        </a>
        <button
          onClick={onSchedule}
          className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-gold-gradient text-xs font-semibold uppercase tracking-[0.18em] text-ink-900"
          aria-label="Schedule viewing"
        >
          <Calendar className="h-3.5 w-3.5" /> Book
        </button>
      </div>
    </div>
  )
}
