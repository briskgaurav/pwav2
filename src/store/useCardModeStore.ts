import { create } from 'zustand'

type CardMode = 'virtual' | 'universal'

type CardModeState = {
  cardMode: CardMode
  setCardMode: (mode: CardMode) => void
}

export const useCardModeStore = create<CardModeState>((set) => ({
  cardMode: 'virtual',
  setCardMode: (mode) => set({ cardMode: mode }),
}))

