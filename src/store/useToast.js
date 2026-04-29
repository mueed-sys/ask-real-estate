import { create } from 'zustand'

let nextId = 1

export const useToast = create((set) => ({
  toasts: [],
  push: (message, opts = {}) => {
    const id = nextId++
    const toast = {
      id,
      message,
      type: opts.type ?? 'info', // 'success' | 'info' | 'error'
      duration: opts.duration ?? 2400,
    }
    set((state) => ({ toasts: [...state.toasts, toast] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, toast.duration)
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
