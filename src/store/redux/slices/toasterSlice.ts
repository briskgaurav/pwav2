import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export type ToasterType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  message: string
  subtitle?: string
  duration?: number
  tosterType?: ToasterType
}

interface ToasterState {
  toasts: ToastItem[]
}

const initialState: ToasterState = {
  toasts: [],
}

const toasterSlice = createSlice({
  name: 'toaster',
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<Omit<ToastItem, 'id'> & { id?: string }>,
    ) => {
      // Enforce max 3 toasts
      if (state.toasts.length >= 3) {
        state.toasts.shift()
      }
      state.toasts.push({
        id: action.payload.id || crypto.randomUUID(),
        ...action.payload,
      })
    },

    hideToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const { showToast, hideToast } = toasterSlice.actions

export const selectToasts = (state: RootState) => state.toaster.toasts

export default toasterSlice.reducer


