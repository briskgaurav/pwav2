import { Suspense } from 'react'
import SuccessScreen from '@/components/screens/AuthScreens/SuccessScreen'

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className='flex-1 flex items-center justify-center bg-white'>Loading...</div>}>
      <SuccessScreen />
    </Suspense>
  )
}
