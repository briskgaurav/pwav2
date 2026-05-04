'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { AddMoneyForm } from '@/components/ui/AddMoneyForm'
import FAQModal from '@/components/ui/FAQModal'
import { GiftAddMoneyBottomSheet } from '@/components/ui/GiftAddMoneyBottomSheet'
import { GiftCardHeader } from '@/components/ui/GiftCardHeader'
import { GiftRecipientDetails } from '@/components/ui/GiftRecipientDetails'
import { routes } from '@/lib/routes'

import LayoutSheet from '../../ui/LayoutSheet'

const TERMS_AND_CONDITIONS = {
    heading: 'Terms & Conditions',
    bulletPoints: [
        'By gifting this Instacard, you agree to transfer ownership of the card to the recipient.',
        'The recipient will be responsible for all transactions made using this card.',
        'The card issuance fee will be debited from your linked bank account.',
        'Gift cards are non-refundable once activated and sent to the recipient.',
        'The recipient must complete KYC verification to access full card features.',
    ],
}

interface ValidationErrors {
    recipientName?: string
    recipientEmail?: string
    amount?: string
}

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const validateAmount = (amount: string): boolean => {
    if (!amount || amount.trim() === '') return false
    const numericValue = amount.replace(/,/g, '')
    const num = parseFloat(numericValue)
    return !isNaN(num) && num > 0
}

export default function GiftACardScreen() {
    const router = useRouter()

    const [agreed, setAgreed] = useState(false)
    const [amount, setAmount] = useState('')
    const [showTermsModal, setShowTermsModal] = useState(false)

    const [recipientName, setRecipientName] = useState('')
    const [recipientEmail, setRecipientEmail] = useState('')
    const [recipientMessage, setRecipientMessage] = useState('')

    const [modalOpen, setModalOpen] = useState(false)
    const [errors, setErrors] = useState<ValidationErrors>({})

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {}

        // Validate recipient name
        if (!recipientName || recipientName.trim() === '') {
            newErrors.recipientName = 'Recipient name is required'
        } else if (recipientName.trim().length < 2) {
            newErrors.recipientName = 'Recipient name must be at least 2 characters'
        }

        // Validate recipient email
        if (!recipientEmail || recipientEmail.trim() === '') {
            newErrors.recipientEmail = 'Recipient email is required'
        } else if (!validateEmail(recipientEmail.trim())) {
            newErrors.recipientEmail = 'Please enter a valid email address'
        }

        // Validate amount
        if (!amount || amount.trim() === '') {
            newErrors.amount = 'Amount is required'
        } else if (!validateAmount(amount)) {
            newErrors.amount = 'Please enter a valid amount greater than 0'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleRecipientNameChange = (value: string) => {
        setRecipientName(value)
        if (errors.recipientName) {
            setErrors((prev) => ({ ...prev, recipientName: undefined }))
        }
    }

    const handleRecipientEmailChange = (value: string) => {
        setRecipientEmail(value)
        if (errors.recipientEmail) {
            setErrors((prev) => ({ ...prev, recipientEmail: undefined }))
        }
    }

    const handleAmountChange = (value: string) => {
        setAmount(value)
        if (errors.amount) {
            setErrors((prev) => ({ ...prev, amount: undefined }))
        }
    }

    const handleOpenModal = () => {
        if (validateForm()) {
            setModalOpen(true)
        }
    }

    return (
        <LayoutSheet routeTitle='Gift a Card' needPadding={false}>
            <div className="flex-1 overflow-auto pb-10 gap-4 p-4 flex flex-col">
                <GiftCardHeader />

                <GiftRecipientDetails
                    recipientName={recipientName}
                    recipientEmail={recipientEmail}
                    recipientMessage={recipientMessage}
                    onRecipientNameChange={handleRecipientNameChange}
                    onRecipientEmailChange={handleRecipientEmailChange}
                    onRecipientMessageChange={setRecipientMessage}
                    errors={errors}
                />

                <AddMoneyForm
                    showKycTier={false}
                    amount={amount}
                    onAmountChange={handleAmountChange}
                    onSelectRecommended={handleAmountChange}
                    onOpenModal={handleOpenModal}
                    btnTitle='Proceed to Add Money'
                    error={errors.amount}
                />

            </div>

            <FAQModal
                visible={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                data={TERMS_AND_CONDITIONS}
            />
            <GiftAddMoneyBottomSheet
                amount={amount}
                visible={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={() => {
                    const params = new URLSearchParams({
                        name: recipientName,
                        email: recipientEmail,
                        message: recipientMessage || '',
                        amount,
                    })

                    router.replace(`${routes.giftACardReadyToUse}?${params.toString()}`)
                }}
            />
        </LayoutSheet>
    )
}
