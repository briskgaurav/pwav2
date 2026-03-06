'use client'
import { ChevronLeft, LogOut, X } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useIsWebView } from '@/hooks/use-is-webview'
import { useRouter, usePathname } from 'next/navigation'
import { usePWAHeader } from '@/lib/pwa-header-context'
import Link from 'next/link'

interface PWAHeaderProps {
    title?: string

}

interface ConfirmDialogProps {
    visible: boolean
    message: string
    onCancel: () => void

    onConfirm: () => void
}

function ConfirmDialog({ visible, message, onCancel, onConfirm }: ConfirmDialogProps) {
    const backdropRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    const handleHome = () => {
        onConfirm()
    }

    const handleInstacard = () => {
        onConfirm()
    }

    const handleClose = () => {
        if (modalRef.current && backdropRef.current) {
            gsap.to(backdropRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in'
            })
            gsap.to(modalRef.current, {
                scale: 0.9,
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: onCancel
            })
        } else {
            onCancel()
        }
    }

    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden'

            if (modalRef.current && backdropRef.current) {
                gsap.fromTo(
                    backdropRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.25, ease: 'power2.out' }
                )
                gsap.fromTo(
                    modalRef.current,
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' }
                )
            }
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [visible])

    if (!visible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <div
                ref={backdropRef}
                className="absolute inset-0 bg-black/70"
                onClick={handleClose}
            />
            <div
                ref={modalRef}
                className="bg-white rounded-3xl p-6 pt-10 w-full max-w-[320px] flex flex-col items-center relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center"
                    onClick={handleClose}
                >
                    <X width={20} height={20} color="#6B7280" />
                </button>
                <p className="text-base text-text-primary mb-8 text-center px-8">
                    {message}
                </p>
                <div className="flex flex-row gap-3 w-full">
                    <Link
                        href="/"
                        className="flex-1 rounded-2xl py-4 px-3 flex items-center justify-center gap-2 bg-primary"
                        onClick={handleInstacard}
                        aria-label="Go to Instacard"
                    >
                        <span className="text-base font-semibold text-white">Instacard</span>
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 rounded-2xl py-4 px-3 flex items-center justify-center gap-2 bg-primary"
                        onClick={handleHome}
                        aria-label="Go to Home"
                    >
                        <span className="text-base font-semibold text-white">Home</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function PWAHeader({ title: titleProp, }: PWAHeaderProps) {
    const [showDialog, setShowDialog] = useState(false)
    const isWebView = useIsWebView()
    const router = useRouter()
    const pathname = usePathname()
    const { title: contextTitle, exitIcon: contextExitIcon } = usePWAHeader()
    const title = titleProp ?? contextTitle
    const exitIcon = pathname === '/' ? false : true
    const titleRef = useRef<HTMLParagraphElement>(null)
    const [displayedTitle, setDisplayedTitle] = useState(pathname === '/' ? 'Instacard' : (pathname.split('/').pop() || '').replace(/-/g, ' '))

    const currentTitle = pathname === '/' ? 'Instacard' : (pathname.split('/').pop() || '').replace(/-/g, ' ')

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

    const handleLogoutClick = () => {
        setShowDialog(true)
    }

    const handleDialogCancel = () => {
        setShowDialog(false)
    }

    const handleDialogConfirm = () => {
        setShowDialog(false)
    }

    const handleGoBack = () => {
        router.back()
    }

    // Only render the header if NOT running in a webview (i.e., opened as a website)
    if (isWebView) {
        return null
    }

    return (
        <>
            <div className='h-fit py-6 text-white relative z-800 flex items-center gap-2 justify-between px-4 w-full bg-primary'>

                <button onClick={handleGoBack} className='h-fit w-fit rounded-full' aria-label="Go back">
                    <ChevronLeft
                        size={24}
                        color='white'
                        className='h-full w-full object-contain'
                    />
                </button>

                <p ref={titleRef} className='text-md absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[#ffffff] capitalize'>{displayedTitle}</p>

                <button
                    onClick={handleLogoutClick}
                    aria-label="Go home"
                    className={`h-6 duration-300 transition-all w-6 ${exitIcon ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <LogOut width={24} height={24} color='white' />
                </button>

            </div>

            <ConfirmDialog
                visible={showDialog}
                message="Where would you like to go?"
                onCancel={handleDialogCancel}
                onConfirm={handleDialogConfirm}
            />
        </>
    )
}