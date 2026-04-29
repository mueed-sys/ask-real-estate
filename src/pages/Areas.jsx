import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'
import AreaCard from '../components/area/AreaCard'

import areas from '../data/areas.json'
import { BRAND, SITE_URL } from '../lib/constants'

export default function Areas() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>{`${t('areas_page.title')} — ${BRAND.shortName}`}</title>
        <meta name="description" content={t('areas_page.subtitle')} />
        <link rel="canonical" href={`${SITE_URL}/areas`} />
      </Helmet>

      <div className="container-lux pb-24 pt-12">
        <SectionHeader
          eyebrow={t('nav.areas')}
          title={t('areas_page.title')}
          subtitle={t('areas_page.subtitle')}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.05}>
              <AreaCard area={a} variant="detailed" />
            </Reveal>
          ))}
        </div>
      </div>
    </>
  )
}
