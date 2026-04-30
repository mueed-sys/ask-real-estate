import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Role-based access for the dashboard. Three levels per the brief:
//   - branch_manager: full access (default)
//   - senior:        own leads/listings/commission + team analytics; no
//                    competitor data, no settings
//   - consultant:    own leads/listings only; no analytics, no commission
//
// Routes referenced via the role check use a featureMap below — each feature
// maps to the minimum role required.
export const ROLES = {
  branch_manager: { label: 'Branch Manager', tier: 3 },
  senior:         { label: 'Senior Consultant', tier: 2 },
  consultant:     { label: 'Consultant', tier: 1 },
}

// Feature → minimum tier required.
export const FEATURE_TIER = {
  overview:        1,
  properties:      1,
  leads:           1,
  agents:          2,
  analytics:       2,
  heatmap:         3,
  market:          3,
  ai_pricing:      3,
  documents:       2,
  commission:      2,
  audit:           3,
  settings:        3,
}

export const useRole = create(
  persist(
    (set) => ({
      role: 'branch_manager',
      setRole: (role) => set({ role }),
    }),
    { name: 'ire-role' }
  )
)

// Convenience hook — returns true if the current role can see a feature.
export function canAccess(role, feature) {
  const required = FEATURE_TIER[feature]
  if (required == null) return true
  return ROLES[role]?.tier >= required
}
