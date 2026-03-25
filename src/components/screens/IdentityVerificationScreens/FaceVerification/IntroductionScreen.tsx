import React from 'react'
import { User, Sun, Eye, Camera } from 'lucide-react'
import ButtonComponent from '../../components/ui/ButtonComponent'
import Image from 'next/image'

export default function Introduction({ getButtonText, handleContinue }: { getButtonText: () => string, handleContinue: () => void }) {
  return (
    <div className="h-full text-sm bg-white space-y-8 flex w-full flex-col overflow-hidden">
      <div className='w-[50vw] mx-auto h-auto pt-10 '>
        <Image src='/svg/intro.svg' alt='Introduction' width={100} height={100} className='h-full w-full object-contain' />
      </div>

      <div className='text-center'>
        <p className='text-text-primary  font-medium'>Quick Face Verification</p>
        <p className='text-text-secondary '>Take a quick photo to confirm it's you</p>
      </div>

      <div className='w-full px-[10%] space-y-4'>
        <p className='w-full font-medium' >Before we start, please ensure:</p>
        <ul className='space-y-2 mt-2 ml-1 text-left! w-full'>
          <li className='flex items-center gap-2'><Eye  className='w-4 text-primary h-4' />Your face is visible and well-lit</li>
          <li className='flex items-center gap-2'><Sun  className='w-4 text-primary h-4' />Your face is clear and well-lit</li>
          <li className='flex items-center gap-2'><Camera  className='w-4 text-primary h-4' />Your face is clear and well-lit</li>
        </ul>
      </div>

      {/* Continue Button */}
      <ButtonComponent title={getButtonText()} onClick={handleContinue} />
    </div>
  )
}
