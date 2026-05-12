import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getVirtualCards, getUniversalCards, VirtualCard, UniversalCard } from '@/lib/api/cards'
import { MOCK_HOST_CONTEXT } from '@/lib/api/__mocks__/hostContext'

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
    const email = MOCK_HOST_CONTEXT.recipientEmail
    const bvn = MOCK_HOST_CONTEXT.bvn
    const nin = MOCK_HOST_CONTEXT.nin

    // Fetch both simultaneously
    const [virtualCards, universalCards] = await Promise.all([
      getVirtualCards({ email, bvn, nin }),
      getUniversalCards({ email, bvn, nin }),
    ])

    const virtualCardsWithPin = virtualCards.map(card => ({ ...card, defaultPin: '1234' }))
    const universalCardsWithPin = universalCards.map(card => ({ ...card, defaultPin: '1234' }))

    return { virtualCards: virtualCardsWithPin, universalCards: universalCardsWithPin }
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
