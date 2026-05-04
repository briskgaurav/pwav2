import React, { useState } from 'react'

import Image from 'next/image'

import { Sun, Eye, Camera } from 'lucide-react'

import ButtonComponent from '../../../ui/ButtonComponent'

export default function Introduction({ getButtonText, handleContinue }: { getButtonText: () => string, handleContinue: () => void }) {
  const [isImageLoading, setIsImageLoading] = useState(true)

  return (
    <div className="h-full text-sm bg-white space-y-8 flex w-full flex-col overflow-hidden" style={{ backgroundColor: '#FFFFFF', minHeight: '100%' }}>
      <div className='w-[50vw] mx-auto h-auto pt-10 relative'>
        {/* Loading indicator */}
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <Image
          src='/svg/face.svg'
          alt='Introduction'
          width={100}
          height={100}
          className={`h-full w-full object-contain transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsImageLoading(false)}
        />
      </div>

      <div className='text-center'>
        <p className='text-text-primary text-xl mb-2  font-medium'>Verify your Identity</p>
        <p className='text-text-secondary '>Take a quick photo to confirm it's you.</p>
      </div>

      <div className='w-full px-[10%] space-y-4'>
        <ul className='space-y-4 mt-2 ml-1 text-left! w-full'>
          <li className='flex items-center gap-2'>
            <span className='bg-light-gray rounded-full p-2'><Eye className='w-4 text-text-primary h-4' /></span>
            Good lighting on your face</li>
          <li className='flex items-center gap-2'><span className='bg-light-gray rounded-full p-2'><Sun className='w-4 text-text-primary h-4' /></span>Face clearly visible</li>
          <li className='flex items-center gap-2'><span className='bg-light-gray rounded-full p-2'><Camera className='w-4 text-text-primary h-4' /></span>No sunglasses or hats</li>
        </ul>
      </div>

      {/* Continue Button */}
      <ButtonComponent title={getButtonText()} onClick={handleContinue} />
    </div>
  )
}
