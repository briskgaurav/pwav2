import type { FAQData } from '@/components/modals/FAQModal'
import { create } from 'zustand'

type ManageCardState = {
  isFaqOpen: boolean
  faqData: FAQData | null
}

type ManageCardActions = {
  openFaq: (data: FAQData) => void
  closeFaq: () => void
}

export const useManageCardStore = create<ManageCardState & ManageCardActions>((set) => ({
  isFaqOpen: false,
  faqData: null,
  openFaq: (data) => set({ isFaqOpen: true, faqData: data }),
  closeFaq: () => set({ isFaqOpen: false }),
}))

