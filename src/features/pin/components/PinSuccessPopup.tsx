'use client'

import { SheetContainer, Button } from '@/components/ui'
import Image from 'next/image'

type PinSuccessPopupProps = {
  title: string
  description: string
  buttonText: string
  onButtonClick: () => void
}

export default function PinSuccessPopup({
  title,
  description,
  buttonText,
  onButtonClick,
}: PinSuccessPopupProps) {
  return (
    <div className="h-screen flex flex-col">
      <SheetContainer>
        <div className="flex-1 flex flex-col items-start h-full justify-center p-6 py-10 gap-10 text-center">
          {/* Success checkmark animation */}
          <div className="w-full flex  relative flex-col items-center justify-start animate-scale-in">
            <Image
              src={'/img/success.png'}
              alt="Success"
              width={200}
              height={200}
              className="w-[120px] h-auto  object-contain"
            />
          </div>
          <div className="w-full bg-white/60 backdrop-blur-xl rounded-2xl border-text-secondary/20 space-y-4 py-6 z-5 relative border p-4  text-center mt-4">
            <p className="text-lg font-semibold text-text-primary">
              {title}
            </p>
            <p className="text-sm text-text-secondary mt-2">
              {description}
            </p>
          </div>
        </div>
        <div className="p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
          <Button fullWidth onClick={onButtonClick}>
            {buttonText}
          </Button>
        </div>
      </SheetContainer>
    </div>
  )
}
