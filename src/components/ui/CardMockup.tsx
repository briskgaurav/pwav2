import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type CardMockupProps = {
    isclickable?: boolean
    imageSrc?: string
    maskedNumber?: string
    showActions?: boolean
}

export default function CardMockup({
    isclickable = true,
    imageSrc = '/img/frontside.png',
    maskedNumber = '0000 0000 0000 0000',
    showActions = false,

}: CardMockupProps) {
    return (
        <div className='relative'>
            {isclickable ? <Link href={'/make-online-payments'} className="flex relative items-center pt-5 justify-center">
                <Image src={imageSrc} alt="Debit Card Front" width={340} height={215} className="w-full h-auto object-contain" />
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl w-full text-center select-none">
                    {maskedNumber}
                    </p>
                </Link> : <div className="flex relative items-center pt-5 justify-center">
                    <Image src={imageSrc} alt="Debit Card Front" width={340} height={215} className="w-full h-auto object-contain" />
                    <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl w-full text-center select-none">
                        {maskedNumber}
                    </p>
                </div>}
                {isclickable && <p className='text-text-primary text-center text-xs mt-2'><span className='font-medium'>Tap</span> to make online payments</p>}
            {
                showActions && (
                    <div className='w-full  flex items-start justify-between pt-6 px-5  h-fit '>

                        {[
                            { icon: '/svg/limitations.svg', title: 'Limit Setting', href: '/limit-setting' },
                            { icon: '/svg/pin.svg', title: 'PIN Change', href: '/pin-change' },
                            { icon: '/svg/block-unblock.svg', title: 'Block/Unblock Card', href: '/card-status' },
                        ].map((item, index) => (
                            <Link href={item.href} key={index} className='aspect-square shrink-0 flex flex-col gap-2 items-center justify-center  '>
                                <div className='w-16 h-16 p-4.5 flex items-center rounded-full justify-center aspect-square bg-background2'>
                                    <Image src={item.icon} alt={item.title} className='h-full w-full object-contain' width={20} height={20} />
                                </div>
                                <p className='text-text-primary max-w-[70px] leading-[1.2] text-[12px]  w-full text-center '>{item.title}</p>
                            </Link>
                        ))}

                    </div>
                )}
        </div>
    )
}
