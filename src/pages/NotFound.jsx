import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Search } from 'lucide-react'
import { BRAND, SITE_URL } from '../lib/constants'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>{`404 — ${BRAND.shortName}`}</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`${SITE_URL}/404`} />
      </Helmet>

      <section className="relative flex min-h-[80vh] items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-30" />
        <div className="container-lux relative z-10 py-24 text-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="font-display text-[20vw] leading-none text-gold-gradient md:text-[14rem]"
          >
            {t('not_found.code')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-2 font-display text-3xl text-ink-100 md:text-5xl"
          >
            {t('not_found.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-4 max-w-xl text-base text-ink-300"
          >
            {t('not_found.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/" className="btn-gold inline-flex items-center gap-2 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              {t('not_found.go_home')}
            </Link>
            <Link to="/properties" className="btn-outline inline-flex items-center gap-2 text-xs">
              <Search className="h-3.5 w-3.5" />
              {t('not_found.browse')}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
