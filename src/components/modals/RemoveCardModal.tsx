'use client'

import { InstacardColors } from '@/constants/colors'
import { haptic } from '@/lib/useHaptics'
import { notifyUserCancelled } from '@/lib/bridge'
import React, { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useRouter } from 'next/navigation'

interface RemoveCardModalProps {
    visible: boolean
    onClose: () => void
    onConfirm: () => void
}

export default function RemoveCardModal({ visible, onClose, onConfirm }: RemoveCardModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const handleClose = useCallback(() => {
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
                onComplete: onClose
            })
        } else {
            onClose()
        }
    }, [onClose])

    const handleRemove = useCallback(() => {
        haptic('warning')
        onConfirm()
        notifyUserCancelled()
    }, [onConfirm, router])

    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden'

            // Animate modal in with scale
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop */}
            <div ref={backdropRef} className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-sm bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl overflow-hidden shadow-xl"
            >
                {/* Content */}
                <div className="px-10 py-8">
                    {/* Warning Message */}
                    <p className="text-sm text-center leading-[1.2] mb-8" style={{ color: InstacardColors.textPrimary }}>
                        This will permanently Delete this Card.{' '}
                        Are you sure you want to permanently remove his Card
                    </p>

                    {/* Remove Button */}
                    <button
                        onClick={handleRemove}
                        className="w-full px-4 py-3 rounded-full text-white text-sm  bg-red-500 hover:bg-red-600 transition-colors"
                    >
                        Remove Card Permanently
                    </button>

                    {/* Cancel Button */}
                    <button
                        onClick={() => {
                            haptic('light')
                            handleClose()
                        }}
                        className="w-full mt-2 px-4 py-3 rounded-full text-sm  border border-text-primary/40 transition-colors"
                        style={{ color: InstacardColors.textPrimary }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
