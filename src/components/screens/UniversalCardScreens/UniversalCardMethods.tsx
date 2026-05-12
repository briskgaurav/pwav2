'use client'
import { useState } from 'react'
import type { UserUniveralCardSteps } from '@/types/userVerificationSteps'
import EnterUniversalCard from './EnterUniversalCard'
import UcScanScreen from '../AddInstacardScreens/UniversalCardScreens/UCScanScreen'

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
