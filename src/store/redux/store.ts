import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import livenessReducer from './slices/livenessSlice'
import idVerificationReducer from './slices/idVerificationSlice'
import cardReducer from './slices/cardSlice'
import cardModeReducer from './slices/cardModeSlice'
import cardWalletReducer from './slices/cardWalletSlice'
import userReducer from './slices/userSlice'
import profileDrawerReducer from './slices/profileDrawerSlice'
import accessDrawerReducer from './slices/accessDrawerSlice'
import manageCardReducer from './slices/manageCardSlice'
import limitSettingReducer from './slices/limitSettingSlice'
import onlinePaymentReducer from './slices/onlinePaymentSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cardWallet', 'user'],
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
