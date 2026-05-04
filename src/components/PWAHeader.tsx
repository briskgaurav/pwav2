'use client'
import React, { useRef, useEffect, useState } from 'react'

import Image from 'next/image'
import { useRouter, usePathname  } from 'next/navigation'

import gsap from 'gsap'
import { ChevronLeft, Menu, XIcon } from 'lucide-react'


import { usePWAHeader } from '@/lib/pwa-header-context'
import { useAppDispatch } from '@/store/redux/hooks'
import { openAccessDrawer } from '@/store/redux/slices/accessDrawerSlice'


export default function PWAHeader() {
    const router = useRouter()
    const pathname = usePathname()
    const { title: contextTitle } = usePWAHeader()
    const dispatch = useAppDispatch()
    const handleOpenAccessDrawer = () => dispatch(openAccessDrawer())

    const showMenuIcon = pathname !== '/'
    const titleRef = useRef<HTMLParagraphElement>(null)
    const currentTitle = pathname === '/' || pathname === '/instacard'
        ? 'Instacard'
        : (pathname.split('/').pop() || '').replace(/-/g, ' ')
    const [displayedTitle, setDisplayedTitle] = useState(currentTitle)
    const [showExitPopup, setShowExitPopup] = useState(false)

    const isIdentityVerificationRoute = pathname.startsWith('/identity-verification/')

    useEffect(() => {
        if (titleRef.current && displayedTitle !== currentTitle) {
            gsap.to(titleRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    setDisplayedTitle(currentTitle)
                    gsap.to(titleRef.current, {
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    })
                }
            })
        }
    }, [currentTitle, displayedTitle])

    const handleGoBack = () => {
        if (isIdentityVerificationRoute) {
            setShowExitPopup(true)
        } else if (pathname === '/instacard') {
            router.push('/')
        } else {
            router.back()
        }
    }

    const handleConfirmExit = () => {
        setShowExitPopup(false)
        router.push('/')
    }

    const handleCancelExit = () => {
        setShowExitPopup(false)
    }

    return (
        <>
            <div className='shrink-0 bg-primary' style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}>
                <div className='h-16 text-white relative flex items-center justify-between px-4 w-full'>
                    <button onClick={handleGoBack} className={`h-fit ${showMenuIcon ? 'opacity-100 flex' : 'opacity-0 hidden pointer-events-none'} w-fit rounded-full`} aria-label="Go back">
                        <ChevronLeft
                            size={24}
                            color='white'
                            className='h-full w-full object-contain'
                        />
                    </button>

                    <p ref={titleRef} className='text-sm absolute flex items-center gap-2 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[#fff] capitalize'>
                        <span className='block w-5 h-5'>
                            <Image src={'/img/instacard.png'} alt='Instacard Logo' width={40} height={40} className='h-full w-full object-contain' />
                        </span>
                        INSTACARD
                    </p>

                    <button
                        onClick={handleOpenAccessDrawer}
                        aria-label="Open menu"
                        className={`h-6 w-6 duration-300 transition-all ${showMenuIcon ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <Menu width={24} height={24} color='white' />
                    </button>
                </div>
            </div>

            {showExitPopup && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-black/12" onClick={handleCancelExit} aria-hidden />
                    <div role="dialog" aria-modal="true" className="relative text-center w-full max-w-sm rounded-2xl bg-white/45 backdrop-blur-sm border border-white/40 p-6 shadow-xl">
                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <div className='p-[1vw] border-2 border-[#EB001B] rounded-full w-fit aspect-square text-[#EB001B]'>
                                <XIcon />
                            </div>
                            <p className="text-lg text-text-primary">Exit Verification?</p>
                            <p className="mt-1 text-sm text-text-secondary">
                                Are you sure you want to exit the identity verification process? Your progress may be lost.
                            </p>
                            <div className="mt-5 w-full flex gap-3">
                                <button
                                    type="button"
                                    className="flex-1 rounded-full bg-white py-3 text-sm font-medium text-text-primary border border-border"
                                    onClick={handleCancelExit}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-white"
                                    onClick={handleConfirmExit}
                                >
                                    Exit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
