'use client'

import React, { useState } from 'react'
import { SheetContainer } from '@/components/ui'
import { AddMoneyForm } from '@/features/add-money/components/AddMoneyForm'
import FAQModal from '@/components/modals/FAQModal'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { GiftCardHeader } from '@/features/gift/components/GiftCardHeader'
import { GiftRecipientDetails } from '@/features/gift/components/GiftRecipientDetails'
import { GiftTermsSection } from '@/features/gift/components/GiftTermsSection'
import { GiftAddMoneyBottomSheet } from '@/features/gift/components/GiftAddMoneyBottomSheet'

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
export default function page() {
    const router = useRouter()

    const [agreed, setAgreed] = useState(false)
    const [amount, setAmount] = useState('')
    const [showTermsModal, setShowTermsModal] = useState(false)

    const [recipientName, setRecipientName] = useState('')
    const [recipientEmail, setRecipientEmail] = useState('')
    const [recipientMessage, setRecipientMessage] = useState('')

    const [modalOpen, setModalOpen] = useState(false)

    return (
        <div className='h-screen flex flex-col'>
            <SheetContainer>
                <div className="flex-1 overflow-auto pb-10 p-4 space-y-4">
                    <GiftCardHeader />

                    <GiftRecipientDetails
                        recipientName={recipientName}
                        recipientEmail={recipientEmail}
                        recipientMessage={recipientMessage}
                        onRecipientNameChange={setRecipientName}
                        onRecipientEmailChange={setRecipientEmail}
                        onRecipientMessageChange={setRecipientMessage}
                    />

                    <GiftTermsSection
                        agreed={agreed}
                        onChangeAgreed={setAgreed}
                        onOpenTerms={() => setShowTermsModal(true)}
                    />

                    <AddMoneyForm
                        showKycTier={false}
                        amount={amount}
                        onAmountChange={setAmount}
                        onSelectRecommended={setAmount}
                        onOpenModal={() => setModalOpen(true)}
                        btnTitle='Proceed to Add Money'
                    />

                </div>
            </SheetContainer>

            <FAQModal
                visible={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                data={TERMS_AND_CONDITIONS}
            />
            <GiftAddMoneyBottomSheet
                amount={amount}
                visible={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={() => router.push(routes.readyToUse)}
            />
        </div>
    )
}
