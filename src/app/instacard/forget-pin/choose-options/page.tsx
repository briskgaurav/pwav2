'use client'

import React, { useState } from 'react'
import { Button, RadioOption, SheetContainer } from '@/components/ui'
import { ChatIcon, ICONS, MessageIcon } from '@/constants/icons'
import { CheckRadioOption } from '@/components/ui/RadioButton2'
import { routes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import LayoutSheet from '@/components/ui/LayoutSheet'
import ButtonComponent from '@/components/ui/ButtonComponent'
import { useAppSelector } from '@/store/redux/hooks'

export default function ChooseOptionsPage() {
    const router = useRouter()
    const maskedMobile = useAppSelector((s) => s.user.maskedMobile)
    const maskedEmail = useAppSelector((s) => s.user.maskedEmail)
    const [selectedOption, setSelectedOption] = useState<'phone' | 'email' | null>(null)

    const handleContinue = () => {
        if (selectedOption === 'phone') {
            router.push(routes.forgetPinPhoneVerification)
        } else {
            router.push(routes.forgetPinEmailVerification)
        }
    }

    return (
        <LayoutSheet routeTitle='Choose Verification Method' needPadding={false}>
            <div className="flex-1 overflow-auto pb-10 p-6">
                <p className='text-text-primary text-sm '>You PIN has been found linked to following phone number / email address. To reset your PIN, please verify your identity.</p>

                <p className='mt-4 text-text-primary text-sm '>We will send an OTP to verify your identity</p>

                <div className="mt-4 flex flex-col gap-3" role="radiogroup" aria-label="Choose verification method">
                    <RadioOption
                        label={maskedMobile}
                        selected={selectedOption === 'phone'}
                        onSelect={() => setSelectedOption('phone')}
                        accessibilityLabel="Verify with phone number"
                        IconComponent={ChatIcon as LucideIcon}
                    />

                    <RadioOption
                        label={maskedEmail}
                        selected={selectedOption === 'email'}
                        onSelect={() => setSelectedOption('email')}
                        accessibilityLabel="Verify with email"

                        IconComponent={MessageIcon as LucideIcon}
                    />
                </div>
            </div>
            <ButtonComponent title='Continue' onClick={handleContinue} disabled={!selectedOption} />
        </LayoutSheet>
    )
}
