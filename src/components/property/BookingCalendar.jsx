import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useToast } from '../../store/useToast'

// Mock availability: a Calendly-tier inline calendar. Slot generation is
// deterministic — same agent + same date always yields the same slots so
// repeat visits feel consistent.
function slotsFor(agent, dateISO) {
  const seed = (agent?.id || 'A').charCodeAt(0) + dateISO.charCodeAt(8) + dateISO.charCodeAt(9)
  // Agent status: Active = many slots, Away = few, Off = none
  const status = (agent?.status || 'Active').toLowerCase()
  if (status === 'off') return []
  const base = ['09:30', '10:00', '11:00', '11:30', '14:00', '14:30', '15:30', '16:00', '17:00']
  const rand = (i) => Math.abs(Math.sin(seed + i * 17)) % 1
  return base.filter((_, i) => rand(i) > (status === 'away' ? 0.65 : 0.35))
}

function startOfWeek(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const day = (x.getDay() + 6) % 7 // Mon=0
  x.setDate(x.getDate() - day)
  return x
}

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

function dayLabel(d) {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function BookingCalendar({ agent, property }) {
  const pushToast = useToast((s) => s.push)
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [selected, setSelected] = useState(null) // { date, slot }
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [confirmed, setConfirmed] = useState(null)

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart); d.setDate(d.getDate() + i); return d
    }),
    [weekStart]
  )

  const handleBook = (e) => {
    e.preventDefault()
    if (!selected) return
    if (!form.name || !form.phone || !form.email) {
      pushToast('Name, phone and email required', { type: 'error' })
      return
    }
    setConfirmed({ ...selected, ...form })
  }

  if (confirmed) {
    return (
      <section className="card-lux p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-8 w-8 flex-shrink-0 text-success-300" strokeWidth={1.6} />
          <div>
            <h3 className="font-display text-xl text-ink-100">Viewing confirmed</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-200">
              We've booked your viewing for <strong className="text-gold-200">{dayLabel(new Date(confirmed.date))}</strong> at{' '}
              <strong className="text-gold-200">{confirmed.slot}</strong> with{' '}
              <strong>{agent?.name || 'an IRE consultant'}</strong>. You'll receive a WhatsApp confirmation at <strong>{confirmed.phone}</strong>.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const todayIso = new Date().toISOString().slice(0, 10)
  const slots = selected ? slotsFor(agent, selected.date) : []

  return (
    <section aria-labelledby="booking-title" className="card-lux overflow-hidden">
      <header className="flex items-center justify-between border-b border-white/8 bg-white/[0.02] px-5 py-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gold-300" strokeWidth={1.6} />
          <h2 id="booking-title" className="font-display text-lg text-ink-100">Schedule a Viewing</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous week"
            onClick={() => setWeekStart((s) => { const d = new Date(s); d.setDate(d.getDate() - 7); return d })}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-300 hover:bg-white/[0.04] hover:text-gold-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next week"
            onClick={() => setWeekStart((s) => { const d = new Date(s); d.setDate(d.getDate() + 7); return d })}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-300 hover:bg-white/[0.04] hover:text-gold-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Day strip */}
      <div className="grid grid-cols-7 gap-1 px-3 py-3">
        {days.map((d) => {
          const iso = isoDate(d)
          const past = iso < todayIso
          const active = selected?.date === iso
          return (
            <button
              key={iso}
              type="button"
              disabled={past}
              onClick={() => setSelected({ date: iso, slot: null })}
              className={`flex flex-col items-center gap-0.5 rounded-md py-2 text-center transition-colors ${
                past
                  ? 'cursor-not-allowed text-ink-500'
                  : active
                    ? 'bg-gold-gradient text-ink-900'
                    : 'text-ink-200 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-[9px] font-semibold uppercase tracking-[0.22em]">
                {d.toLocaleDateString('en-GB', { weekday: 'short' })}
              </span>
              <span className="font-numbers text-base font-bold">{d.getDate()}</span>
            </button>
          )
        })}
      </div>

      {/* Slots */}
      <div className="border-t border-white/5 px-5 py-4">
        {!selected && (
          <p className="text-center text-sm text-ink-400">Pick a day to see available times.</p>
        )}
        {selected && slots.length === 0 && (
          <p className="text-center text-sm text-ink-400">{agent?.name || 'Agent'} has no openings this day.</p>
        )}
        {selected && slots.length > 0 && (
          <>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory-300">
              <Clock className="mr-1 inline h-3 w-3" /> Available with {agent?.name?.split(' ')[0] || 'agent'} · {dayLabel(new Date(selected.date))}
            </p>
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelected((sel) => ({ ...sel, slot: s }))}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
                    selected.slot === s
                      ? 'border-gold-500 bg-gold-500/15 text-gold-200'
                      : 'border-white/10 text-ink-200 hover:border-gold-500/40'
                  }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Form */}
      {selected?.slot && (
        <form onSubmit={handleBook} className="space-y-2.5 border-t border-white/8 bg-white/[0.02] p-5">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-ink-100 outline-none focus:border-gold-500/40"
            />
            <input
              type="tel"
              required
              placeholder="Phone (+973…)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-ink-100 outline-none focus:border-gold-500/40"
            />
          </div>
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-ink-100 outline-none focus:border-gold-500/40"
          />
          <button
            type="submit"
            className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gold-gradient text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-900 shadow-[0_8px_22px_-8px_rgba(212,175,55,0.55)]"
          >
            Book viewing · {selected.slot}
          </button>
        </form>
      )}
    </section>
  )
}
