import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX = 3

export const useComparison = create(
  persist(
    (set, get) => ({
      ids: [],
      max: MAX,
      isInCompare: (id) => get().ids.includes(id),
      toggle: (id) => {
        const { ids } = get()
        if (ids.includes(id)) {
          set({ ids: ids.filter((x) => x !== id) })
          return { added: false, atMax: false }
        }
        if (ids.length >= MAX) {
          return { added: false, atMax: true }
        }
        set({ ids: [...ids, id] })
        return { added: true, atMax: false }
      },
      remove: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: 'ire.compare' }
  )
)
