import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/dashboard/DashboardLayout'

import Toaster from './components/common/Toaster'
import ScrollToTop from './components/common/ScrollToTop'

// Public site
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
import MortgageTool from './pages/MortgageTool'
import Invest from './pages/Invest'
import PrivateCollection from './pages/PrivateCollection'
import NotFound from './pages/NotFound'

// Dashboard
import DashOverview from './pages/dashboard/Overview'
import DashProperties from './pages/dashboard/Properties'
import DashLeads from './pages/dashboard/Leads'
import DashAgents from './pages/dashboard/Agents'
import DashAnalytics from './pages/dashboard/Analytics'
import DashHeatmap from './pages/dashboard/Heatmap'
import DashMarketIntel from './pages/dashboard/MarketIntel'
import DashAiPricing from './pages/dashboard/AiPricing'
import DashDocuments from './pages/dashboard/Documents'
import DashSettings from './pages/dashboard/Settings'
import DashCommission from './pages/dashboard/Commission'
import DashAudit from './pages/dashboard/Audit'

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

  return (
    <>
      <ScrollToTop />

      <AnimatePresence mode="wait" initial={false}>
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
      </AnimatePresence>

      <Toaster />
    </>
  )
}
