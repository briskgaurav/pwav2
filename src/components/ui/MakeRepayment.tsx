'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, CreditCard } from 'lucide-react'
import gsap from 'gsap'
import Image from 'next/image'
import { Button } from './button'

type PaymentOption = 'full' | 'minimum' | 'other'

export default function MakeRepayment() {
    const [selectedOption, setSelectedOption] = useState<PaymentOption>('full')
    const [amounts, setAmounts] = useState({
        full: '625,000',
        minimum: '62,500',
        other: ''
    })

    const fullFieldsRef = useRef<HTMLDivElement>(null)
    const minimumFieldsRef = useRef<HTMLDivElement>(null)
    const otherFieldsRef = useRef<HTMLDivElement>(null)

    const getFieldsRef = (option: PaymentOption) => {
        switch (option) {
            case 'full': return fullFieldsRef
            case 'minimum': return minimumFieldsRef
            case 'other': return otherFieldsRef
        }
    }

    const animateFields = (option: PaymentOption) => {
        const allOptions: PaymentOption[] = ['full', 'minimum', 'other']

        allOptions.forEach((opt) => {
            const ref = getFieldsRef(opt)
            if (!ref.current) return

            const isSelected = opt === option
            const children = ref.current.querySelectorAll('.field-item')

            if (isSelected) {
                // Show animation
                gsap.set(ref.current, { display: 'block', overflow: 'hidden' })

                const tl = gsap.timeline()

                tl.fromTo(ref.current,
                    { height: 0, opacity: 0 },
                    {
                        height: 'auto',
                        opacity: 1,
                        duration: 0.4,
                        ease: 'power3.out'
                    }
                )

                tl.fromTo(children,
                    { y: -20, opacity: 0, scale: 0.95 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.35,
                        stagger: 0.08,
                        ease: 'back.out(1.2)'
                    },
                    '-=0.2'
                )
            } else {
                // Hide animation
                const tl = gsap.timeline({
                    onComplete: () => {
                        if (ref.current) {
                            gsap.set(ref.current, { display: 'none' })
                        }
                    }
                })

                tl.to(children, {
                    y: -10,
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.2,
                    stagger: 0.03,
                    ease: 'power2.in'
                })

                tl.to(ref.current, {
                    height: 0,
                    opacity: 0,
                    duration: 0.25,
                    ease: 'power3.in'
                }, '-=0.1')
            }
        })
    }

    useEffect(() => {
        // Initialize - hide non-selected fields
        const allOptions: PaymentOption[] = ['full', 'minimum', 'other']
        allOptions.forEach((opt) => {
            const ref = getFieldsRef(opt)
            if (ref.current) {
                if (opt === selectedOption) {
                    gsap.set(ref.current, { display: 'block', height: 'auto', opacity: 1 })
                } else {
                    gsap.set(ref.current, { display: 'none', height: 0, opacity: 0 })
                }
            }
        })
    }, [])

    const handleOptionSelect = (option: PaymentOption) => {
        if (option === selectedOption) return
        animateFields(option)
        setSelectedOption(option)
    }

    const handleAmountChange = (option: PaymentOption, value: string) => {
        setAmounts(prev => ({ ...prev, [option]: value }))
    }

    const renderRadioButton = (isSelected: boolean) => (
        <span className={`w-5 h-5 rounded-full border-2 flex  border-text-primary items-center justify-center transition-all duration-300 ${isSelected ? ' bg-transparent' : ' bg-transparent'}`}>
            {isSelected && (
                <span className='w-3 h-3 rounded-full bg-orange' />
            )}
        </span>
    )

    const renderFields = (option: PaymentOption, ref: React.RefObject<HTMLDivElement | null>) => (
        <div
            ref={ref}
            className='overflow-hidden'
        >
            <div className='space-y-3 pt-3'>
                <div className='field-item flex items-center justify-between border border-border rounded-lg px-4 py-3 cursor-pointer hover:border-primary/50 transition-colors'>
                    <span className='text-sm text-text-secondary'>Select Bank Acount</span>
                    <ChevronDown className='w-4 h-4 text-text-secondary' />
                </div>
                <input
                    type='text'
                    autoComplete="one-time-code"
                    placeholder='Enter Amount'
                    value={amounts[option]}
                    onChange={(e) => handleAmountChange(option, e.target.value)}
                    className='field-item w-full border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary !outline-none! focus:outline-none! focus:ring-none! transition-colors'
                />
            </div>
        </div>
    )

    return (
        <div className='p-5 border border-border rounded-2xl space-y-4'>
            <div className='flex items-center gap-4'>
                <div className='w-5 h-5 flex items-center justify-center shrink-0'>
                    <Image
                        src='/svg/addcard.svg'
                        alt='bank'
                        width={20}
                        height={20}
                        className='object-contain size-full'
                    />
                </div>
                <p className='text-text-primary text-md font-medium'>Make Repayment</p>
            </div>

            {/* Pay Full Outstanding Amount */}
            <div>
                <button
                    onClick={() => handleOptionSelect('full')}
                    className='flex items-center gap-3 w-full text-left'
                >
                    {renderRadioButton(selectedOption === 'full')}
                    <span className='text-sm text-text-primary'>Pay Full Outstanding Amount</span>
                </button>
                {renderFields('full', fullFieldsRef)}
            </div>

            {/* Pay Minimum Due Amount */}
            <div>
                <button
                    onClick={() => handleOptionSelect('minimum')}
                    className='flex items-center gap-3 w-full text-left'
                >
                    {renderRadioButton(selectedOption === 'minimum')}
                    <span className='text-sm text-text-primary'>Pay Minimum Due Amount</span>
                </button>
                {renderFields('minimum', minimumFieldsRef)}
            </div>

            {/* Pay other Amount for Repayment */}
            <div>
                <button
                    onClick={() => handleOptionSelect('other')}
                    className='flex items-center gap-3 w-full text-left'
                >
                    {renderRadioButton(selectedOption === 'other')}
                    <span className='text-sm text-text-primary'>Pay other Amount for Repayment</span>
                </button>
                {renderFields('other', otherFieldsRef)}
            </div>

            {/* Pay Now Button */}
            <Button variant='primary' size='lg' fullWidth>
                Pay Now
            </Button>
        </div>
    )
}
