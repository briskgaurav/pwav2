'use client'

import { Checkbox } from '@/components/ui'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import { Info } from 'lucide-react'

export interface AddNewCardFormValues {
    cardNumber: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    saveCard: boolean
}

export interface AddNewCardFormProps {
    /** Optional initial values */
    initialValues?: Partial<AddNewCardFormValues>
    /** Called on any field change */
    onChange?: (values: AddNewCardFormValues) => void
}

export function AddNewCardForm({ initialValues, onChange }: AddNewCardFormProps) {
    const [values, setValues] = useState<AddNewCardFormValues>({
        cardNumber: initialValues?.cardNumber ?? '',
        expiryMonth: initialValues?.expiryMonth ?? '',
        expiryYear: initialValues?.expiryYear ?? '',
        cvv: initialValues?.cvv ?? '',
        saveCard: initialValues?.saveCard ?? true,
    })

    const visaIcon = useMemo(() => '/svg/visa.svg', [])

    const update = (patch: Partial<AddNewCardFormValues>) => {
        setValues((prev) => {
            const next = { ...prev, ...patch }
            onChange?.(next)
            return next
        })
    }

    const handleNumericInput = (value: string, field: keyof AddNewCardFormValues) => {
        const numericValue = value.replace(/[^0-9]/g, '')
        update({ [field]: numericValue })
    }

    return (
        <div className='border border-border rounded-2xl p-4 space-y-4'>
            <p className='text-text-primary text-sm font-medium'>
                Enter details of your Prepaid, Debit or Credit Card
            </p>

            <div className='space-y-2'>
                <p className='text-text-primary text-sm'>Enter card number</p>
                <div className='border border-border rounded-2xl px-4 py-3 flex items-center justify-between gap-3'>
                    <input
                        type='text'
                        inputMode='numeric'
                        value={values.cardNumber}
                        onChange={(e) => handleNumericInput(e.target.value, 'cardNumber')}
                        placeholder='4160 2102 0196 8963'
                        className='w-full bg-transparent text-text-primary text-sm !outline-none! focus:outline-none! focus:ring-none!'
                    />
                    <div className='w-8 h-4 relative shrink-0'>
                        <Image src={visaIcon} alt='VISA' width={40} height={24} className='object-contain' />
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <p className='text-text-primary ml-1 text-sm'>Valid Till</p>
                    <div className='flex gap-3'>
                        <div className='flex-1 border border-border rounded-2xl px-4 py-3'>
                            <input
                                type='text'
                                inputMode='numeric'
                                maxLength={2}
                                value={values.expiryMonth}
                                onChange={(e) => handleNumericInput(e.target.value, 'expiryMonth')}
                                placeholder='MM'
                                className='w-full bg-transparent text-text-primary text-sm text-center !outline-none! focus:outline-none! focus:ring-none!'
                            />
                        </div>
                        <div className='flex-1 border border-border rounded-2xl px-4 py-3'>
                            <input
                                type='text'
                                inputMode='numeric'
                                maxLength={2}
                                value={values.expiryYear}
                                onChange={(e) => handleNumericInput(e.target.value, 'expiryYear')}
                                placeholder='YY'
                                className='w-full bg-transparent text-text-primary text-sm text-center !outline-none! focus:outline-none! focus:ring-none!'
                            />
                        </div>
                    </div>
                </div>

                <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <p className='text-text-primary ml-1 text-sm'>CVV</p>
                     
                    </div>
                    <div className='flex items-center gap-3'>
                        <input
                            type='password'
                            inputMode='numeric'
                            maxLength={3}
                            value={values.cvv}
                            onChange={(e) => handleNumericInput(e.target.value, 'cvv')}
                            placeholder='CVV'
                            className='w-full bg-transparent border border-border rounded-2xl px-4 py-3 text-text-primary text-sm text-center !outline-none! focus:outline-none! focus:ring-none!'
                        />
                           <button type='button' className='w-8 h-8 flex items-center justify-center' aria-label='CVV info'>
                            <Info size={18} className='text-text-primary' />
                        </button>
                    </div>
                </div>
            </div>

            <Checkbox
                checked={values.saveCard}
                onChange={(checked) => update({ saveCard: checked })}
                label={'Save my card for future transactions.\nEncrypted and saved as per PCI DSS guidelines'}
            />
        </div>
    )
}
