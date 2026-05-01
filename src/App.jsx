import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/dashboard/DashboardLayout'

import Toaster from './components/common/Toaster'
import ScrollToTop from './components/common/ScrollToTop'

// Public — eager (kept in main bundle so the home / properties / details
// flow doesn't blink to a loader on first navigation).
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import About from './pages/About'
import Areas from './pages/Areas'
import AreaDetail from './pages/AreaDetail'
import Contact from './pages/Contact'
import Favorites from './pages/Favorites'
import NotFound from './pages/NotFound'

// Public — lazy. Lower-traffic routes that pull in heavy deps (charts,
// leaflet, html2canvas) load only when the user navigates to them.
const Agents             = lazy(() => import('./pages/Agents'))
const AgentDetail        = lazy(() => import('./pages/AgentDetail'))
const Blog               = lazy(() => import('./pages/Blog'))
const BlogPost           = lazy(() => import('./pages/BlogPost'))
const ListProperty       = lazy(() => import('./pages/ListProperty'))
const Compare            = lazy(() => import('./pages/Compare'))
const MortgageTool       = lazy(() => import('./pages/MortgageTool'))
const Invest             = lazy(() => import('./pages/Invest'))
const PrivateCollection  = lazy(() => import('./pages/PrivateCollection'))

// Dashboard — every page lazy. The dashboard tree is huge (charts +
// leaflet + html2canvas + recharts) and never loads for a public visitor.
const DashOverview     = lazy(() => import('./pages/dashboard/Overview'))
const DashProperties   = lazy(() => import('./pages/dashboard/Properties'))
const DashLeads        = lazy(() => import('./pages/dashboard/Leads'))
const DashAgents       = lazy(() => import('./pages/dashboard/Agents'))
const DashAnalytics    = lazy(() => import('./pages/dashboard/Analytics'))
const DashHeatmap      = lazy(() => import('./pages/dashboard/Heatmap'))
const DashMarketIntel  = lazy(() => import('./pages/dashboard/MarketIntel'))
const DashAiPricing    = lazy(() => import('./pages/dashboard/AiPricing'))
const DashDocuments    = lazy(() => import('./pages/dashboard/Documents'))
const DashSettings     = lazy(() => import('./pages/dashboard/Settings'))
const DashCommission   = lazy(() => import('./pages/dashboard/Commission'))
const DashAudit        = lazy(() => import('./pages/dashboard/Audit'))

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

// Subtle gold-shimmer loading screen for lazy-loaded routes. Sits on top of
// the existing layout so the chrome (header/footer) stays mounted.
function RouteFallback() {
  return (
    <div className="container-lux flex min-h-[40vh] items-center justify-center py-section">
      <div className="h-1 w-32 overflow-hidden rounded-full bg-white/5">
        <div className="img-shimmer h-full w-full" />
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />

      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location} key={location.pathname}>
            {/* Public site — wrapped in PublicLayout (Header / Footer / floating chrome) */}
            <Route element={<PublicLayout />}>
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
              <Route path="/tools/mortgage-calculator" element={<PageWrap><MortgageTool /></PageWrap>} />
              <Route path="/invest" element={<PageWrap><Invest /></PageWrap>} />
              <Route path="/private-collection" element={<PageWrap><PrivateCollection /></PageWrap>} />
              <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
            </Route>

            {/* Admin dashboard — wrapped in DashboardLayout (sidebar + topbar) */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<PageWrap><DashOverview /></PageWrap>} />
              <Route path="properties" element={<PageWrap><DashProperties /></PageWrap>} />
              <Route path="leads" element={<PageWrap><DashLeads /></PageWrap>} />
              <Route path="agents" element={<PageWrap><DashAgents /></PageWrap>} />
              <Route path="analytics" element={<PageWrap><DashAnalytics /></PageWrap>} />
              <Route path="heatmap" element={<PageWrap><DashHeatmap /></PageWrap>} />
              <Route path="market-intel" element={<PageWrap><DashMarketIntel /></PageWrap>} />
              <Route path="ai-pricing" element={<PageWrap><DashAiPricing /></PageWrap>} />
              <Route path="documents" element={<PageWrap><DashDocuments /></PageWrap>} />
              <Route path="commission" element={<PageWrap><DashCommission /></PageWrap>} />
              <Route path="audit" element={<PageWrap><DashAudit /></PageWrap>} />
              <Route path="settings" element={<PageWrap><DashSettings /></PageWrap>} />
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>

      <Toaster />
    </>
  )
}
