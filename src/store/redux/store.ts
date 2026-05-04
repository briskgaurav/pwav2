import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  type PersistedState,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import accessDrawerReducer from './slices/accessDrawerSlice'
import cardModeReducer from './slices/cardModeSlice'
import cardReducer from './slices/cardSlice'
import cardWalletReducer from './slices/cardWalletSlice'
import idVerificationReducer from './slices/idVerificationSlice'
import limitSettingReducer from './slices/limitSettingSlice'
import livenessReducer from './slices/livenessSlice'
import manageCardReducer from './slices/manageCardSlice'
import onlinePaymentReducer from './slices/onlinePaymentSlice'
import profileDrawerReducer from './slices/profileDrawerSlice'
import userReducer from './slices/userSlice'

const persistConfig = {
  key: 'root',
  storage,
  version: 2,
  whitelist: ['cardWallet'],
  migrate: (incomingState: unknown) => {
    if (incomingState && typeof incomingState === 'object') {
      const next = { ...(incomingState as Record<string, unknown>) }
      delete next.user
      return Promise.resolve(next as PersistedState)
    }
    return Promise.resolve(undefined as unknown as PersistedState)
  },
}

const rootReducer = combineReducers({
  liveness: livenessReducer,
  idVerification: idVerificationReducer,
  card: cardReducer,
  cardMode: cardModeReducer,
  cardWallet: cardWalletReducer,
  user: userReducer,
  profileDrawer: profileDrawerReducer,
  accessDrawer: accessDrawerReducer,
  manageCard: manageCardReducer,
  limitSetting: limitSettingReducer,
  onlinePayment: onlinePaymentReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
