'use client'

import { InstacardColors } from '@/constants/colors'
import { X, CreditCard } from 'lucide-react'
import React, { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import Draggable from 'gsap/dist/Draggable'

// Register GSAP plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(Draggable)
}

export type FAQData = {
    heading: string
    bulletPoints: string[]
}

export const DEFAULT_FAQ_DATA: FAQData = {
    heading: 'Link to a Physical Card',
    bulletPoints: [
        'You can purchase a Universal Card or a Sigma card from your Bank or any Agent, Marketplace or order online.',
        'Universal Card or Sigma Card offer unified card experience such that you can link any Virtual Instacard to them to start using the virtual Instacard on any POS/ATM through the linked Universal or Sigma Instacard.',
        'Sigma Card is a physical card variant of Instacard that is issued by a Bank/ FinTech to allow users to link any Virtual Instacard issued by them for making Domestic as well as International payments.',
        'Universal Card is another physical card variant of Instacard that users can link any virtual Instacard issued by any Bank/ FinTech in your country for making Domestic Payments through a single Physical Card.',
        'You can simply link any one Virtual Instacard to a Universal or Sigma Cards to start using the linked Virtual Instacard from the physical card. When you link a new Virtual Instacard to a Universal or Sigma card, previously linked Virtual Instacard is de-linked and you can start using the newly linked Virtual Card from the physical Universal / Sigma card.',
    ],
}

interface FAQModalProps {
    visible: boolean;
    onClose: () => void;
    data?: FAQData;
}

export default function FAQModal({ visible, onClose, data = DEFAULT_FAQ_DATA }: FAQModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const handleRef = useRef<HTMLDivElement>(null)
    const draggableRef = useRef<Draggable[]>([])

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

    if (!visible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div ref={backdropRef} className="absolute inset-0 bg-black/20" onClick={handleClose} />
            
            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-h-[75vh] bg-white border border-gray-200 rounded-t-[28px] overflow-hidden"
                style={{ backgroundColor: InstacardColors.white }}
            >
                {/* Handle Indicator (Draggable trigger) */}
                <div ref={handleRef} className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                    <div className="w-[42px] h-[5px] rounded-full bg-gray-300" />
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(75vh-40px)] px-5 pb-6">
                    {/* Header */}
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center flex-1 gap-3">
                            <div className="w-9 h-9 flex items-center justify-center">
                                <CreditCard size={30} color={InstacardColors.textPrimary} />
                            </div>
                            <p className="text-sm font-normal flex-1 leading-5" style={{ color: InstacardColors.textPrimary }}>
                                {data.heading}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 flex items-center justify-center font-semibold"
                            aria-label="Close"
                        >
                            <X size={20} color={InstacardColors.textSecondary} />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-200 my-4" />

                    {/* Bullet Points */}
                    <div className="space-y-5">
                        {data.bulletPoints.map((point: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                                <span className="text-[22px] -translate-y-2" style={{ color: InstacardColors.textPrimary }}>•</span>
                                <p className="text-sm leading-4 flex-1" style={{ color: InstacardColors.textPrimary }}>{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}