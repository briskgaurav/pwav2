'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { UserUniveralCardSteps } from '@/types/userVerificationSteps'
import { initiateCardLink, provideUcPan } from '@/lib/api/cardLinkApi'
import { setCardLinkingData, selectCardLinkingData } from '@/store/redux/slices/cardLinkingSlice'
import { showToast } from '@/store/redux/slices/toasterSlice'
import EnterUniversalCard from './EnterUniversalCard'
import UcScanScreen from './UCScanScreen'

export default function UniversalCardMethods({ handleNext }: { handleNext: (step: UserUniveralCardSteps) => void }) {
    const [UniversalCardMethod, setUniversalCardMethod] = useState('input-field')
    const [cardNumber, setCardNumber] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const dispatch = useDispatch()
    const cardLinkingData = useSelector(selectCardLinkingData)

    useEffect(() => {
        const fetchLink = async () => {
            try {
                const response = await initiateCardLink()
                dispatch(setCardLinkingData({ response }))
            } catch (error) {
                console.error("Failed to initiate card link:", error)
            }
        }
        fetchLink()
    }, [dispatch])

    const handleMethodChange = (method: string) => {
        setUniversalCardMethod(method)
    }

    const handleContinue = async () => {
        if (submitting) return
        setSubmitting(true)

        try {
            if (!cardLinkingData.response?.requestId) {
                throw new Error('No requestId available. Please try again.')
            }

            const response = await provideUcPan(
                cardLinkingData.response.requestId,
                cardNumber.replace(/\s+/g, '')
            )

            dispatch(setCardLinkingData({ response }))
            handleNext('registered_email_verification')

        } catch (err: any) {
            console.error("Failed to select UC:", err)
            const msg = err?.errorMessage || 'Could not process your request. Please try again.';
            dispatch(showToast({
                message: 'Something went wrong',
                subtitle: msg,
                duration: 3000,
                tosterType: 'error',
            }))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            {UniversalCardMethod === 'input-field' ? (
                <EnterUniversalCard
                    handleContinue={handleContinue}
                    cardNumber={cardNumber}
                    setCardNumber={setCardNumber}
                    handleNext={handleNext}
                    handleMethodChange={handleMethodChange}
                    isSubmitting={submitting}
                />
            ) : (
                <UcScanScreen handleNext={handleNext} />
            )}
        </>
    )
}
