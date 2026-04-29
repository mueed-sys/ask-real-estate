import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, ArrowRight, Check, Send } from 'lucide-react'

import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'

import areas from '../data/areas.json'
import { PROPERTY_TYPES } from '../lib/constants'
import { useToast } from '../store/useToast'
import { BRAND, SITE_URL } from '../lib/constants'

const STEPS = ['step_purpose', 'step_location', 'step_pricing', 'step_description', 'step_contact', 'step_review']

const AMENITIES = [
  'pool', 'gym', 'security_24_7', 'covered_parking', 'balcony', 'sea_view',
  'maids_room', 'storage', 'central_ac', 'built_in_wardrobes',
  'kitchen_appliances', 'internet', 'playground', 'concierge',
]

export default function ListProperty() {
  const { t } = useTranslation()
  const pushToast = useToast((s) => s.push)

  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [data, setData] = useState({
    purpose: 'rent',
    type: 'Apartment',
    area: '',
    address: '',
    bedrooms: 2, bathrooms: 2, sqm: 100, floor: 1, parking: 1, furnished: false,
    price: 500, period: 'month',
    description: '', amenities: [],
    name: '', email: '', phone: '', preferred: 'whatsapp',
  })

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }))
  const toggleAmenity = (a) =>
    setData((d) => ({ ...d, amenities: d.amenities.includes(a) ? d.amenities.filter((x) => x !== a) : [...d.amenities, a] }))

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const submit = async () => {
    pushToast('Submitting…', { type: 'info' })
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitted(true)
  }

  const reset = () => {
    setSubmitted(false)
    setStep(0)
  }

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>{`${t('list_property.success_title')} — ${BRAND.shortName}`}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="container-lux py-32 text-center">
          <Reveal>
            <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold-gradient text-ink-900">
              <Check className="h-10 w-10" strokeWidth={2} />
            </div>
            <h1 className="mt-6 font-display text-4xl text-ink-100 md:text-5xl">{t('list_property.success_title')}</h1>
            <p className="mx-auto mt-4 max-w-md text-base text-ink-300">{t('list_property.success_text')}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button onClick={reset} className="btn-outline text-xs">{t('list_property.success_more')}</button>
              <Link to="/properties" className="btn-gold text-xs">Browse properties</Link>
            </div>
          </Reveal>
        </div>
      </>
    )
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <>
      <Helmet>
        <title>{`${t('list_property.title')} — ${BRAND.shortName}`}</title>
        <meta name="description" content={t('list_property.subtitle')} />
        <link rel="canonical" href={`${SITE_URL}/list-property`} />
      </Helmet>

      <div className="container-lux pb-24 pt-12">
        <SectionHeader
          eyebrow={t('list_property.step', { current: step + 1, total: STEPS.length })}
          title={t('list_property.title')}
          subtitle={t('list_property.subtitle')}
        />

        {/* Progress bar */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="h-px w-full bg-white/10">
            <motion.div className="h-full bg-gold-gradient" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-medium uppercase tracking-widest">
            {STEPS.map((key, i) => (
              <span key={key} className={i <= step ? 'text-gold-500' : 'text-ink-500'}>
                {t(`list_property.${key}`)}
              </span>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="mx-auto mt-12 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="card-lux p-8"
            >
              {step === 0 && <StepPurpose data={data} set={set} t={t} />}
              {step === 1 && <StepLocation data={data} set={set} t={t} />}
              {step === 2 && <StepPricing data={data} set={set} t={t} />}
              {step === 3 && <StepDescription data={data} set={set} toggleAmenity={toggleAmenity} t={t} />}
              {step === 4 && <StepContact data={data} set={set} t={t} />}
              {step === 5 && <StepReview data={data} t={t} />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="btn-outline inline-flex items-center gap-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t('common.back')}
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={next} className="btn-gold inline-flex items-center gap-2 text-xs">
                {t('common.next')}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button onClick={submit} className="btn-gold inline-flex items-center gap-2 text-xs">
                <Send className="h-3.5 w-3.5" />
                {t('list_property.submit')}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* ---------------- STEPS ---------------- */

function StepPurpose({ data, set, t }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">{t('list_property.purpose')}</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { v: 'rent', l: t('list_property.rent') },
            { v: 'sell', l: t('list_property.sell') },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => set('purpose', o.v)}
              className={`rounded-sm border p-5 text-left text-sm transition-all ${
                data.purpose === o.v ? 'border-gold-500 bg-gold-500/10 text-gold-300' : 'border-white/10 text-ink-200 hover:border-gold-500/40'
              }`}
            >
              <span className="font-display text-xl">{o.l}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow">{t('list_property.type')}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PROPERTY_TYPES.map((typeInfo) => (
            <button
              key={typeInfo.value}
              onClick={() => set('type', typeInfo.value)}
              className={`rounded-sm border px-4 py-3 text-sm transition-all ${
                data.type === typeInfo.value ? 'border-gold-500 bg-gold-500/10 text-gold-300' : 'border-white/10 text-ink-200 hover:border-gold-500/40'
              }`}
            >
              {typeInfo.value}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepLocation({ data, set, t }) {
  return (
    <div className="space-y-6">
      <Field label={t('list_property.area')}>
        <select value={data.area} onChange={(e) => set('area', e.target.value)} className="input">
          <option value="">—</option>
          {areas.map((a) => (
            <option key={a.slug} value={a.name}>{a.name}</option>
          ))}
        </select>
      </Field>
      <Field label={t('list_property.address')}>
        <input value={data.address} onChange={(e) => set('address', e.target.value)} className="input" />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label={t('details.bedrooms')}>
          <input type="number" value={data.bedrooms} onChange={(e) => set('bedrooms', Number(e.target.value))} className="input" />
        </Field>
        <Field label={t('details.bathrooms')}>
          <input type="number" value={data.bathrooms} onChange={(e) => set('bathrooms', Number(e.target.value))} className="input" />
        </Field>
        <Field label={t('details.area_sqm')}>
          <input type="number" value={data.sqm} onChange={(e) => set('sqm', Number(e.target.value))} className="input" />
        </Field>
        <Field label={t('details.floor')}>
          <input type="number" value={data.floor} onChange={(e) => set('floor', Number(e.target.value))} className="input" />
        </Field>
        <Field label={t('details.parking')}>
          <input type="number" value={data.parking} onChange={(e) => set('parking', Number(e.target.value))} className="input" />
        </Field>
        <Field label={t('details.furnished')}>
          <select value={String(data.furnished)} onChange={(e) => set('furnished', e.target.value === 'true')} className="input">
            <option value="false">{t('details.no')}</option>
            <option value="true">{t('details.yes')}</option>
          </select>
        </Field>
      </div>
      <FormStyles />
    </div>
  )
}

function StepPricing({ data, set, t }) {
  return (
    <div className="space-y-6">
      <Field label={t('list_property.price_label')}>
        <input type="number" value={data.price} onChange={(e) => set('price', Number(e.target.value))} className="input" />
      </Field>
      {data.purpose === 'rent' && (
        <Field label="Period">
          <select value={data.period} onChange={(e) => set('period', e.target.value)} className="input">
            <option value="month">Per month</option>
            <option value="year">Per year</option>
          </select>
        </Field>
      )}
      <FormStyles />
    </div>
  )
}

function StepDescription({ data, set, toggleAmenity, t }) {
  return (
    <div className="space-y-6">
      <Field label={t('details.description')}>
        <textarea rows={5} value={data.description} onChange={(e) => set('description', e.target.value)} className="input resize-none" />
      </Field>
      <div>
        <p className="eyebrow">{t('details.amenities')}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AMENITIES.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-200 transition-colors hover:border-gold-500/30">
              <input type="checkbox" checked={data.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="accent-gold-500" />
              {t(`amenities.${a}`)}
            </label>
          ))}
        </div>
      </div>
      <FormStyles />
    </div>
  )
}

function StepContact({ data, set, t }) {
  return (
    <div className="space-y-5">
      <Field label={t('contact.form_name')}>
        <input value={data.name} onChange={(e) => set('name', e.target.value)} className="input" />
      </Field>
      <Field label={t('contact.form_email')}>
        <input type="email" value={data.email} onChange={(e) => set('email', e.target.value)} className="input" />
      </Field>
      <Field label={t('contact.form_phone')}>
        <input type="tel" value={data.phone} onChange={(e) => set('phone', e.target.value)} className="input" placeholder="+973 ..." />
      </Field>
      <Field label="Preferred contact method">
        <select value={data.preferred} onChange={(e) => set('preferred', e.target.value)} className="input">
          <option value="whatsapp">WhatsApp</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
        </select>
      </Field>
      <FormStyles />
    </div>
  )
}

function StepReview({ data, t }) {
  const rows = [
    ['Purpose', data.purpose === 'rent' ? t('common.for_rent') : t('common.for_sale')],
    ['Type', data.type],
    ['Area', data.area || '—'],
    ['Address', data.address || '—'],
    ['Specs', `${data.bedrooms}br · ${data.bathrooms}ba · ${data.sqm}m² · floor ${data.floor} · ${data.parking} parking`],
    ['Furnished', data.furnished ? t('details.yes') : t('details.no')],
    ['Price', `BD ${data.price}${data.purpose === 'rent' ? '/' + data.period : ''}`],
    ['Amenities', data.amenities.length ? data.amenities.length + ' selected' : 'None'],
    ['Contact', `${data.name} · ${data.email} · ${data.phone}`],
  ]
  return (
    <div className="space-y-3">
      <p className="font-display text-2xl text-ink-100">Review your listing</p>
      <p className="text-sm text-ink-300">A consultant will contact you within 24 hours to confirm and verify.</p>
      <ul className="mt-4 divide-y divide-white/5 border-y border-white/5">
        {rows.map(([k, v]) => (
          <li key={k} className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="text-[11px] uppercase tracking-widest text-gold-500">{k}</span>
            <span className="text-ink-100">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-gold-500">{label}</p>
      {children}
    </label>
  )
}

function FormStyles() {
  return (
    <style>{`
      .input { width: 100%; background: rgba(10,11,20,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 2px; padding: 0.625rem 0.875rem; color: #e6e7f0; font-size: 0.875rem; outline: none; transition: border-color .2s; }
      .input:focus { border-color: rgba(212,175,55,0.4); }
    `}</style>
  )
}
