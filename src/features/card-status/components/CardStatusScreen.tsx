'use client'

import { Button, SheetContainer } from '@/components/ui'
import Image from 'next/image'
import React, { useState } from 'react'

export default function CardStatusScreen() {
  const [isUnblocked, setIsUnblocked] = useState(true)
  const [showBlockModal, setShowBlockModal] = useState(false)

  const handleToggle = () => {
    if (isUnblocked) {
      setShowBlockModal(true)
    } else {
      setIsUnblocked(true)
    }
  }

  const confirmBlock = () => {
    setIsUnblocked(false)
    setShowBlockModal(false)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* <Header title="Card Status" showBackButton /> */}

      <SheetContainer>
        <div className="flex-1 overflow-auto pb-10 p-4 space-y-4 ">
          <div className="flex items-center pt-5 justify-center ">
            <Image
              src={'/img/frontside.png'}
              alt="Debit Card Front"
              width={340}
              height={215}
              className="w-[340px] h-[215px] object-contain"
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-300 rounded-xl bg-white">
            <span className="text-text-primary font-medium">Card Status</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm block font-medium `}>
                {isUnblocked ? 'Unblocked' : 'Blocked'}
              </span>
              <button
                onClick={handleToggle}
                type="button"
                className={`relative w-12 h-6 rounded-full border border-text-primary/10 transition-colors duration-200 g-primary/30'}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-primary rounded-full shadow transition-transform duration-200 ${
                    isUnblocked ? '-translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </SheetContainer>

      {/* Block Confirmation Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 flex items-center bg-black/20 backdrop-blur-xs justify-center z-50">
          <div className="bg-white/80 w-full backdrop-blur-xl rounded-2xl p-6 border border-text-primary/20 mx-4  space-y-4">
            <p className="text-center text-text-primary text-sm mb-10 font-medium">
              Are you sure you want to block this Card?
            </p>
            <div className="flex flex-col space-y-3 w-full">
              <Button
                onClick={confirmBlock}
                variant="error"
                className="w-full bg-error text-white rounded-full py-3"
              >
                OK
              </Button>
              <Button
                onClick={() => setShowBlockModal(false)}
                variant="secondary"
                className="w-full border border-black text-gray-800 rounded-full py-3"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

