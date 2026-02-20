import React from 'react'
import { Button, SheetContainer } from '@/components/ui'
import Image from 'next/image'
import Link from 'next/link'
import { routes } from '@/lib/routes'

export default function LinkCardScreen() {
    return (
        <div className='h-screen flex flex-col'>
            <SheetContainer>
                <div className="flex-1 flex-col flex justify-start items-center overflow-auto py-10 space-y-4  p-6">
                    <p className="font-medium text-sm">Link this Virtual Instacard to a Physical Instacard</p>
                    <div className='h-auto w-full relative '>
                        <Image src='/img/creditcard.png' alt='Credit Card' width={1000} height={1000} className='h-full w-full object-contain' />
                        <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl w-full text-center'>0000 0000 0000 0000</p>
                    </div>

                    <p className='mt-4 text-sm'>You do not have any Physical Instacard available for linking to a Virtual Card issued by <strong>FCMB.</strong></p>
                    <p className='text-sm'> Enter the card number of a Universal or Sigma card that you have with you</p>

                    <div className='flex flex-col items-start justify-start w-full mt-4'>
                        <p className='text-sm text-left'>Universal / Sigma Instacard Number</p>
                        <div className='w-full mt-3 p-4  border border-text-primary/20 rounded-2xl flex items-center justify-between'>
                            <input autoComplete="one-time-code" type='number' placeholder='Sigma Card Number' className='flex-1 outline-none focus:outline-none active:outline-none focus:border-none active:border-none ring-0 focus:ring-none border-none bg-transparent text-text-primary focus-visible:ring-0! focus-visible:outline-none!  focus-visible:ring-offset-0' />
                            <Image src='/svg/mastercard.svg' alt='Mastercard' width={40} height={24} className='object-contain h-4 w-auto' />
                        </div>
                    </div>


                </div>
                <div className=" w-full p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
                    <Link href={routes.sigmaCardsOptions} className='bg-primary p-4 text-center text-white flex items-center justify-center  rounded-full w-full'>
                        Apply Now
                    </Link>
                </div>
            </SheetContainer>
        </div>
    )
}
