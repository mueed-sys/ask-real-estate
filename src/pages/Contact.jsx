import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, Instagram, Check } from 'lucide-react'

import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'

import { useToast } from '../store/useToast'
import { CONTACT, OFFICE, BRAND, SITE_URL } from '../lib/constants'
import { waLink } from '../lib/whatsapp'

const HOURS = [
  ['office_hours.sun_wed', 'office_hours.sun_wed_time'],
  ['office_hours.thu', 'office_hours.thu_time'],
  ['office_hours.fri', 'office_hours.fri_time'],
  ['office_hours.sat', 'office_hours.sat_time'],
]

export default function Contact() {
  const { t } = useTranslation()
  const pushToast = useToast((s) => s.push)

  const [form, setForm] = useState({
    name: '', email: '', phone: '', inquiry: 'inquiry_buy', reference: '', message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.phone.replace(/\D/g, '').match(/^\d{8,}$/)) e.phone = 'Valid phone required'
    if (!form.message.trim()) e.message = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    // Simulate network — in production, post to your backend
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)
    setSuccess(true)
    pushToast(t('toast.form_submitted'), { type: 'success' })
  }

  return (
    <>
      <Helmet>
        <title>{`${t('contact.title')} — ${BRAND.shortName}`}</title>
        <meta name="description" content={t('contact.subtitle')} />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
      </Helmet>

      <div className="container-lux pb-24 pt-12">
        <SectionHeader
          eyebrow={t('nav.contact')}
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* FORM */}
          <Reveal>
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-lux flex flex-col items-center gap-5 px-6 py-24 text-center"
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient text-ink-900">
                    <Check className="h-7 w-7" strokeWidth={2} />
                  </div>
                  <h2 className="font-display text-3xl text-ink-100">Thank you</h2>
                  <p className="max-w-md text-ink-300">{t('contact.success')}</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-5"
                >
                  <Field label={t('contact.form_name')} error={errors.name} required>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input"
                      autoComplete="name"
                    />
                  </Field>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label={t('contact.form_email')} error={errors.email} required>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input"
                        autoComplete="email"
                      />
                    </Field>
                    <Field label={t('contact.form_phone')} error={errors.phone} required>
                      <div className="flex">
                        <span className="rounded-l-sm border border-r-0 border-white/10 bg-ink-900/40 px-3 py-2.5 text-sm text-ink-300">
                          +973
                        </span>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="input rounded-l-none"
                          autoComplete="tel"
                          placeholder="3XXX XXXX"
                        />
                      </div>
                    </Field>
                  </div>
                  <Field label={t('contact.form_inquiry')}>
                    <select
                      value={form.inquiry}
                      onChange={(e) => setForm({ ...form, inquiry: e.target.value })}
                      className="input"
                    >
                      <option value="inquiry_buy">{t('contact.inquiry_buy')}</option>
                      <option value="inquiry_rent">{t('contact.inquiry_rent')}</option>
                      <option value="inquiry_sell">{t('contact.inquiry_sell')}</option>
                      <option value="inquiry_general">{t('contact.inquiry_general')}</option>
                    </select>
                  </Field>
                  <Field label={t('contact.form_reference')}>
                    <input
                      type="text"
                      value={form.reference}
                      onChange={(e) => setForm({ ...form, reference: e.target.value })}
                      className="input"
                      placeholder="IRE-001"
                    />
                  </Field>
                  <Field label={t('contact.form_message')} error={errors.message} required>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input resize-none"
                    />
                  </Field>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold mt-2 inline-flex items-center gap-2 self-start text-xs disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {submitting ? t('common.loading') : t('contact.submit')}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>

          {/* INFO */}
          <Reveal delay={0.15}>
            <div className="card-lux p-8">
              <p className="eyebrow">{t('contact.office_label')}</p>
              <h3 className="mt-3 font-display text-2xl text-ink-100">{BRAND.legalName}</h3>

              <ul className="mt-6 space-y-4 text-sm text-ink-300">
                <InfoLine icon={MapPin}>{OFFICE.full}</InfoLine>
                <InfoLine icon={Phone} href={`tel:${CONTACT.phone}`}>{CONTACT.phoneDisplay}</InfoLine>
                <InfoLine icon={MessageCircle} href={waLink()} external>{CONTACT.whatsappDisplay}</InfoLine>
                <InfoLine icon={Mail} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</InfoLine>
                <InfoLine icon={Instagram} href={`https://instagram.com/${CONTACT.instagram}`} external>@{CONTACT.instagram}</InfoLine>
              </ul>

              <div className="mt-8 border-t border-white/5 pt-6">
                <p className="eyebrow">{t('contact.hours_label')}</p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {HOURS.map(([dKey, tKey]) => (
                    <li key={dKey} className="flex items-center justify-between gap-4">
                      <span className="text-ink-300">{t(dKey)}</span>
                      <span className="text-ink-200">{t(tKey)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        {/* MAP */}
        <Reveal>
          <div className="mt-12 overflow-hidden rounded-sm border border-white/10">
            <iframe
              title="IRE Bahrain office"
              src={`https://maps.google.com/maps?q=${OFFICE.lat},${OFFICE.lng}&z=15&output=embed`}
              className="h-96 w-full"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: rgba(10, 11, 20, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          padding: 0.625rem 0.875rem;
          color: #e6e7f0;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus { border-color: rgba(212, 175, 55, 0.4); }
      `}</style>
    </>
  )
}

function Field({ label, error, required, children }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-ink-300">
        {label}
        {required && <span className="ml-1 text-gold-500">*</span>}
      </p>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  )
}

function InfoLine({ icon: Icon, href, external, children }) {
  const Tag = href ? 'a' : 'div'
  const props = href ? (external ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href }) : {}
  return (
    <Tag {...props} className={`flex items-start gap-3 ${href ? 'transition-colors hover:text-gold-300' : ''}`}>
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
      <span>{children}</span>
    </Tag>
  )
}
