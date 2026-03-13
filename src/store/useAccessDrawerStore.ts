import { create } from 'zustand'

type AccessDrawerStore = {
  visible: boolean
  open: () => void
  close: () => void
}

export const useAccessDrawerStore = create<AccessDrawerStore>((set) => ({
  visible: false,
  open: () => set({ visible: true }),
  close: () => set({ visible: false }),
}))

