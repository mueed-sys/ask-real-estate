import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import FloatingWhatsApp from './components/common/FloatingWhatsApp'
import BackToTop from './components/common/BackToTop'
import Toaster from './components/common/Toaster'
import ScrollToTop from './components/common/ScrollToTop'
import CompareBar from './components/common/CompareBar'

import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import About from './pages/About'
import Agents from './pages/Agents'
import AgentDetail from './pages/AgentDetail'
import Areas from './pages/Areas'
import AreaDetail from './pages/AreaDetail'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import ListProperty from './pages/ListProperty'
import Favorites from './pages/Favorites'
import Compare from './pages/Compare'
import NotFound from './pages/NotFound'

import { BRAND, CONTACT, OFFICE, SITE_URL } from './lib/constants'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

function PageWrap({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
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
        {/* Site-wide Organization JSON-LD */}
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

      <ScrollToTop />
      <Header />

      <main className="min-h-screen pt-20">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrap><Home /></PageWrap>} />
            <Route path="/properties" element={<PageWrap><Properties /></PageWrap>} />
            <Route path="/properties/:id" element={<PageWrap><PropertyDetail /></PageWrap>} />
            <Route path="/about" element={<PageWrap><About /></PageWrap>} />
            <Route path="/agents" element={<PageWrap><Agents /></PageWrap>} />
            <Route path="/agents/:id" element={<PageWrap><AgentDetail /></PageWrap>} />
            <Route path="/areas" element={<PageWrap><Areas /></PageWrap>} />
            <Route path="/areas/:slug" element={<PageWrap><AreaDetail /></PageWrap>} />
            <Route path="/contact" element={<PageWrap><Contact /></PageWrap>} />
            <Route path="/blog" element={<PageWrap><Blog /></PageWrap>} />
            <Route path="/blog/:slug" element={<PageWrap><BlogPost /></PageWrap>} />
            <Route path="/list-property" element={<PageWrap><ListProperty /></PageWrap>} />
            <Route path="/favorites" element={<PageWrap><Favorites /></PageWrap>} />
            <Route path="/compare" element={<PageWrap><Compare /></PageWrap>} />
            <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
      <Toaster />
      <CompareBar hidden={isComparePage} />
    </>
  )
}
