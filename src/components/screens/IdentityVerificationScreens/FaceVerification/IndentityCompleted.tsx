import React, { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import ButtonComponent from '../../../ui/ButtonComponent'
import type { UserData } from '@/types/userdata'
import { getFromSession } from '@/components/Extras/utils/imageProcessing'

type IndentityCompletedProps = {
  getButtonText: () => string
  handleContinue: () => void
  userData: UserData
  handleRetake: () => void
}

export default function IndentityCompleted({ getButtonText, handleContinue, handleRetake, userData }: IndentityCompletedProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState<string>('')

  useEffect(() => {
    setCapturedImage(getFromSession())
    const now = new Date()
    setTimestamp(now.toLocaleTimeString('en-US', { hour12: false }))
  }, [])

  return (
    <div className="h-full w-full flex flex-col items-center px-6 py-8">
      {/* Success Icon */}
      <div className="w-16 h-16 bg-green-100 border border-green-500 rounded-full flex items-center justify-center mb-6">
        <Check className="w-8 h-8 text-green-500" />
      </div>

      {/* Title and Description */}
      <h2 className="text-xl font-semibold text-text-primary mb-2">Verification Complete</h2>
      <p className="text-sm text-text-secondary text-center mb-6">
        Your identity has been successful verified.
        <br />
        You can now continue with your account.
      </p>

      {/* Profile Image */}
      <div className="w-24 h-24 rounded-full overflow-hidden border p-1 border-green-500 mb-6">
        {capturedImage ? (
          <img src={capturedImage} alt="Verified face" className="w-full rounded-full h-full object-cover" />
        ) : (
          <img
            src="/svg/greetingbar/avtar.svg"
            alt="Verified face"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Verification Details Card */}
      <div className="w-full bg-white border border-gray-200 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">Status</p>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-500" />
            <p className="text-sm font-medium text-green-600">Verified</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">Confidence</p>
          <p className="text-sm font-medium text-text-primary">95%</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">Timestamp</p>
          <p className="text-sm font-medium text-text-primary">{timestamp || '15:40:12'}</p>
        </div>
      </div>

      {/* Button */}
      <div className='fixed bottom-[5vw] left-0 right-0 space-y-2 px-4'>

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
