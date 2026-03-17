import { useAuth } from '@/lib/auth-context'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { BlockUnblockIcon, ICONS, LimitationsIcon, PinIcon } from '@/constants/icons'

type CardMockupProps = {
    isclickable?: boolean
    imageSrc?: string
    maskedNumber?: string
    showActions?: boolean
    numberSize?: string
    showNumber?: boolean
}

export default function CardMockup({
    isclickable = true,
    imageSrc = '/img/frontside.png',
    maskedNumber = '0000 0000 0000 0000',
    showActions = false,
    numberSize = 'text-2xl',
    showNumber = true,
}: CardMockupProps) {
    const { isDarkMode } = useAuth()
    const [isImageLoading, setIsImageLoading] = useState(true)

    const renderCardImage = () => (
        <div className="relative w-full rounded-[5vw]  overflow-hidden" >
            {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center  rounded-lg">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                </div>
            )}
            <Image
                src={imageSrc}
                alt="Debit Card Front"
                width={340}
                height={215}
                className={`w-full h-full object-contain  transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsImageLoading(false)}
            />
            {!isImageLoading && showNumber && (
                <p className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#fff] ${numberSize} w-full text-center select-none`}>
                    {maskedNumber}
                </p>
            )}
        </div>
    )

    return (
        <div className='relative'>
            {isclickable ? (
                <Link href={'/make-online-payments'} className="flex relative items-center pt-5 justify-center">
                    {renderCardImage()}
                </Link>
            ) : (
                <div className="flex relative items-center pt-5 justify-center">
                    {renderCardImage()}
                </div>
            )}
            {isclickable && <p className='text-text-primary text-center text-xs mt-2'><span className='font-medium'>Tap</span> to make online payments</p>}
            {
                showActions && (
                    <div className='w-full  flex items-start justify-between pt-6 px-5  h-fit '>

                        {[
                            { icon: <LimitationsIcon />, title: 'Limit Setting', href: '/limit-setting' },
                            { icon: <PinIcon />, title: 'PIN Change', href: '/pin-change' },
                            { icon: <BlockUnblockIcon />, title: 'Block/Unblock Card', href: '/card-status' },
                        ].map((item, index) => (
                            <Link href={item.href} key={index} className='aspect-square shrink-0 flex flex-col gap-2 items-center justify-center  '>
                                <div className='w-16 h-16 p-4.5 flex items-center rounded-full text-text-primary justify-center aspect-square bg-background2'>
                                    {item.icon}
                                </div>
                                <p className='text-text-primary max-w-[70px] leading-[1.2] text-[12px]  w-full text-center '>{item.title}</p>
                            </Link>
                        ))}

                    </div>
                )}
        </div>
    )
}
