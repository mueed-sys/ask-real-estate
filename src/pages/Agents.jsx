import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'
import AgentCard from '../components/agent/AgentCard'

import agents from '../data/agents.json'
import { BRAND, SITE_URL } from '../lib/constants'

export default function Agents() {
  const { t } = useTranslation()
  const [filterArea, setFilterArea] = useState('')
  const [filterLang, setFilterLang] = useState('')

  // Build filter options from agent data
  const allAreas = useMemo(
    () => Array.from(new Set(agents.flatMap((a) => a.specializations))).sort(),
    []
  )
  const allLangs = useMemo(
    () => Array.from(new Map(agents.flatMap((a) => a.languages).map((l) => [l.code, l])).values()),
    []
  )

  const filtered = agents.filter((a) => {
    if (filterArea && !a.specializations.includes(filterArea)) return false
    if (filterLang && !a.languages.some((l) => l.code === filterLang)) return false
    return true
  })

  return (
    <>
      <Helmet>
        <title>{`${t('agents_page.title')} — ${BRAND.shortName}`}</title>
        <meta name="description" content={t('agents_page.subtitle')} />
        <link rel="canonical" href={`${SITE_URL}/agents`} />
      </Helmet>

      <div className="container-lux pb-24 pt-12">
        <SectionHeader
          eyebrow={t('agents_page.title')}
          title={t('sections.team_title')}
          subtitle={t('agents_page.subtitle')}
        />

        {/* Filters */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-3">
            <FilterSelect
              label={t('agent_card.specializations')}
              value={filterArea}
              onChange={setFilterArea}
              options={[{ value: '', label: t('filters.all') }, ...allAreas.map((a) => ({ value: a, label: a }))]}
            />
            <FilterSelect
              label={t('agent_card.languages')}
              value={filterLang}
              onChange={setFilterLang}
              options={[{ value: '', label: t('filters.all') }, ...allLangs.map((l) => ({ value: l.code, label: l.label }))]}
            />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.06}>
              <AgentCard agent={a} />
            </Reveal>
          ))}
        </div>
      </div>
    </>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <p className="text-[10px] font-medium uppercase tracking-widest text-gold-500">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 rounded-sm border border-white/10 bg-ink-900/40 px-4 py-2.5 text-sm text-ink-200 outline-none transition-colors focus:border-gold-500/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-900">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
