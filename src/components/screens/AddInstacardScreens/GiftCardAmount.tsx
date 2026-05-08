'use client'

import React, { useState } from 'react'
import { Button, SheetContainer } from '@/components/ui'
import { AddMoneyForm } from '@/components/ui/AddMoneyForm'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { GiftCardHeader } from '@/components/ui/GiftCardHeader'
import { GiftRecipientDetails } from '@/components/ui/GiftRecipientDetails'
import { GiftTermsSection } from '@/components/ui/GiftTermsSection'
import { GiftAddMoneyBottomSheet } from '@/components/ui/GiftAddMoneyBottomSheet'
import FAQModal from '@/components/ui/FAQModal'
import LayoutSheet from '@/components/ui/LayoutSheet'
import { UserInstaCardSteps } from '@/types/userVerificationSteps'
import ButtonComponent from '@/components/ui/ButtonComponent'
import { saveGiftRecipientDetails } from '@/lib/api/cards'
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks'

import {
  selectCardRequestId,
  selectSelectedCardType,
  selectRecipientName,
  selectRecipientEmail,
  setGiftCardRequest,
} from "@/store/redux/slices/cardRequestSlice";

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

interface GiftACardRecInfProps {
  onNext: (nextStep: UserInstaCardSteps) => void;
}

export default function GiftACardAmount({
  onNext,
}: GiftACardRecInfProps) {

    const router = useRouter()
    const selectedType = useAppSelector(selectSelectedCardType);
    const  dispatch = useAppDispatch();
    const requestId = useAppSelector(selectCardRequestId);

    // get recipient details from redux
    const savedRecipientName = useAppSelector(selectRecipientName);
    const savedRecipientEmail = useAppSelector(selectRecipientEmail);
    

    const [amount, setAmount] = useState('')
    //const isCodeComplete = code.length === MAX_CODE_LENGTH;

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

const handleSuccess = async () => {

    onNext("registered_email_verification");

//   try {
//     // requestId can be string | null → convert safely
//     if (!requestId) {
//       console.error("Request ID is missing");
//       return;
//     }

//     // selectedType can be string | null → convert safely
//     if (!selectedType) {
//       console.error("Selected Card Type is missing");
//       return;
//     }

//     const response = await saveGiftRecipientDetails({
//       requestId: requestId as string,
//       recipientName,
//       recipientEmail,
//     });

//     console.log("149 Recipient details saved successfully:", response);

//     dispatch(
//         setGiftCardRequest({
//             requestId: response.requestId,
//             registeredEmail: response.registeredEmail ?? "",
//             emailOtpStatus: response.status ?? "",
//             selectedCardType: selectedType,

//             currentState: response.currentState, // OTP_EMAIL_PENDING
//             nextAction: response.nextAction,
//             recipientName: response.recipientName,
//             recipientEmail: response.recipientEmail,
//         })
//     );

//     onNext("registered_email_verification");
//   } catch (error) {
//     console.error("Failed to save recipient details:", error);
//   }
};

    return (
        <LayoutSheet routeTitle='Gift a Card' needPadding={false} hideLayerSheet={true}>
            <div className="flex-1 overflow-auto pb-10 gap-4 p-4 flex flex-col">
                <GiftCardHeader />

                <GiftRecipientDetails
                    recipientName={savedRecipientName ?? ""}
                    recipientEmail={savedRecipientEmail ?? ""}
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

                <Button
                    className="bg-primary text-white rounded-full px-4 py-2 w-full h-14"
                    onClick={handleSuccess}
                >
                {"Continue"}
                </Button>
            </div>

        </LayoutSheet>
    )
}
