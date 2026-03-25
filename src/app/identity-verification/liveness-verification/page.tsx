'use client'

import LayoutSheet from '@/components/screens/components/LayoutSheet'
import React from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import Introduction from '@/components/screens/IdentityVerificationScreens/FaceVerification/IntroductionScreen'
import FaceScan from '@/components/screens/IdentityVerificationScreens/FaceVerification/FaceScan'
import ReviewScreen from '@/components/screens/IdentityVerificationScreens/FaceVerification/ReviewScreen'
import IndentityCompleted from '@/components/screens/IdentityVerificationScreens/FaceVerification/IndentityCompleted'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '@/components/screens/components/ui/ButtonComponent'
import { RootState } from '@/store/redux/store'
import { nextStep } from '@/store/redux/slices/livenessSlice'

export default function LivenessVerificationPage() {
  const dispatch = useDispatch()
  const currentStep = useSelector((state: RootState) => state.liveness.currentStep)
  const router = useRouter()

  const handleContinue = () => {
    switch (currentStep) {
      case 'splash':
      case 'facescan':
      case 'review':
        dispatch(nextStep())
        break
      case 'verifydone':
        router.push(routes.IdVerification)
        break
      default:
        break
    }
  }


  // Get button text based on current step
  const getButtonText = () => {
    switch (currentStep) {
      case 'splash':
        return 'Start Verification'
      case 'facescan':
        return 'Capture'
      case 'review':
        return 'Confirm'
      case 'verifydone':
        return 'Continue to ID Verification'
      default:
        return 'Continue'
    }
  }
  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'splash':
        return <Introduction getButtonText={getButtonText} handleContinue={handleContinue} />

      case 'facescan':
        return <FaceScan getButtonText={getButtonText} handleContinue={handleContinue} />

      case 'review':
        return <ReviewScreen getButtonText={getButtonText} handleContinue={handleContinue} />

      case 'verifydone':
        return (
          <IndentityCompleted getButtonText={getButtonText} handleContinue={handleContinue} />
        )

      default:
        return null
    }
  }


  return (
    <LayoutSheet needPadding={false} routeTitle='Liveness Verification'>
      <div className="flex flex-col h-full">

        <div className='flex items-center justify-center gap-2 w-full py-6 px-4'>
          <span className='w-full h-2 bg-amber-500  rounded-full'></span>
          <span className='w-full h-2 bg-text-secondary/50 rounded-full'></span>
          <span className='w-full h-2 bg-text-secondary/50 rounded-full'></span>
        </div>
        {/* Step Content */}
        <div className="flex-1 flex items-start justify-center">
          {renderStepContent()}
        </div>



      </div>
    </LayoutSheet>
  )
}
