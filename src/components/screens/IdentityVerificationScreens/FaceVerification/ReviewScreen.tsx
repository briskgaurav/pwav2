'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { Check, ChevronLeft, XIcon } from 'lucide-react'

import { getFromSession } from '@/components/Extras/utils/imageProcessing'

type ReviewScreenProps = {
  getButtonText: () => string
  handleContinue: () => void
  handleRetake: () => void
  nameMatched: boolean
  livenessVerified: boolean
  bankName: string
  ninBvnName: string
}

export default function ReviewScreen({
  getButtonText,
  handleContinue,
  handleRetake,
  nameMatched,
  livenessVerified,
  bankName,
  ninBvnName,
}: ReviewScreenProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setCapturedImage(getFromSession())
  }, [])

  const popupType = useMemo(() => {
    if (!livenessVerified) return 'livenessFailed'
    return nameMatched ? 'success' : 'mismatch'
  }, [livenessVerified, nameMatched])

  const handleLooksGoodClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowPopup(true)
    }, 2000)
  }

  return (
    <div className="h-full w-full flex flex-col px-4 py-4">
      <div className="flex-1 flex flex-col">
        <div className='mb-4 flex items-center justify-between'>
          <span onClick={handleRetake} className='p-[1vw] bg-primary rounded-full'>
            <ChevronLeft size={20} className='text-[#ffff]' />
          </span>
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
          className="w-full py-4 rounded-full font-medium bg-primary text-white disabled:opacity-50"
          onClick={handleLooksGoodClick}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : getButtonText()}
        </button>

        <button
          type="button"
          className="w-full py-4 rounded-full font-medium bg-primary text-white"
          onClick={handleRetake}
          disabled={isLoading}
        >
          Retake Photo
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/12 " onClick={() => setShowPopup(false)} aria-hidden />
          <div role="dialog" aria-modal="true" className="relative text-center w-full max-w-sm rounded-2xl bg-white/45 backdrop-blur-sm border border-white/40 p-6 shadow-xl">
            {popupType === 'success' ? (
              <div className='flex flex-col gap-2 items-center justify-center'>
                <div className='p-[1vw] border-2 border-[#39D105] rounded-full w-fit aspect-square text-[#39D105]'>
                  <Check strokeWidth={2} />
                </div>
                <p className="text-lg text-text-primary">Verification Success</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Your liveness verification is successfully completed.
                </p>
                <div className="mt-5  w-full flex gap-3">
                
                  <button
                    type="button"
                    className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-white"
                    onClick={() => {
                      setShowPopup(false)
                      handleContinue()
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : popupType === 'mismatch' ? (
              <div className='flex flex-col gap-2 items-center justify-center'>
                <div className='p-[1vw] border-2 border-[#EB001B] rounded-full w-fit aspect-square text-[#EB001B]'>
                  <XIcon />
                </div>
                <p className="text-lg  text-text-primary">Name Mismatch</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Your name does not match the name on your bank record , but you can continue to verify your identity.
                </p>

                <div className="mt-5  w-full flex gap-3">

                  <button
                    type="button"
                    className="flex-1 rounded-full bg-white py-3 text-sm font-medium text-text-primary"
                    onClick={() => {
                      setShowPopup(false)
                      handleRetake()
                    }}
                  >
                    Retake Photo
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-white"
                    onClick={() => {
                      setShowPopup(false)
                      handleContinue()
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-2 items-center justify-center'>
                <div className='p-[1vw] border-2 border-[#EB001B] rounded-full w-fit aspect-square text-[#EB001B]'>
                  <XIcon />
                </div>
                <p className="text-lg text-text-primary">Liveness Verification Failed</p>
                <p className="mt-1 text-sm text-text-secondary">
                  We couldn&apos;t verify your liveness. Please try again.
                </p>

                <div className="mt-5 w-full flex gap-3">
                  <button
                    type="button"
                    className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-white"
                    onClick={() => {
                      setShowPopup(false)
                      handleRetake()
                    }}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
