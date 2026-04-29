import { Outlet, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import Header from './Header'
import Footer from './Footer'
import FloatingWhatsApp from '../common/FloatingWhatsApp'
import BackToTop from '../common/BackToTop'
import CompareBar from '../common/CompareBar'

import { BRAND, CONTACT, OFFICE, SITE_URL } from '../../lib/constants'

// Public-site chrome — Header / Footer / floating chrome / SEO scaffold.
// Wraps every public route via React Router's nested layout pattern.
export default function PublicLayout() {
  const location = useLocation()
  const isComparePage = location.pathname === '/compare'

  return (
    <>
      <Helmet>
        <html lang="en" dir="ltr" />
        <title>IRE Bahrain — Your Trusted Real Estate Partner in Bahrain</title>
        <meta name="description" content="IRE Bahrain — Your Trusted Real Estate Partner in Bahrain" />
        <meta property="og:site_name" content={BRAND.shortName} />
        <meta property="og:locale" content="en_US" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: BRAND.legalName,
            alternateName: BRAND.shortName,
            url: SITE_URL,
            logo: `${SITE_URL}/logo.jpg`,
            telephone: CONTACT.phone,
            email: CONTACT.email,
            address: {
              '@type': 'PostalAddress',
              streetAddress: OFFICE.street,
              addressLocality: OFFICE.city,
              addressCountry: 'BH',
            },
            sameAs: [`https://instagram.com/${CONTACT.instagram}`],
            foundingDate: String(BRAND.founded),
            areaServed: 'Kingdom of Bahrain',
          })}
        </script>
      </Helmet>

      <Header />

      <main className="min-h-screen pt-20">
        <Outlet />
      </main>

      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
      <CompareBar hidden={isComparePage} />
    </>
  )
}
