'use client'

import { InstacardColors } from '@/constants/colors'
import { haptic } from '@/lib/useHaptics'
import { X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Draggable from 'gsap/dist/Draggable'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'

// Register GSAP plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(Draggable)
}

interface AddSigmaCardModalProps {
    visible: boolean
    onClose: () => void
    onSubmit?: (cardNumber: string) => void
}

export default function AddSigmaCardModal({ visible, onClose, onSubmit }: AddSigmaCardModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const handleRef = useRef<HTMLDivElement>(null)
    const draggableRef = useRef<Draggable[]>([])
    const [cardNumber, setCardNumber] = useState('')
    const router = useRouter()
    const formatCardNumber = (value: string) => {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '')
        // Add space every 4 digits
        const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ')
        return formatted.slice(0, 19) // Max 16 digits + 3 spaces
    }

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value)
        setCardNumber(formatted)
    }

    const handleClose = useCallback(() => {
        if (modalRef.current && backdropRef.current) {
            gsap.to(backdropRef.current, {
                opacity: 0,
                duration: 0.25,
                ease: 'power2.in'
            })
            gsap.to(modalRef.current, {
                y: '100%',
                duration: 0.3,
                ease: 'power3.in',
                onComplete: onClose
            })
        } else {
            onClose()
        }
    }, [onClose])

    const handleSubmit = () => {
        if (cardNumber.replace(/\s/g, '').length === 16) {
            haptic('success')
            onSubmit?.(cardNumber)
           router.push(routes.faceVerification)
        }
    }

    const initDraggable = useCallback(() => {
        if (modalRef.current && handleRef.current) {
            const modalHeight = modalRef.current.offsetHeight
            const threshold = modalHeight * 0.3 // 30% threshold to close

            draggableRef.current = Draggable.create(modalRef.current, {
                type: 'y',
                trigger: handleRef.current,
                bounds: { minY: 0, maxY: window.innerHeight },
                inertia: true,
                onDragEnd: function () {
                    const endY = this.endY || this.y
                    if (endY > threshold) {
                        handleClose()
                    } else {
                        gsap.to(modalRef.current, {
                            y: 0,
                            duration: 0.3,
                            ease: 'power3.out'
                        })
                    }
                }
            })
        }
    }, [handleClose])

    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden'

            // Animate modal in from bottom
            if (modalRef.current && backdropRef.current) {
                gsap.fromTo(
                    backdropRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: 'power2.out' }
                )
                gsap.fromTo(
                    modalRef.current,
                    { y: '100%' },
                    { y: '0%', duration: 0.4, ease: 'power3.out', onComplete: initDraggable }
                )
            }
        } else {
            document.body.style.overflow = 'unset'
            // Kill draggable when not visible
            if (draggableRef.current.length > 0) {
                draggableRef.current.forEach(d => d.kill())
                draggableRef.current = []
            }
        }
        return () => {
            document.body.style.overflow = 'unset'
            if (draggableRef.current.length > 0) {
                draggableRef.current.forEach(d => d.kill())
                draggableRef.current = []
            }
        }
    }, [initDraggable, visible])

    useEffect(() => {
        // Reset card number when modal closes
        if (!visible) {
            setCardNumber('')
        }
    }, [visible])

    if (!visible) return null

    const isValidCardNumber = cardNumber.replace(/\s/g, '').length === 16

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div ref={backdropRef} className="absolute inset-0 bg-black/20" onClick={handleClose} />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full bg-white border border-gray-200 rounded-t-[28px] overflow-hidden"
                style={{ backgroundColor: InstacardColors.white }}
            >
                {/* Handle Indicator (Draggable trigger) */}
                <div ref={handleRef} className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                    <div className="w-[42px] h-[5px] rounded-full bg-gray-300" />
                </div>

                {/* Close Button */}
                <button
                    onClick={() => {
                        haptic('light')
                        handleClose()
                    }}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center"
                    aria-label="Close"
                >
                    <X size={24} color={InstacardColors.textPrimary} />
                </button>

                {/* Content */}
                <div className="px-5 pb-6 pt-4">
                    {/* Title */}
                    <p className="text-sm font-medium leading-6 pr-8" style={{ color: InstacardColors.textPrimary }}>
                        Enter the Physical Card number that you want to link to this Virtual Instacard
                    </p>

                    {/* Label */}
                    <p className="text-sm my-4" style={{ color: InstacardColors.textPrimary }}>
                        Universal / Sigma Instacard Number
                    </p>

                    {/* Card Number Input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="0000 0000 0000 0000"
                            className="w-full p-4 text-lg border border-text-primary/20 rounded-2xl !outline-none! focus:outline-none! focus:ring-none!  focus:ring-primary/30"
                            style={{ color: InstacardColors.textPrimary }}
                            inputMode="numeric"
                        />
                        <div className="absolute right-4 p-3 top-1/2 -translate-y-1/2">
                            <Image
                                src="/svg/mastercard.svg"
                                alt="Mastercard"
                                width={40}
                                height={30}
                                className="object-contain h-full w-auto"
                            />
                        </div>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!isValidCardNumber}
                        className={`w-full mt-6 p-4 rounded-full text-white text-base font-medium transition-all ${isValidCardNumber
                                ? 'bg-primary'
                                : 'bg-primary/50 cursor-not-allowed'
                            }`}
                    >
                        Next
                    </button>
                </div>

                {/* Safe area padding */}
                <div className="h-[env(safe-area-inset-bottom,24px)]" />
            </div>
        </div>
    )
}
