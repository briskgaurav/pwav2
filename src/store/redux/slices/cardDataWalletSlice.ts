import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchAllCardsData, VirtualCard, UniversalCard } from '@/lib/api/cards'

interface CardDataWalletState {
  virtualCards: VirtualCard[]
  universalCards: UniversalCard[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CardDataWalletState = {
  virtualCards: [],
  universalCards: [],
  status: 'idle',
  error: null,
}

export const fetchAllCards = createAsyncThunk(
  'cardDataWallet/fetchAllCards',
  async () => {
    return await fetchAllCardsData()
  }
)

const cardDataWalletSlice = createSlice({
  name: 'cardDataWallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCards.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchAllCards.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.virtualCards = action.payload.virtualCards
        state.universalCards = action.payload.universalCards
      })
      .addCase(fetchAllCards.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch cards'
      })
  },
  selectors: {
    selectVirtualCards: (state) => state.virtualCards,
    selectUniversalCards: (state) => state.universalCards,
    selectCardsStatus: (state) => state.status,
  }
})

export const { selectVirtualCards, selectUniversalCards, selectCardsStatus } = cardDataWalletSlice.selectors
export default cardDataWalletSlice.reducer
