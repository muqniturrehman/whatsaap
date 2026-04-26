import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
      isAdmin: () => get().session?.role === 'admin',
    }),
    { name: 'cd_session' }
  )
)

export const useUIStore = create((set) => ({
  activeView: 'inbox',
  setActiveView: (view) => set({ activeView: view }),

  activeConvId: null,
  setActiveConvId: (id) => set({ activeConvId: id }),

  convFilter: 'open',
  setConvFilter: (f) => set({ convFilter: f }),

  kbPanelOpen: false,
  toggleKbPanel: () => set((s) => ({ kbPanelOpen: !s.kbPanelOpen })),
  closeKbPanel: () => set({ kbPanelOpen: false }),

  labelModalOpen: false,
  openLabelModal: () => set({ labelModalOpen: true }),
  closeLabelModal: () => set({ labelModalOpen: false }),
}))
