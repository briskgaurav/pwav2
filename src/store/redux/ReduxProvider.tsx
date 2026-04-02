'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { VerifiedUserSync } from '@/store/redux/VerifiedUserSync'
import { store, persistor } from './store'

type ReduxProviderProps = {
  children: React.ReactNode
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <VerifiedUserSync />
        {children}
      </PersistGate>
    </Provider>
  )
}
