import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileSignature, ClipboardCheck, Mail, FileCheck, Receipt, ListChecks,
  RotateCw, ShieldAlert, FileText, Sparkles, X, Download, MessageCircle, Eye,
  Clock, FileWarning, Send,
} from 'lucide-react'

import StatCard from '../../components/dashboard/StatCard'
import Panel from '../../components/dashboard/Panel'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { useToast } from '../../store/useToast'

import documents from '../../data/dashboard/documents.json'
import properties from '../../data/properties.json'

const ICONS = {
  FileSignature, ClipboardCheck, Mail, FileCheck, Receipt, ListChecks,
  RotateCw, ShieldAlert,
}

export default function Documents() {
  const pushToast = useToast((s) => s.push)
  const [open, setOpen] = useState(null)        // template selected for generation
  const [preview, setPreview] = useState(null)  // generated doc to preview

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-gold-500/20 bg-gold-500/[0.04] p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
          <p className="text-sm text-ink-200">
            <span className="font-semibold text-gold-300">Generate professional documents in 30 seconds.</span>{' '}
            No templates, no copy-pasting, no errors. Every document auto-fills with the right data.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Generated This Month" value={47} />
        <StatCard icon={Clock} label="Avg Time to Generate" value={30} suffix=" sec" duration={1200} />
        <StatCard icon={FileWarning} label="Pending Signature" value={8} />
        <StatCard icon={Sparkles} label="Time Saved" value={24} suffix=" hrs" duration={1300} />
      </div>

      {/* Templates */}
      <Panel title="Document Templates" subtitle="Click a template to generate a new document">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {documents.templates.map((t) => {
            const Icon = ICONS[t.icon] || FileText
            return (
              <button
                key={t.id}
                onClick={() => setOpen(t)}
                className="group flex flex-col items-start gap-3 rounded-md border border-white/5 bg-white/[0.02] p-5 text-left transition-all hover:-translate-y-1 hover:border-gold-500/30 hover:bg-gold-500/[0.04]"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gold-500/20 bg-gold-500/5 text-gold-400 transition-colors group-hover:bg-gold-500/15">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg leading-tight text-ink-100">{t.name}</h3>
                <p className="text-[11px] leading-relaxed text-ink-400">{t.description}</p>
              </button>
            )
          })}
        </div>
      </Panel>

      {/* Recent docs */}
      <Panel title="Recent Documents" subtitle={`${documents.recent.length} documents this month`} noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Property</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Agent</th>
                <th className="px-5 py-3">Generated</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.recent.map((d) => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-numbers text-sm tracking-wider text-gold-400">{d.id}</td>
                  <td className="px-5 py-3 text-sm text-ink-100">{d.type}</td>
                  <td className="px-5 py-3 font-numbers text-sm tracking-wider text-ink-300">{d.property}</td>
                  <td className="px-5 py-3 text-sm text-ink-300">{d.client}</td>
                  <td className="px-5 py-3 text-sm text-ink-300">{d.agent.split(' ')[0]}</td>
                  <td className="px-5 py-3 text-[11px] text-ink-400">{d.generated}</td>
                  <td className="px-5 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setPreview(d)} className="rounded p-1.5 text-ink-300 hover:bg-white/5 hover:text-gold-300" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => pushToast(`${d.id} downloaded as PDF`)} className="rounded p-1.5 text-ink-300 hover:bg-white/5 hover:text-gold-300" title="Download">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => pushToast(`${d.id} sent via WhatsApp`)} className="rounded p-1.5 text-ink-300 hover:bg-white/5 hover:text-emerald-400" title="Send">
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <GenerateDrawer
        template={open}
        onClose={() => setOpen(null)}
        onGenerated={(doc) => {
          setOpen(null)
          setPreview(doc)
          pushToast(`${doc.id} generated in 30 seconds`, { type: 'success' })
        }}
      />
      <DocumentPreview document={preview} onClose={() => setPreview(null)} pushToast={pushToast} />
    </div>
  )
}

function GenerateDrawer({ template, onClose, onGenerated }) {
  const [form, setForm] = useState({
    landlord: 'Mohammed Al Ali',
    tenant: '',
    property_id: 'IRE-001',
    rent: 650,
    start: '2026-05-01',
    duration: '1 year',
    deposit: 650,
    payment_terms: 'Monthly',
    conditions: '',
  })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const property = useMemo(() => properties.find((p) => p.id === form.property_id), [form.property_id])

  // Auto-derive deposit + rent from property
  const onPropertyChange = (id) => {
    const p = properties.find((x) => x.id === id)
    setForm((f) => ({ ...f, property_id: id, rent: p?.price || f.rent, deposit: p?.price || f.deposit }))
  }

  const generate = () => {
    const id = `IRE-DOC-${String(184 + Math.floor(Math.random() * 100)).padStart(4, '0')}`
    onGenerated({
      id,
      type: template.name,
      property: form.property_id,
      client: form.tenant || '—',
      agent: 'Ahmed Al Khalifa',
      generated: new Date().toISOString().slice(0, 10),
      status: 'Draft',
      form,
      property,
    })
  }

  return (
    <AnimatePresence>
      {template && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto bg-[#0a0c18] shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#0a0c18]/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-500">Generate Document</p>
                <h2 className="mt-1 font-display text-2xl text-ink-100">{template.name}</h2>
              </div>
              <button onClick={onClose} className="rounded-md p-2 text-ink-200 hover:text-gold-300"><X className="h-5 w-5" /></button>
            </header>
            <div className="space-y-4 p-6">
              <Field label="Landlord Name">
                <input value={form.landlord} onChange={(e) => set('landlord', e.target.value)} className="dash-input" />
              </Field>
              <Field label="Tenant Name">
                <input value={form.tenant} onChange={(e) => set('tenant', e.target.value)} className="dash-input" placeholder="Required" />
              </Field>
              <Field label="Property">
                <select value={form.property_id} onChange={(e) => onPropertyChange(e.target.value)} className="dash-input">
                  {properties.map((p) => <option key={p.id} value={p.id}>{p.id} — {p.title}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Monthly Rent (auto)">
                  <input type="number" value={form.rent} onChange={(e) => set('rent', Number(e.target.value))} className="dash-input" />
                </Field>
                <Field label="Security Deposit (auto)">
                  <input type="number" value={form.deposit} onChange={(e) => set('deposit', Number(e.target.value))} className="dash-input" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Lease Start">
                  <input type="date" value={form.start} onChange={(e) => set('start', e.target.value)} className="dash-input" />
                </Field>
                <Field label="Lease Duration">
                  <select value={form.duration} onChange={(e) => set('duration', e.target.value)} className="dash-input">
                    <option>6 months</option>
                    <option>1 year</option>
                    <option>2 years</option>
                  </select>
                </Field>
              </div>
              <Field label="Payment Terms">
                <select value={form.payment_terms} onChange={(e) => set('payment_terms', e.target.value)} className="dash-input">
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Annual</option>
                </select>
              </Field>
              <Field label="Special Conditions">
                <textarea rows={3} value={form.conditions} onChange={(e) => set('conditions', e.target.value)} className="dash-input resize-none" />
              </Field>

              <button onClick={generate} disabled={!form.tenant} className="btn-gold inline-flex w-full items-center justify-center gap-2 text-xs disabled:opacity-50">
                <Sparkles className="h-3.5 w-3.5" /> Generate Document
              </button>
            </div>
            <style>{`
              .dash-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 0.5rem 0.75rem; color: #e6e7f0; font-size: 0.875rem; outline: none; }
              .dash-input:focus { border-color: rgba(212,175,55,0.4); }
            `}</style>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function DocumentPreview({ document, onClose, pushToast }) {
  return (
    <AnimatePresence>
      {document && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            className="fixed inset-4 z-50 mx-auto flex max-w-3xl flex-col overflow-hidden rounded-md bg-[#0a0c18] shadow-2xl md:inset-10"
          >
            <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-500">Document Preview</p>
                <p className="mt-0.5 font-numbers text-base tracking-wider text-gold-300">{document.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => pushToast('Downloaded as PDF')} className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-widest text-ink-200 hover:border-gold-500/40">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </button>
                <button onClick={() => pushToast('Sent to tenant via WhatsApp')} className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-3 py-1.5 text-[11px] font-semibold text-white">
                  <MessageCircle className="h-3.5 w-3.5" /> Send via WhatsApp
                </button>
                <button onClick={onClose} className="rounded-md p-2 text-ink-200 hover:text-gold-300"><X className="h-5 w-5" /></button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-[#fafaf6] p-10 text-[#1a1a1a]">
              {/* Letterhead */}
              <header className="mb-10 border-b-2 border-[#d4af37] pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/logo.jpg" alt="" className="h-12 w-12 rounded-full" />
                    <div>
                      <p className="font-display text-2xl font-bold">Istanbul Real Estate WLL</p>
                      <p className="text-xs uppercase tracking-widest text-[#8a6c1d]">RERA B201806/0212 · Since 2008</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p>Office 201, 15th Floor</p>
                    <p>Platinum Tower, Seef</p>
                    <p>+973 6600 0009 · irebahrain@gmail.com</p>
                  </div>
                </div>
              </header>

              <div className="text-right text-xs text-[#666]">
                <p>Reference: <span className="font-mono">{document.id}</span></p>
                <p>Date: {document.generated}</p>
              </div>

              <h1 className="mt-6 text-center font-display text-3xl font-bold uppercase">{document.type}</h1>
              <div className="mx-auto mt-2 h-px w-24 bg-[#d4af37]" />

              {document.form ? (
                <div className="mt-10 space-y-5 text-sm leading-relaxed">
                  <p>
                    This <strong>{document.type}</strong> is made and entered into on{' '}
                    <strong>{document.generated}</strong> between <strong>{document.form.landlord}</strong>{' '}
                    (hereinafter referred to as the "Landlord") and <strong>{document.form.tenant || '________________'}</strong>{' '}
                    (hereinafter referred to as the "Tenant") for the property described below.
                  </p>

                  <div className="rounded border border-[#d4af37]/40 bg-[#fdf9e7] p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#8a6c1d]">Property</p>
                    <p className="mt-1">{document.property?.title || document.form.property_id}</p>
                    <p className="text-xs text-[#666]">{document.property?.address}</p>
                  </div>

                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ['Monthly Rent', `BD ${document.form.rent.toLocaleString()}`],
                        ['Security Deposit', `BD ${document.form.deposit.toLocaleString()}`],
                        ['Lease Start Date', document.form.start],
                        ['Lease Duration', document.form.duration],
                        ['Payment Terms', document.form.payment_terms],
                      ].map(([k, v]) => (
                        <tr key={k} className="border-b border-[#e9e6d8]">
                          <td className="py-2 text-xs uppercase tracking-widest text-[#666]">{k}</td>
                          <td className="py-2 text-right font-medium">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <p className="text-xs leading-relaxed text-[#444]">
                    The Tenant agrees to pay rent to the Landlord on the agreed schedule, maintain the
                    property in good condition, and abide by the terms of this agreement and the Bahrain
                    rental laws (Law No. 27 of 2014). Both parties acknowledge that any disputes shall
                    be resolved through the Real Estate Regulatory Authority (RERA) of Bahrain.
                  </p>

                  {document.form.conditions && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#8a6c1d]">Special Conditions</p>
                      <p className="mt-1 text-sm">{document.form.conditions}</p>
                    </div>
                  )}

                  <div className="mt-12 grid grid-cols-2 gap-12">
                    <div>
                      <div className="border-b border-[#1a1a1a]/40 pb-1" />
                      <p className="mt-2 text-xs uppercase tracking-widest text-[#666]">Landlord</p>
                      <p className="text-sm font-medium">{document.form.landlord}</p>
                    </div>
                    <div>
                      <div className="border-b border-[#1a1a1a]/40 pb-1" />
                      <p className="mt-2 text-xs uppercase tracking-widest text-[#666]">Tenant</p>
                      <p className="text-sm font-medium">{document.form.tenant || '—'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-10 text-sm text-[#666]">Document content available in PDF download.</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-gold-500">{label}</p>
      {children}
    </label>
  )
}
