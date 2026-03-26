'use client'

import React, { useEffect, useState } from 'react'
import { Check, CheckCircle } from 'lucide-react'
import { getFromSession } from '@/components/Extras/utils/imageProcessing'

type ReviewScreenProps = {
  getButtonText: () => string
  handleContinue: () => void
  handleRetake: () => void
}

export default function ReviewScreen({ getButtonText, handleContinue, handleRetake }: ReviewScreenProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  useEffect(() => {
    setCapturedImage(getFromSession())
  }, [])

  return (
    <div className="h-full w-full flex flex-col px-4 py-4">
      <div className="flex-1 flex flex-col">
        <div className='mb-2'>
          <p className='text-text-primary text-md mr-2 text-right font-medium'>Review your photo</p>
        </div>
        <div className="w-full relative rounded-xl overflow-hidden  h-[45vh]  bg-gray-200">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured face" className="w-full h-full object-cover" />
          ) : (
            <img
              src="/svg/greetingbar/avtar.svg"
              alt="Captured face"
              className="w-full h-[320px] object-cover"
            />
          )}

          <div className="absolute top-4 left-4 bg-green-500 rounded-full px-4 py-1 flex items-center gap-2">
            <Check className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Good quality</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-text-secondary">Make sure face is clear and well-lit</p>
      </div>

      <div className="flex fixed bottom-0 left-0 right-0 items-center justify-center px-4 flex-col gap-2 pb-6">
        <button
          type="button"
          className="w-full py-4 rounded-full font-medium bg-primary text-white"
          onClick={handleContinue}
        >
          {getButtonText()}
        </button>

        <button
          type="button"
          className="w-full py-4 rounded-full font-medium bg-primary text-white"
          onClick={handleRetake}
        >
          Retake Photo
        </button>
      </div>
    </div>
  )
}
