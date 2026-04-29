import { useState } from 'react'
import {
  Building2, Users, Bell, Plug, Globe, CreditCard, Plus, Trash2, Check,
} from 'lucide-react'
import Panel from '../../components/dashboard/Panel'
import { useToast } from '../../store/useToast'
import { BRAND, CONTACT, OFFICE } from '../../lib/constants'
import agents from '../../data/agents.json'

export default function Settings() {
  return (
    <div className="space-y-6">
      <CompanyProfile />
      <TeamManagement />
      <NotificationPrefs />
      <Integrations />
      <SiteSettings />
      <Billing />
    </div>
  )
}

function CompanyProfile() {
  const pushToast = useToast((s) => s.push)
  const [form, setForm] = useState({
    name: BRAND.legalName,
    address: OFFICE.full,
    phone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    rera: BRAND.rera.join(' · '),
  })
  return (
    <Panel title="Company Profile" subtitle="Public-facing details across the website">
      <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-500">Logo</p>
          <div className="mt-2 flex flex-col items-center gap-3">
            <img src="/logo.jpg" alt="" className="h-32 w-32 rounded-full ring-1 ring-gold-500/30" />
            <button className="rounded border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-widest text-ink-200 hover:border-gold-500/40">
              Replace logo
            </button>
          </div>
        </div>
        <div className="grid gap-4">
          <Field label="Legal Name"><Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} /></Field>
          <Field label="Office Address"><Input value={form.address} onChange={(v) => setForm({ ...form, address: v })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone"><Input value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} /></Field>
            <Field label="Email"><Input value={form.email} onChange={(v) => setForm({ ...form, email: v })} /></Field>
          </div>
          <Field label="RERA Numbers"><Input value={form.rera} onChange={(v) => setForm({ ...form, rera: v })} /></Field>
          <div>
            <button onClick={() => pushToast('Company profile saved')} className="btn-gold text-xs">Save changes</button>
          </div>
        </div>
      </div>
    </Panel>
  )
}

function TeamManagement() {
  const pushToast = useToast((s) => s.push)
  return (
    <Panel
      title="Team Management"
      subtitle={`${agents.length} agents`}
      action={
        <button onClick={() => pushToast('Invite agent — coming soon')} className="inline-flex items-center gap-1.5 rounded-md border border-gold-500/30 bg-gold-500/5 px-3 py-1.5 text-xs uppercase tracking-widest text-gold-300 hover:bg-gold-500/10">
          <Plus className="h-3.5 w-3.5" /> Invite Agent
        </button>
      }
      noPadding
    >
      <ul className="divide-y divide-white/5">
        {agents.map((a) => (
          <li key={a.id} className="flex items-center gap-4 px-5 py-4">
            <img src={a.photo} alt="" className="h-10 w-10 rounded-full object-cover ring-1 ring-gold-500/30" />
            <div className="flex-1">
              <p className="text-sm text-ink-100">{a.name}</p>
              <p className="text-[11px] uppercase tracking-widest text-gold-500">{a.title}</p>
            </div>
            <span className="text-xs text-ink-300">{a.email}</span>
            <button onClick={() => pushToast('Edit member')} className="rounded p-1.5 text-ink-300 hover:bg-white/5 hover:text-gold-300">
              Edit
            </button>
            <button onClick={() => pushToast(`Removed ${a.name}`, { type: 'error' })} className="rounded p-1.5 text-ink-300 hover:bg-white/5 hover:text-red-400">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function NotificationPrefs() {
  const [prefs, setPrefs] = useState({
    new_inquiry: true,
    daily_summary: true,
    weekly_report: true,
    competitor_alerts: false,
  })
  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }))
  return (
    <Panel title="Notifications" subtitle="When and how the team gets pinged">
      <ul className="divide-y divide-white/5">
        {[
          { k: 'new_inquiry', label: 'New inquiry email alerts', desc: 'Email + push when a new lead arrives' },
          { k: 'daily_summary', label: 'Daily summary', desc: '8 AM daily inbox digest of leads, viewings, deals' },
          { k: 'weekly_report', label: 'Weekly performance report', desc: 'Sunday morning roll-up across team' },
          { k: 'competitor_alerts', label: 'Competitor activity alerts', desc: 'Notify when major competitors list new high-end inventory' },
        ].map((item) => (
          <li key={item.k} className="flex items-center justify-between gap-6 py-3">
            <div>
              <p className="text-sm text-ink-100">{item.label}</p>
              <p className="text-[11px] text-ink-400">{item.desc}</p>
            </div>
            <Toggle checked={prefs[item.k]} onChange={() => toggle(item.k)} />
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function Integrations() {
  const pushToast = useToast((s) => s.push)
  return (
    <Panel title="Integrations" subtitle="Connected services">
      <div className="grid gap-3 md:grid-cols-3">
        <IntegrationCard
          name="WhatsApp Business API"
          status="connected"
          desc="Lead inquiries auto-create cards in your CRM"
        />
        <IntegrationCard
          name="Google Analytics 4"
          status="connected"
          desc="Powers the Analytics dashboard"
        />
        <IntegrationCard
          name="Instagram"
          status="connected"
          desc="@irebahrain feed displayed on homepage"
        />
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
        <IntegrationCard
          name="Google My Business"
          status="connected"
          desc="Reviews and search presence"
        />
      </div>
    </Panel>
  )
}

function SiteSettings() {
  const [sections, setSections] = useState({
    featured: true,
    areas: true,
    types: true,
    why: true,
    testimonials: true,
    instagram: true,
    newsletter: true,
  })
  const toggle = (k) => setSections((s) => ({ ...s, [k]: !s[k] }))
  return (
    <Panel title="Website Sections" subtitle="Toggle homepage sections on or off without touching code">
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ['featured', 'Featured Properties'],
          ['areas', 'Areas We Serve'],
          ['types', 'Property Types'],
          ['why', 'Why Choose IRE'],
          ['testimonials', 'Testimonials'],
          ['instagram', 'Instagram Feed'],
          ['newsletter', 'Newsletter signup'],
        ].map(([k, label]) => (
          <div key={k} className="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-4 py-3">
            <p className="text-sm text-ink-100">{label}</p>
            <Toggle checked={sections[k]} onChange={() => toggle(k)} />
          </div>
        ))}
      </div>
    </Panel>
  )
}

function Billing() {
  return (
    <Panel title="Billing" subtitle="Plan and usage">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-md border border-gold-500/20 bg-gold-500/[0.04] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-500">Current Plan</p>
          <p className="mt-2 font-display text-3xl text-gold-gradient">Professional</p>
          <p className="mt-1 font-numbers text-3xl tracking-wider text-gold-300">BD 199<span className="text-base text-ink-300">/month</span></p>
          <ul className="mt-5 space-y-1.5 text-sm text-ink-200">
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-gold-500" /> Unlimited listings</li>
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-gold-500" /> Up to 10 agents</li>
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-gold-500" /> AI Price Analysis (500 / month)</li>
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-gold-500" /> Document automation</li>
            <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-gold-500" /> Heat map + market intelligence</li>
          </ul>
          <button className="btn-outline mt-6 text-xs">Manage subscription</button>
        </div>

        <div className="space-y-3">
          <div className="rounded-md border border-white/5 bg-white/[0.02] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">Listings used</p>
            <p className="mt-1 font-numbers text-2xl tracking-wider text-gold-300">247 / Unlimited</p>
          </div>
          <div className="rounded-md border border-white/5 bg-white/[0.02] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">Documents this month</p>
            <p className="mt-1 font-numbers text-2xl tracking-wider text-gold-300">47 / Unlimited</p>
          </div>
          <div className="rounded-md border border-white/5 bg-white/[0.02] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">AI analyses</p>
            <p className="mt-1 font-numbers text-2xl tracking-wider text-gold-300">38 / 500</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-gold-gradient" style={{ width: `${(38 / 500) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </Panel>
  )
}

/* ---------------- ATOMS ---------------- */

function Field({ label, children }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-gold-500">{label}</p>
      {children}
    </label>
  )
}

function Input({ value, onChange, ...rest }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-ink-100 outline-none focus:border-gold-500/40"
      {...rest}
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
    <div className={`flex flex-col gap-3 rounded-md border p-4 ${connected ? 'border-emerald-500/20 bg-emerald-500/[0.04]' : 'border-white/5 bg-white/[0.02]'}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-100">{name}</p>
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest ${
          connected ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-ink-300'
        }`}>
          {status}
        </span>
      </div>
      <p className="text-xs text-ink-400">{desc}</p>
      {!connected && (
        <button onClick={onConnect} className="self-start rounded-md border border-gold-500/30 bg-gold-500/5 px-3 py-1.5 text-[11px] uppercase tracking-widest text-gold-300 hover:bg-gold-500/10">
          Connect
        </button>
      )}
    </div>
  )
}
