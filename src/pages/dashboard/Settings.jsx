import { useState } from 'react'
import {
  Plus, Trash2, MoreVertical, CreditCard, Download, FileText, CheckCircle2, Globe,
} from 'lucide-react'
import Panel from '../../components/dashboard/Panel'
import { useToast } from '../../store/useToast'
import { BRAND, CONTACT, OFFICE, SITE_URL } from '../../lib/constants'
import agents from '../../data/agents.json'

export default function Settings() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <CompanyProfile />
      <TeamManagement />
      <NotificationPrefs />
      <Integrations />
      <SiteSettings />
      <Billing />
    </div>
  )
}

/* ============================ COMPANY PROFILE ============================ */
function CompanyProfile() {
  const pushToast = useToast((s) => s.push)
  const displayDomain = SITE_URL.replace(/^https?:\/\//, '')
  const defaults = {
    name: BRAND.legalName, address: OFFICE.full, phone: CONTACT.phoneDisplay,
    email: CONTACT.email, rera: BRAND.rera.join(' · '), website: displayDomain,
  }
  const [form, setForm] = useState(() => {
    try { const s = localStorage.getItem('dash_company_profile'); return s ? JSON.parse(s) : defaults }
    catch { return defaults }
  })
  return (
    <Panel title="Company Profile" subtitle="Public-facing details across the website">
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center gap-3 lg:items-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-500">Logo</p>
          <div className="flex flex-col items-center gap-2.5">
            <span className="relative inline-flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ring-1 ring-gold-500/30 sm:h-28 sm:w-28">
              <img src="/logo.jpg" alt="" className="h-full w-full object-cover" />
            </span>
            <button className="rounded border border-white/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-200 transition-colors hover:border-gold-500/40 hover:text-gold-300">
              Replace logo
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <Field label="Legal Name">
            <Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          </Field>
          <Field label="Office Address">
            <Textarea value={form.address} onChange={(v) => setForm({ ...form, address: v })} rows={2} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone">
              <Input value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            </Field>
            <Field label="Email">
              <Input value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
            <Field label="RERA Numbers">
              <Input value={form.rera} onChange={(v) => setForm({ ...form, rera: v })} />
            </Field>
            <Field label="Website">
              <Input value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                localStorage.setItem('dash_company_profile', JSON.stringify(form))
                pushToast('Company profile saved')
              }}
              className="btn-gold text-xs"
            >
              Save changes
            </button>
            <button
              onClick={() => {
                try { const s = localStorage.getItem('dash_company_profile'); if (s) setForm(JSON.parse(s)) }
                catch { setForm(defaults) }
                pushToast('Reverted unsaved changes')
              }}
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-300 hover:text-gold-300"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </Panel>
  )
}

/* ============================ TEAM MANAGEMENT ============================ */
function TeamManagement() {
  const pushToast = useToast((s) => s.push)
  return (
    <Panel
      title="Team Management"
      subtitle={`${agents.length} agents`}
      action={
        <button
          onClick={() => pushToast('Invite agent — coming soon')}
          className="inline-flex items-center gap-1.5 rounded-md border border-gold-500/30 bg-gold-500/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300 transition-colors hover:bg-gold-500/10"
        >
          <Plus className="h-3.5 w-3.5" /> Invite Agent
        </button>
      }
      noPadding
    >
      <ul className="divide-y divide-white/5">
        {agents.map((a) => (
          <li
            key={a.id}
            className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:gap-4 sm:px-5 sm:py-4"
          >
            <img
              src={a.photo}
              alt=""
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover ring-1 ring-gold-500/30"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-ink-100">{a.name}</p>
              <p className="truncate text-[10px] font-medium uppercase tracking-[0.22em] text-gold-500">
                {a.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-ink-400 sm:hidden">{a.email}</p>
            </div>
            <span className="hidden truncate text-xs text-ink-300 sm:block">{a.email}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => pushToast('Edit member')}
                className="rounded px-2 py-1 text-xs font-medium text-ink-300 transition-colors hover:bg-white/5 hover:text-gold-300"
              >
                Edit
              </button>
              <button
                onClick={() => pushToast(`Removed ${a.name}`, { type: 'error' })}
                className="rounded p-1.5 text-ink-300 transition-colors hover:bg-white/5 hover:text-red-400"
                aria-label={`Remove ${a.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

/* ============================ NOTIFICATIONS ============================ */
const NOTIF_DEFAULTS = { new_inquiry: true, daily_summary: true, weekly_report: true, competitor_alerts: false }

function NotificationPrefs() {
  const [prefs, setPrefs] = useState(() => {
    try { const s = localStorage.getItem('dash_notif_prefs'); return s ? JSON.parse(s) : NOTIF_DEFAULTS }
    catch { return NOTIF_DEFAULTS }
  })
  const toggle = (k) => setPrefs((p) => {
    const next = { ...p, [k]: !p[k] }
    localStorage.setItem('dash_notif_prefs', JSON.stringify(next))
    return next
  })
  return (
    <Panel title="Notifications" subtitle="When and how the team gets pinged">
      <ul className="divide-y divide-white/5">
        {[
          { k: 'new_inquiry', label: 'New inquiry email alerts', desc: 'Email + push when a new lead arrives' },
          { k: 'daily_summary', label: 'Daily summary', desc: '8 AM daily inbox digest of leads, viewings, deals' },
          { k: 'weekly_report', label: 'Weekly performance report', desc: 'Sunday morning roll-up across team' },
          { k: 'competitor_alerts', label: 'Competitor activity alerts', desc: 'Notify when major competitors list new high-end inventory' },
        ].map((item) => (
          <li key={item.k} className="flex items-center justify-between gap-4 py-3.5">
            <div className="min-w-0 pr-2">
              <p className="text-sm text-ink-100">{item.label}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-ink-400">{item.desc}</p>
            </div>
            <Toggle checked={prefs[item.k]} onChange={() => toggle(item.k)} />
          </li>
        ))}
      </ul>
    </Panel>
  )
}

/* ============================ INTEGRATIONS ============================ */
function Integrations() {
  const pushToast = useToast((s) => s.push)
  return (
    <Panel title="Integrations" subtitle="Connected services">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <IntegrationCard name="WhatsApp Business API" status="connected" desc="Lead inquiries auto-create cards in your CRM" />
        <IntegrationCard name="Google Analytics 4" status="connected" desc="Powers the Analytics dashboard" />
        <IntegrationCard name="Instagram" status="connected" desc="@irebahrain feed displayed on homepage" />
        <IntegrationCard
          name="Bayut Bahrain"
          status="disconnected"
          desc="Cross-post listings to Bayut"
          onConnect={() => pushToast('Bayut OAuth — coming soon')}
        />
        <IntegrationCard
          name="Property Finder"
          status="disconnected"
          desc="Cross-post listings to Property Finder"
          onConnect={() => pushToast('Property Finder OAuth — coming soon')}
        />
        <IntegrationCard name="Google My Business" status="connected" desc="Reviews and search presence" />
      </div>
    </Panel>
  )
}

/* ============================ WEBSITE SECTIONS ============================ */
const SECTIONS_DEFAULTS = { featured: true, areas: true, types: true, why: true, testimonials: true, instagram: true, newsletter: true }

function SiteSettings() {
  const [sections, setSections] = useState(() => {
    try { const s = localStorage.getItem('dash_site_sections'); return s ? JSON.parse(s) : SECTIONS_DEFAULTS }
    catch { return SECTIONS_DEFAULTS }
  })
  const toggle = (k) => setSections((s) => {
    const next = { ...s, [k]: !s[k] }
    localStorage.setItem('dash_site_sections', JSON.stringify(next))
    return next
  })
  return (
    <Panel title="Website Sections" subtitle="Toggle homepage sections without touching code">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['featured', 'Featured Properties'],
          ['areas', 'Areas We Serve'],
          ['types', 'Property Types'],
          ['why', 'Why Choose IRE'],
          ['testimonials', 'Testimonials'],
          ['instagram', 'Instagram Feed'],
          ['newsletter', 'Newsletter signup'],
        ].map(([k, label]) => (
          <div
            key={k}
            className="flex items-center justify-between gap-3 rounded-md border border-white/5 bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/10"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <Globe className="h-3.5 w-3.5 flex-shrink-0 text-gold-500" strokeWidth={1.6} />
              <p className="truncate text-sm text-ink-100">{label}</p>
            </div>
            <Toggle checked={sections[k]} onChange={() => toggle(k)} />
          </div>
        ))}
      </div>
    </Panel>
  )
}

/* ============================ BILLING ============================ */
function Billing() {
  const pushToast = useToast((s) => s.push)
  const invoices = [
    { id: 'INV-2026-04', date: '01 Apr 2026', amount: 'BD 99.00', status: 'Paid' },
    { id: 'INV-2026-03', date: '01 Mar 2026', amount: 'BD 99.00', status: 'Paid' },
    { id: 'INV-2026-02', date: '01 Feb 2026', amount: 'BD 99.00', status: 'Paid' },
    { id: 'INV-2026-01', date: '01 Jan 2026', amount: 'BD 99.00', status: 'Paid' },
  ]
  return (
    <Panel
      title="Billing"
      subtitle="Plan, payment method, and invoices"
      action={
        <button
          onClick={() => pushToast('Plan upgrade — coming soon')}
          className="inline-flex items-center gap-1.5 rounded-md border border-gold-500/30 bg-gold-500/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300 transition-colors hover:bg-gold-500/10"
        >
          Upgrade
        </button>
      }
    >
      {/* Plan + payment method side by side */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Current plan */}
        <div className="relative overflow-hidden rounded-md border border-gold-500/30 bg-gradient-to-br from-gold-500/[0.08] via-transparent to-transparent p-5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gold-gradient px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-ink-900">
              Current
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold-500">
              Professional
            </span>
          </div>
          <p className="mt-4 font-numbers text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">
            BD 99
            <span className="text-base font-normal text-ink-300">/month</span>
          </p>
          <p className="mt-1 text-[11px] text-ink-400">Billed monthly · renews 1 May 2026</p>
          <ul className="mt-4 grid gap-1.5 text-[12px] text-ink-200">
            <BillingFeature>Unlimited active listings</BillingFeature>
            <BillingFeature>10 team members included</BillingFeature>
            <BillingFeature>WhatsApp Business + Bayut sync</BillingFeature>
            <BillingFeature>Advanced analytics + commission tracking</BillingFeature>
            <BillingFeature>Priority support, 4hr response</BillingFeature>
          </ul>
        </div>

        {/* Payment method */}
        <div className="rounded-md border border-white/5 bg-white/[0.02] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-500">
            Payment Method
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] px-4 py-3">
            <CreditCard className="h-5 w-5 text-gold-500" strokeWidth={1.6} />
            <div className="flex-1">
              <p className="text-sm text-ink-100">Visa ending in 4242</p>
              <p className="text-[11px] text-ink-400">Expires 09/2028</p>
            </div>
            <button
              onClick={() => pushToast('Update card — coming soon')}
              className="rounded px-2 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-300 hover:bg-white/5 hover:text-gold-300"
            >
              Change
            </button>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-400">
            Auto-renews each month. We'll email a reminder 5 days before the next charge.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => pushToast('Billing email updated')}
              className="rounded border border-white/10 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-200 transition-colors hover:border-gold-500/40 hover:text-gold-300"
            >
              Update billing email
            </button>
            <button
              onClick={() => pushToast('Cancel scheduled — confirm via email', { type: 'error' })}
              className="rounded border border-white/10 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-300 transition-colors hover:border-red-500/40 hover:text-red-400"
            >
              Cancel subscription
            </button>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="mt-6 overflow-hidden rounded-md border border-white/5">
        <header className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-500">
            Recent Invoices
          </p>
          <button
            onClick={() => pushToast('Downloading all invoices…')}
            className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-300 hover:text-gold-300"
          >
            <Download className="h-3 w-3" /> Export all
          </button>
        </header>
        <ul className="divide-y divide-white/5">
          {invoices.map((inv) => (
            <li key={inv.id} className="flex items-center gap-3 px-4 py-3 text-sm">
              <FileText className="h-4 w-4 flex-shrink-0 text-ink-400" strokeWidth={1.6} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-ink-100">{inv.id}</p>
                <p className="text-[11px] text-ink-400">{inv.date}</p>
              </div>
              <span className="font-numbers text-sm font-semibold tabular-nums text-ink-100">{inv.amount}</span>
              <span className="hidden rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-emerald-300 sm:inline-block">
                {inv.status}
              </span>
              <button
                onClick={() => pushToast(`Downloading ${inv.id}`)}
                className="rounded p-1.5 text-ink-300 transition-colors hover:bg-white/5 hover:text-gold-300"
                aria-label={`Download ${inv.id}`}
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}

function BillingFeature({ children }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold-500" strokeWidth={2} />
      <span>{children}</span>
    </li>
  )
}

/* ============================ ATOMS ============================ */
function Field({ label, children }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-500">{label}</p>
      {children}
    </label>
  )
}

function Input({ value, onChange, ...rest }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-ink-100 outline-none transition-colors focus:border-gold-500/40 focus:bg-white/[0.05]"
      {...rest}
    />
  )
}

function Textarea({ value, onChange, rows = 2 }) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full resize-none rounded-md border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm leading-relaxed text-ink-100 outline-none transition-colors focus:border-gold-500/40 focus:bg-white/[0.05]"
    />
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full"
      aria-pressed={checked}
    >
      <span className={`absolute inset-0 rounded-full transition-colors ${checked ? 'bg-gold-500' : 'bg-white/10'}`} />
      <span className={`absolute left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  )
}

function IntegrationCard({ name, status, desc, onConnect }) {
  const connected = status === 'connected'
  return (
    <div
      className={`flex flex-col gap-3 rounded-md border p-4 transition-colors ${
        connected
          ? 'border-emerald-500/20 bg-emerald-500/[0.04]'
          : 'border-white/5 bg-white/[0.02] hover:border-gold-500/20'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-ink-100">{name}</p>
        <span
          className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] ${
            connected ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-ink-300'
          }`}
        >
          {status}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-ink-400">{desc}</p>
      {!connected && (
        <button
          onClick={onConnect}
          className="self-start rounded-md border border-gold-500/30 bg-gold-500/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300 transition-colors hover:bg-gold-500/10"
        >
          Connect
        </button>
      )}
    </div>
  )
}
