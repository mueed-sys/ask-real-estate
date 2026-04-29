import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavorites = create(
  persist(
    (set, get) => ({
      ids: [],
      isFavorite: (id) => get().ids.includes(id),
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [...state.ids, id],
        })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: 'ire.favorites' }
  )
)
