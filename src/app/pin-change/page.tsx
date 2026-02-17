'use client'

import CardMockup from '@/components/ui/CardMockup'
import { SheetContainer, OTPInput, Button } from '@/components/ui'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { PIN_LENGTH } from '@/lib/types'

export default function PinChangePage() {
    const [pin, setPin] = useState('')
    const router = useRouter()

    // Mockup: just navigate forward when PIN is complete
    const handleContinue = () => {
        router.push(routes.pinChangeSetup)
    }

    const isComplete = pin.length === PIN_LENGTH

    return (
        <div className="h-dvh flex flex-col">
            <SheetContainer>
                <div className="flex-1 flex flex-col h-full justify-between  overflow-hidden">
                    <div className=" flex flex-col items-center py-8 px-5 overflow-y-auto">
                        <p className="text-text-primary text-center text-sm">Verify PIN for Selected Instacard</p>
                        <div className="h-auto w-[70%] relative">
                            <CardMockup showActions={false} isclickable={false} />
                        </div>

                        <div className="flex w-full flex-col items-center mt-4 gap-4">
                            <p className="text-text-primary text-center text-sm">Please verify your current PIN before setting a new one.</p>
                            <OTPInput
                                value={pin}
                                maxLength={PIN_LENGTH}
                                onChange={setPin}
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center gap-3 pb-10 px-6">
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
                            className="text-xs text-primary bg-transparent border-none cursor-pointer"
                        >
                            Forgot PIN ?
                        </button>
                    </div>
                </div>
            </SheetContainer>
        </div>
    )
}
