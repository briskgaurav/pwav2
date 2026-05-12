'use client'
import { useState } from 'react'
import type { UserUniveralCardSteps } from '@/types/userVerificationSteps'
import UcScanScreen from '../AddInstacardScreens/UCScanScreen'
import EnterUniversalCard from './EnterUniversalCard'

export default function UniversalCardMethods({handleNext}: {handleNext: (step: UserUniveralCardSteps) => void}) {
    const [UniversalCardMethod, setUniversalCardMethod] = useState('input-field')
    const handleMethodChange = (method: string) => {
        setUniversalCardMethod(method)
    }

    return (
        <>  
            {UniversalCardMethod === 'input-field' ? <EnterUniversalCard handleNext={handleNext}  handleMethodChange={handleMethodChange}  /> : <UcScanScreen handleNext={handleNext}    />}
        </>
    )
}
