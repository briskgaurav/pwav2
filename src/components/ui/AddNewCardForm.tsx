'use client'

import React, { useMemo, useState } from 'react'

import Image from 'next/image'


import { Info } from 'lucide-react'

import { Checkbox } from '@/components/ui'
import FAQModal, { type FAQData } from '@/components/ui/FAQModal'
import { ICONS } from '@/constants/icons'

export interface AddNewCardFormValues {
    cardNumber: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    saveCard: boolean
}

export interface AddNewCardFormProps {
    initialValues?: Partial<AddNewCardFormValues>
    onChange?: (values: AddNewCardFormValues) => void
    border?: boolean
    showCheckbox?: boolean
}

// Short, small error messages
function validateFields(values: AddNewCardFormValues) {
    const errors: { [K in keyof AddNewCardFormValues]?: string } = {}

    if (values.cardNumber?.length !== 16) {
        errors.cardNumber = 'Invalid card number'
    }

    if (!/^(0?[1-9]|1[0-2])$/.test(values.expiryMonth)) {
        errors.expiryMonth = 'Invalid MM'
    }

    if (!/^\d{2}$/.test(values.expiryYear)) {
        errors.expiryYear = 'Invalid YY'
    }

    if (!/^\d{3}$/.test(values.cvv)) {
        errors.cvv = 'Invalid CVV'
    }

    return errors
}

export function AddNewCardForm({ initialValues, onChange, border = true, showCheckbox = true }: AddNewCardFormProps) {
    const [values, setValues] = useState<AddNewCardFormValues>({
        cardNumber: initialValues?.cardNumber ?? '',
        expiryMonth: initialValues?.expiryMonth ?? '',
        expiryYear: initialValues?.expiryYear ?? '',
        cvv: initialValues?.cvv ?? '',
        saveCard: initialValues?.saveCard ?? true,
    })
    const [touched, setTouched] = useState<{ [K in keyof AddNewCardFormValues]?: boolean }>({})
    const [showCvvFaq, setShowCvvFaq] = useState(false)

    const visaIcon = useMemo(() => ICONS.visa, [])
    const cvvFaqData: FAQData = useMemo(
        () => ({
            heading: 'Where is the CVV on my card?',
            bulletPoints: [
                'CVV is a 3-digit security code used to confirm you have the physical card.',
                'For Visa/Mastercard, it is usually on the back of the card near the signature strip.',
                'For some cards, you may see it on the front (depending on the issuer).',
                'Never share your CVV with anyone.',
            ],
        }),
        [],
    )

    const errors = validateFields(values)
    const showError = (field: keyof AddNewCardFormValues) => Boolean(touched[field] && errors[field])

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
        <>
            <div className={`${border ? 'border border-border rounded-2xl p-4  space-y-4' : 'space-y-4'}`}>
                <p className='text-text-primary text-sm font-medium'>
                    Fill the details to continue!
                </p>
                {/* Card Number Input */}
                <div className='space-y-2'>
                    <p className='text-text-primary text-sm'>Enter card number</p>
                    <div className={`border rounded-2xl px-4 py-4 flex items-center justify-between gap-3 ${showError('cardNumber') ? 'border-error' : 'border-border'}`}>
                        <input
                            autoComplete="one-time-code"
                            type='text'
                            inputMode='numeric'
                            maxLength={19}
                            minLength={13}
                            value={values.cardNumber.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim()}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
                                update({ cardNumber: raw })
                            }}
                            onBlur={() => setTouched((prev) => ({ ...prev, cardNumber: true }))}
                            placeholder='0000 0000 0000 0000'
                            className='w-full bg-transparent text-text-primary text-sm !outline-none! focus:outline-none! focus:ring-none! tracking-wider'
                        />

                        <div className='w-8 h-4 relative shrink-0'>
                            <Image src={visaIcon} alt='VISA' width={40} height={24} className='object-contain' />
                        </div>
                    </div>
                    {showError('cardNumber') && (
                        <div className='text-xs text-error ml-2 mt-1'>{errors.cardNumber}</div>
                    )}
                </div>
                {/* Expiry and CVV */}
                <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                        <p className='text-text-primary ml-1 text-sm'>Valid Till</p>
                        <div className='flex gap-3'>
                            <div className={`flex-1 border rounded-2xl px-4 py-3 ${showError('expiryMonth') ? 'border-error' : 'border-border'}`}>
                                <input
                                    autoComplete="one-time-code"
                                    type='text'
                                    inputMode='numeric'
                                    maxLength={2}
                                    value={values.expiryMonth}
                                    onChange={(e) => handleNumericInput(e.target.value, 'expiryMonth')}
                                    onBlur={() => setTouched((prev) => ({ ...prev, expiryMonth: true }))}
                                    placeholder='MM'
                                    className='w-full bg-transparent text-text-primary text-sm text-center !outline-none! focus:outline-none! focus:ring-none!'
                                />
                            </div>
                            <div className={`flex-1 border rounded-2xl px-4 py-3 ${showError('expiryYear') ? 'border-error' : 'border-border'}`}>
                                <input
                                    autoComplete="one-time-code"
                                    type='text'
                                    inputMode='numeric'
                                    maxLength={2}
                                    value={values.expiryYear}
                                    onChange={(e) => handleNumericInput(e.target.value, 'expiryYear')}
                                    onBlur={() => setTouched((prev) => ({ ...prev, expiryYear: true }))}
                                    placeholder='YY'
                                    className='w-full bg-transparent text-text-primary text-sm text-center !outline-none! focus:outline-none! focus:ring-none!'
                                />
                            </div>
                        </div>
                        <div className='flex gap-3'>
                            {showError('expiryMonth') && (
                                <span className='block text-xs text-error ml-1 mt-1 flex-1'>{errors.expiryMonth}</span>
                            )}
                            {showError('expiryYear') && (
                                <span className='block text-xs text-error ml-1 mt-1 flex-1'>{errors.expiryYear}</span>
                            )}
                        </div>
                    </div>
                    {/* CVV */}
                    <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                            <p className='text-text-primary ml-1 text-sm'>CVV</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <input
                                autoComplete="one-time-code"
                                type='password'
                                inputMode='numeric'
                                maxLength={3}
                                value={values.cvv}
                                onChange={(e) => handleNumericInput(e.target.value, 'cvv')}
                                onBlur={() => setTouched((prev) => ({ ...prev, cvv: true }))}
                                placeholder='CVV'
                                className={`w-full bg-transparent border rounded-2xl px-4 py-3 text-text-primary text-sm text-center !outline-none! focus:outline-none! focus:ring-none! ${showError('cvv') ? 'border-error' : 'border-border'}`}
                            />
                            <button
                                type='button'
                                className='w-8 h-8 flex items-center justify-center'
                                aria-label='CVV info'
                                onClick={() => setShowCvvFaq(true)}
                            >
                                <Info size={18} className='text-text-primary' />
                            </button>
                        </div>
                        {showError('cvv') && (
                            <div className='text-xs text-error ml-2 mt-1'>{errors.cvv}</div>
                        )}
                    </div>
                </div>
                {showCheckbox && <Checkbox
                    checked={values.saveCard}
                    onChange={(checked) => update({ saveCard: checked })}
                    label={'Save my card for future transactions.\nEncrypted and saved as per PCI DSS guidelines'}
                />}

            </div>
            <FAQModal
                visible={showCvvFaq}

                onClose={() => setShowCvvFaq(false)}
                data={cvvFaqData}
            />
        </>
    )
}
