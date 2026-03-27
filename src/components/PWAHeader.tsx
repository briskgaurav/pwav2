'use client'
import { ChevronLeft, Menu } from 'lucide-react'
import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useRouter, usePathname } from 'next/navigation'
import { usePWAHeader } from '@/lib/pwa-header-context'
import { useAppDispatch } from '@/store/redux/hooks'
import { openAccessDrawer } from '@/store/redux/slices/accessDrawerSlice'
import Image from 'next/image'

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
        if (pathname === '/instacard') {
            router.push('/')
        } else {
            router.back()
        }
    }

    return (
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
    )
}
