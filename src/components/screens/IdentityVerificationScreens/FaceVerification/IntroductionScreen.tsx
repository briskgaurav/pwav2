import React from 'react'
import { User, Sun, Eye, Camera } from 'lucide-react'
import ButtonComponent from '../../../ui/ButtonComponent'
import Image from 'next/image'

export default function Introduction({ getButtonText, handleContinue }: { getButtonText: () => string, handleContinue: () => void }) {
  return (
    <div className="h-full text-sm bg-white space-y-8 flex w-full flex-col overflow-hidden">
      <div className='w-[50vw] mx-auto h-auto pt-10 '>
        <Image src='/svg/face.svg' alt='Introduction' width={100} height={100} className='h-full w-full object-contain' />
      </div>

      <div className='text-center'>
        <p className='text-text-primary  font-medium'>Verify your Identity</p>
        <p className='text-text-secondary '>Take a quick photo to confirm it’s you.</p>
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
