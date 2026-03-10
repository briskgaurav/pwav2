'use client'

import CardMockup from '@/components/ui/CardMockup'
import { SheetContainer, OTPInput, OTPKeypad, Button } from '@/components/ui'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { PIN_LENGTH } from '@/lib/types'
import { useManagingCard } from '@/hooks/useManagingCard'

export default function PinChangePage() {
    const [pin, setPin] = useState('')
    const [error, setError] = useState('')
    const [resetKey, setResetKey] = useState(0)
    const router = useRouter()
    const { imageSrc, maskedNumber, verifyPin } = useManagingCard()

    const handleKeypadKey = (key: string) => {
        setError('')
        if (key === 'del') {
            setPin((prev) => prev.slice(0, -1))
            return
        }

        if (!/^\d$/.test(key)) return
        setPin((prev) => (prev.length < PIN_LENGTH ? prev + key : prev))
    }

    const handleContinue = () => {
        if (verifyPin(pin)) {
            router.push(routes.pinChangeSetup)
        } else {
            setError('Incorrect PIN. Please try again.')
            setPin('')
            setResetKey((prev) => prev + 1)
        }
    }

    const isComplete = pin.length === PIN_LENGTH

    return (
        <div className="h-dvh flex flex-col">
            <SheetContainer>
                <div className="flex-1 flex flex-col h-full justify-between overflow-hidden">
                    <div className="flex flex-col items-center py-8 px-5 overflow-y-auto">
                        <p className="text-text-primary text-center text-sm">
                            Verify PIN for Selected Instacard
                        </p>
                        <div className="h-auto w-[70%] relative">
                            <CardMockup showActions={false} isclickable={false} imageSrc={imageSrc} maskedNumber={maskedNumber} numberSize='text-xl' />
                        </div>

                        <div className="flex w-full flex-col items-center mt-4 gap-4">
                            <p className="text-text-primary text-center text-sm">
                                Please verify your current PIN before setting a new one.
                            </p>
                            <OTPInput
                                useDots
                                resetKey={resetKey}
                                value={pin}
                                maxLength={PIN_LENGTH}
                                onChange={setPin}
                            />
                            <div className="h-4">
                                {error && (
                                    <p className="text-xs text-red-500 text-center">{error}</p>
                                )}
                            </div>
                        </div>
                        <div className="w-full flex flex-col mt-auto items-center gap-3 py-10 px-6">
                            <Button
                                fullWidth
                                onClick={handleContinue}
                                disabled={!isComplete}
                            >
                                Continue
                            </Button>
                            <button
                                onClick={() => router.push('/forget-pin')}
                                type="button"
                                className="text-xs  bg-transparent border-none cursor-pointer"
                            >
                               <p className='text-text-primary'>Forgot PIN ?</p>
                            </button>
                        </div>
                    </div>

                    <OTPKeypad onKeyPress={handleKeypadKey} />
                </div>
            </SheetContainer>
        </div>
    )
}

