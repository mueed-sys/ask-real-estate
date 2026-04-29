// Helpers shared across dashboard pages — chart theme, mock time-series,
// status palettes, source icon mapping. All deterministic so the demo looks
// the same on every reload.

import {
  MessageCircle, Globe, Instagram, Phone,
} from 'lucide-react'

// Recharts theme tokens (matches the dashboard dark palette + gold accent)
export const CHART_COLORS = {
  axis: 'rgba(230, 231, 240, 0.35)',
  grid: 'rgba(255, 255, 255, 0.04)',
  tooltipBg: '#0d0f1c',
  gold: '#d4af37',
  goldLight: '#f4d03f',
  ink: '#e6e7f0',
  ink400: 'rgba(157, 162, 189, 0.9)',
  series: ['#d4af37', '#60a5fa', '#a78bfa', '#22c55e', '#f97316', '#ef4444'],
}

// Status pill palette for leads / properties / docs.
export const STATUS_STYLE = {
  new:           { bg: 'bg-blue-500/10',    text: 'text-blue-300',    ring: 'ring-blue-500/30',    label: 'New' },
  contacted:     { bg: 'bg-yellow-500/10',  text: 'text-yellow-300',  ring: 'ring-yellow-500/30',  label: 'Contacted' },
  viewing:       { bg: 'bg-orange-500/10',  text: 'text-orange-300',  ring: 'ring-orange-500/30',  label: 'Viewing' },
  negotiating:   { bg: 'bg-purple-500/10',  text: 'text-purple-300',  ring: 'ring-purple-500/30',  label: 'Negotiating' },
  closed:        { bg: 'bg-emerald-500/10', text: 'text-emerald-300', ring: 'ring-emerald-500/30', label: 'Closed' },
  // property statuses
  active:        { bg: 'bg-emerald-500/10', text: 'text-emerald-300', ring: 'ring-emerald-500/30', label: 'Active' },
  pending:       { bg: 'bg-yellow-500/10',  text: 'text-yellow-300',  ring: 'ring-yellow-500/30',  label: 'Pending' },
  rented:        { bg: 'bg-blue-500/10',    text: 'text-blue-300',    ring: 'ring-blue-500/30',    label: 'Rented' },
  inactive:      { bg: 'bg-ink-700/40',     text: 'text-ink-300',     ring: 'ring-ink-700/30',     label: 'Inactive' },
  // document statuses
  Draft:         { bg: 'bg-ink-700/40',     text: 'text-ink-300',     ring: 'ring-ink-700/30',     label: 'Draft' },
  Sent:          { bg: 'bg-blue-500/10',    text: 'text-blue-300',    ring: 'ring-blue-500/30',    label: 'Sent' },
  Signed:        { bg: 'bg-emerald-500/10', text: 'text-emerald-300', ring: 'ring-emerald-500/30', label: 'Signed' },
}

export const SOURCE_META = {
  whatsapp:  { icon: MessageCircle, label: 'WhatsApp',  color: 'text-emerald-400' },
  website:   { icon: Globe,         label: 'Website',   color: 'text-blue-400' },
  instagram: { icon: Instagram,     label: 'Instagram', color: 'text-pink-400' },
  phone:     { icon: Phone,         label: 'Phone',     color: 'text-yellow-400' },
}

// Deterministic seeded random so charts stay stable across reloads.
function seeded(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// Generate a 30-day daily series with a clear upward trend (low → high).
// Used by Overview's "Inquiries Over Time" chart.
export function inquiriesLast30Days(seed = 42) {
  const rand = seeded(seed)
  const out = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const trend = 30 + ((29 - i) * 1.6)
    const noise = rand() * 18 - 9
    out.push({
      date: d.toISOString().slice(5, 10), // MM-DD
      inquiries: Math.max(20, Math.round(trend + noise)),
    })
  }
  return out
}

// 90-day visitor series for Analytics page.
export function visitorsLastNDays(days = 90, seed = 7) {
  const rand = seeded(seed)
  const out = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const trend = 320 + ((days - i) * 1.2)
    const noise = rand() * 80 - 40
    const weekend = d.getDay() === 5 ? -60 : 0  // Friday dip in Bahrain
    out.push({
      date: d.toISOString().slice(5, 10),
      visitors: Math.max(150, Math.round(trend + noise + weekend)),
    })
  }
  return out
}

// 12-month trend lines per area for Market Intelligence page.
export function priceTrends12mo() {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
  const start = { Juffair: 440, Seef: 410, Amwaj: 1020, Riffa: 540 }
  const drift = { Juffair: 0.7, Seef: 0.4, Amwaj: 1.4, Riffa: 0.5 }
  const rand = seeded(99)
  return months.map((m, i) => ({
    month: m,
    Juffair: Math.round(start.Juffair + i * drift.Juffair * 6 + (rand() * 12 - 6)),
    Seef: Math.round(start.Seef + i * drift.Seef * 6 + (rand() * 10 - 5)),
    Amwaj: Math.round(start.Amwaj + i * drift.Amwaj * 6 + (rand() * 18 - 9)),
    Riffa: Math.round(start.Riffa + i * drift.Riffa * 6 + (rand() * 14 - 7)),
  }))
}

// 7-day x 24-hour grid for the Analytics peak-hours heatmap.
export function peakHoursGrid() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const rand = seeded(12)
  return days.map((day, di) => ({
    day,
    cells: Array.from({ length: 24 }, (_, hr) => {
      // baseline by working hours, dip late night, dip Friday
      let v = 5
      if (hr >= 9 && hr <= 21) v = 35
      if (hr >= 18 && hr <= 21) v = 65
      if (di === 5) v = Math.round(v * 0.55)  // Friday in Bahrain
      v = Math.round(v + rand() * 25 - 8)
      return Math.max(2, Math.min(100, v))
    }),
  }))
}

// 6-month deals-closed history for an agent profile chart.
export function agentDealsHistory(baseline = 6, seed = 1) {
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
  const rand = seeded(seed)
  return months.map((m, i) => ({
    month: m,
    deals: Math.max(1, Math.round(baseline + (rand() * 6 - 2) + i * 0.3)),
  }))
}
