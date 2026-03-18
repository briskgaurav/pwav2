import { create } from 'zustand'
import type { CardType } from '@/lib/types'

export type TransactionStatus = 'success' | 'failed' | 'pending'

export type Transaction = {
  id: string
  merchantName: string
  amount: string
  isDebit: boolean
  date: string
  time: string
  status: TransactionStatus
  referenceId: string
  category?: string
  initial: string
  color: string
}

export type VirtualCardDetails = {
  pan: string
  expiry: string
  cvv: string
  cardType: CardType
  scheme: 'Visa' | 'Mastercard'
  issuerBank: string
  maskedNumber: string
  cardholderName: string
}

type OnlinePaymentStore = {
  isVerified: boolean
  isCardVisible: boolean
  isRefreshing: boolean
  cvvTimeRemaining: number
  cardDetails: VirtualCardDetails
  transactions: Transaction[]

  setVerified: (verified: boolean) => void
  toggleCardVisibility: () => void
  setRefreshing: (refreshing: boolean) => void
  setCvvTimeRemaining: (time: number) => void
  decrementCvvTimer: () => void
  refreshData: () => void
  resetSession: () => void
}

const MOCK_CARD: VirtualCardDetails = {
  pan: '5399 2301 0012 4578',
  expiry: '09/28',
  cvv: '847',
  cardType: 'debit',
  scheme: 'Visa',
  issuerBank: 'Sigma Bank',
  maskedNumber: '**** **** **** 4578',
  cardholderName: 'JOHN DOE',
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-001',
    merchantName: 'Google Cloud',
    amount: '23,670',
    isDebit: true,
    date: 'Feb 15, 2026',
    time: '8:00 PM',
    status: 'success',
    referenceId: 'REF-GC-20260215-001',
    category: 'Technology',
    initial: 'G',
    color: 'bg-orange',
  },
  {
    id: 'txn-002',
    merchantName: 'Amazon',
    amount: '72,107',
    isDebit: true,
    date: 'Feb 14, 2026',
    time: '8:45 PM',
    status: 'success',
    referenceId: 'REF-AZ-20260214-002',
    category: 'Shopping',
    initial: 'A',
    color: 'bg-gray-400',
  },
  {
    id: 'txn-003',
    merchantName: 'ChatGPT Plus',
    amount: '55,000',
    isDebit: true,
    date: 'Feb 12, 2026',
    time: '9:45 PM',
    status: 'success',
    referenceId: 'REF-OA-20260212-003',
    category: 'Subscription',
    initial: 'C',
    color: 'bg-black',
  },
  {
    id: 'txn-004',
    merchantName: 'Netflix',
    amount: '4,900',
    isDebit: true,
    date: 'Feb 10, 2026',
    time: '12:00 AM',
    status: 'pending',
    referenceId: 'REF-NF-20260210-004',
    category: 'Entertainment',
    initial: 'N',
    color: 'bg-red-500',
  },
  {
    id: 'txn-005',
    merchantName: 'Refund - Amazon',
    amount: '12,500',
    isDebit: false,
    date: 'Feb 08, 2026',
    time: '3:30 PM',
    status: 'success',
    referenceId: 'REF-RF-20260208-005',
    category: 'Refund',
    initial: 'A',
    color: 'bg-gray-400',
  },

  {
    id: 'txn-006',
    merchantName: 'Spotify Premium',
    amount: '2,500',
    isDebit: true,
    date: 'Feb 05, 2026',
    time: '6:00 AM',
    status: 'success',
    referenceId: 'REF-SP-20260205-006',
    category: 'Subscription',
    initial: 'S',
    color: 'bg-green-500',
  },
  {
    id: 'txn-007',
    merchantName: 'Uber Eats',
    amount: '8,750',
    isDebit: true,
    date: 'Feb 03, 2026',
    time: '7:30 PM',
    status: 'success',
    referenceId: 'REF-UE-20260203-007',
    category: 'Food & Dining',
    initial: 'U',
    color: 'bg-black',
  },
  {
    id: 'txn-008',
    merchantName: 'Apple Store',
    amount: '150,000',
    isDebit: true,
    date: 'Feb 01, 2026',
    time: '2:15 PM',
    status: 'failed',
    referenceId: 'REF-AP-20260201-008',
    category: 'Electronics',
    initial: 'A',
    color: 'bg-gray-600',
  },
  {
    id: 'txn-009',
    merchantName: 'Google Cloud',
    amount: '25,000',
    isDebit: true,
    date: 'Jan 28, 2026',
    time: '11:00 AM',
    status: 'success',
    referenceId: 'REF-GC-20260128-009',
    category: 'Cloud Services',
    initial: 'G',
    color: 'bg-blue-500',
  },
  {
    id: 'txn-010',
    merchantName: 'Jumia',
    amount: '35,400',
    isDebit: true,
    date: 'Jan 25, 2026',
    time: '4:45 PM',
    status: 'success',
    referenceId: 'REF-JM-20260125-010',
    category: 'Shopping',
    initial: 'J',
    color: 'bg-orange-500',
  },
]

const CVV_RESET_SECONDS = 300 // 5 minutes

export const useOnlinePaymentStore = create<OnlinePaymentStore>((set, get) => ({
  isVerified: false,
  isCardVisible: true,
  isRefreshing: false,
  cvvTimeRemaining: CVV_RESET_SECONDS,
  cardDetails: MOCK_CARD,
  transactions: MOCK_TRANSACTIONS,

  setVerified: (verified) => set({ isVerified: verified }),

  toggleCardVisibility: () => set((s) => ({ isCardVisible: !s.isCardVisible })),

  setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),

  setCvvTimeRemaining: (time) => set({ cvvTimeRemaining: time }),

  decrementCvvTimer: () => {
    const current = get().cvvTimeRemaining
    if (current <= 0) {
      // Reset CVV timer and generate new mock CVV
      const newCvv = String(Math.floor(100 + Math.random() * 900))
      set((s) => ({
        cvvTimeRemaining: CVV_RESET_SECONDS,
        cardDetails: { ...s.cardDetails, cvv: newCvv },
      }))
    } else {
      set({ cvvTimeRemaining: current - 1 })
    }
  },

  refreshData: () => {
    set({ isRefreshing: true })
    // Simulate API call
    setTimeout(() => {
      const newCvv = String(Math.floor(100 + Math.random() * 900))
      set((s) => ({
        isRefreshing: false,
        cvvTimeRemaining: CVV_RESET_SECONDS,
        cardDetails: { ...s.cardDetails, cvv: newCvv },
      }))
    }, 1500)
  },

  resetSession: () =>
    set({
      isVerified: false,
      isCardVisible: true,
      isRefreshing: false,
      cvvTimeRemaining: CVV_RESET_SECONDS,
      cardDetails: MOCK_CARD,
      transactions: MOCK_TRANSACTIONS,
    }),
}))
