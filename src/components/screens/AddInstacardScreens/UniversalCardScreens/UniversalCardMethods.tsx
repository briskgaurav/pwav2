'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { UserUniveralCardSteps } from '@/types/userVerificationSteps'
import UcScanScreen from './UCScanScreen'
import EnterUniversalCard from './EnterUniversalCard'
import { initiateCardLink, selectUc } from '@/lib/api/cardLinkApi'
import { setCardLinkingData, selectCardLinkingData } from '@/store/redux/slices/cardLinkingSlice'
import { useCardJourney } from '@/hooks/useCardJourney'

export default function UniversalCardMethods({ handleNext }: { handleNext: (step: UserUniveralCardSteps) => void }) {
    const [UniversalCardMethod, setUniversalCardMethod] = useState('input-field')
    const [cardNumber, setCardNumber] = useState('')
    const dispatch = useDispatch()
    const cardLinkingData = useSelector(selectCardLinkingData)
    const { call } = useCardJourney()

    useEffect(() => {
        const fetchLink = async () => {
            try {
                // Using 'as any' because CardLinkStateResponse and CardRequestStateResponse 
                // are structurally compatible for the fields we need (requestId, nextAction)
                const response = await call(() => initiateCardLink() as any)
                // console.log(response)
                dispatch(setCardLinkingData({ response }))
            } catch (error) {
                console.error("Failed to initiate card link:", error)
            }
        }
        fetchLink()
    }, [dispatch, call])

    const handleMethodChange = (method: string) => {
        setUniversalCardMethod(method)
    }

    const handleContinue = async () => {
        try {
            if (cardLinkingData.response?.requestId) {
                console.log(cardLinkingData.response.requestId)
                const response = await call(() => selectUc(
                    cardLinkingData.response.requestId,
                    cardNumber.replace(/\s+/g, '')
                ) as any)
                dispatch(setCardLinkingData({ response }))
              
            }
        } catch (error) {
            console.error("Failed to select UC:", error)
        }
              handleNext('registered_email_verification')

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
                />
            ) : (
                <UcScanScreen handleNext={handleNext} />
            )}
        </>
    )
}
