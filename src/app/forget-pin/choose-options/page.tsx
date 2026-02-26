'use client'

import React, { useState } from 'react'
import { Button, RadioOption, SheetContainer } from '@/components/ui'
import { ICONS } from '@/constants/icons'
import { RadioOption2 } from '@/components/ui/RadioButton2'
import { routes } from '@/lib/routes'
import { useRouter } from 'next/navigation'

export default function page() {
    const router = useRouter()
    const [selectedOption, setSelectedOption] = useState<'phone' | 'email' | null>(null)

    const handleContinue = () => {
        if (selectedOption === 'phone') {
            router.push(routes.forgetPinPhoneVerification)
        } else {
            router.push(routes.forgetPinEmailVerification)
        }
    }

    return (
        <div className='h-screen flex flex-col'>
            <SheetContainer>
                <div className="flex-1 flex flex-col h-full overflow-hidden p-6 pt-10">
                    <p className='text-text-primary text-sm '>You PIN has been found linked to following phone number / email address. To reset your PIN, please verify your identity.</p>

                    <p className='mt-4 text-text-primary text-sm '>We will send an OTP to verify your identity</p>

                    <div className="mt-4 flex flex-col gap-3">
                        <RadioOption
                            label="+234 *** *** 1234"
                            selected={selectedOption === 'phone'}
                            onSelect={() => setSelectedOption('phone')}
                            accessibilityLabel="Verify with phone number"
                            icon={ICONS.chat}
                        />

                        <RadioOption
                            label="j***@example.com"
                            selected={selectedOption === 'email'}
                            onSelect={() => setSelectedOption('email')}
                            accessibilityLabel="Verify with email"
                            icon={ICONS.mail}
                        />
                    </div>
                </div>
                <div className='p-6'>

                    <Button fullWidth onClick={handleContinue} disabled={!selectedOption}>Continue</Button>
                </div>
            </SheetContainer>
        </div>
    )
}
