import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Building2, Users, UserCog, BarChart3, Map,
  Brain, Sparkles, FileText, Settings, ExternalLink, Search, Bell, Menu, X,
  ChevronLeft, ChevronRight, ChevronDown,
} from 'lucide-react'
import notifications from '../../data/dashboard/notifications.json'

const NAV_SECTIONS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/properties', label: 'Properties', icon: Building2 },
  { to: '/dashboard/leads', label: 'Leads & Inquiries', icon: Users },
  { to: '/dashboard/agents', label: 'Agents', icon: UserCog },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/heatmap', label: 'Heat Map', icon: Map },
  { to: '/dashboard/market-intel', label: 'Market Intelligence', icon: Brain },
  { to: '/dashboard/ai-pricing', label: 'AI Price Analysis', icon: Sparkles },
  { to: '/dashboard/documents', label: 'Documents', icon: FileText },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

// Title shown in topbar per route
function pageTitleFor(pathname) {
  const found = NAV_SECTIONS.find((s) =>
    s.end ? pathname === s.to : pathname.startsWith(s.to)
  )
  return found?.label || 'Dashboard'
}

export default function DashboardLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — IRE Bahrain</title>
        <meta name="robots" content="noindex, nofollow" />
        <body className="dashboard-body" />
      </Helmet>

      <div className="flex min-h-screen bg-[#070810] text-ink-100">
        {/* Sidebar — desktop */}
        <Sidebar />

        {/* Sidebar — mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              />
              <motion.div
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-y-0 left-0 z-50 lg:hidden"
              >
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-[#070810]/95 px-5 backdrop-blur-xl">
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-ink-200 lg:hidden"
              aria-label="Menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <h1 className="font-display text-2xl text-ink-100">{pageTitleFor(location.pathname)}</h1>

            {/* Search */}
            <div className="relative ml-auto hidden md:block">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                placeholder="Search properties, leads, agents…"
                className="w-72 rounded-md border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-ink-100 placeholder:text-ink-400 outline-none transition-colors focus:border-gold-500/40"
              />
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setBellOpen((v) => !v)}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-ink-200 transition-colors hover:border-gold-500/40 hover:text-gold-300"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-ink-900">
                    {notifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {bellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-md border border-white/10 bg-ink-900 shadow-2xl"
                  >
                    <div className="border-b border-white/5 px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-500">Recent Activity</p>
                    </div>
                    <ul className="max-h-80 divide-y divide-white/5 overflow-y-auto">
                      {notifications.map((n) => (
                        <li key={n.id} className="px-4 py-3 text-sm hover:bg-white/[0.02]">
                          <p className="text-ink-100">{n.message}</p>
                          <p className="mt-0.5 text-[11px] text-ink-400">{n.time}</p>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View Live Site */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-gold-500/30 bg-gold-500/5 px-3 py-2 text-xs font-medium tracking-wide text-gold-300 transition-colors hover:bg-gold-500/10"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Live Site</span>
            </Link>
          </header>

          {/* Page content */}
          <main className="min-w-0 flex-1 overflow-x-hidden p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-screen w-60 flex-shrink-0 flex-col border-r border-white/5 bg-[#0a0c18]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
        <span className="relative inline-flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-gold-500/30">
          <img src="/logo.jpg" alt="" className="h-full w-full object-cover" />
        </span>
        <span className="flex min-w-0 flex-col leading-none">
          <span className="font-display text-base text-ink-100">IRE Bahrain</span>
          <span className="mt-0.5 text-[9px] font-medium uppercase tracking-widest text-gold-500">Admin</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5 px-3">
          {NAV_SECTIONS.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium tracking-wide transition-all ${
                      isActive
                        ? 'bg-gold-500/10 text-gold-300'
                        : 'text-ink-300 hover:bg-white/[0.03] hover:text-ink-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-gold-gradient" />
                      )}
                      <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.6} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-white/[0.03]">
          <img
            src="https://randomuser.me/api/portraits/men/68.jpg"
            alt="Ahmed Al Khalifa"
            className="h-9 w-9 flex-shrink-0 rounded-full object-cover ring-1 ring-gold-500/30"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-100">Ahmed Al Khalifa</p>
            <p className="text-[10px] uppercase tracking-widest text-gold-500">Branch Manager</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-ink-400" />
        </div>
      </div>
    </aside>
  )
}
