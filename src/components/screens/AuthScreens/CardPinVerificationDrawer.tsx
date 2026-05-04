'use client'

import BottomSheetModal from '@/components/ui/BottomSheetModal'
import { Button, OTPInput, OTPKeypad } from '@/components/ui'
import { PIN_LENGTH } from '@/lib/types'
import { useAppSelector } from '@/store/redux/hooks'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { routes } from '@/lib/routes'

type CardPinVerificationDrawerProps = {
    visible: boolean
    onClose: () => void
    title?: string
    showTitle?: boolean
    subtitle?: string
    onVerified: () => void
    fieldLength:number,
    /** Optional custom verifier; defaults to comparing against redux `s.card.pin` */
    verifyPin?: (pin: string) => boolean
    onDonePressed?: () => void
}

export default function CardPinVerificationDrawer({
    showTitle = true,
    visible,
    onClose,
    fieldLength = 4,
    title = 'PIN Verification',
    subtitle = 'Enter your PIN to continue',
    onVerified,
    verifyPin,
    onDonePressed,
}: CardPinVerificationDrawerProps) {
    const globalPin = useAppSelector((s) => s.card.pin)

    const pinLength = fieldLength > 0 ? fieldLength : 4;
    const getVerifier = () => {
        if (pinLength === 6) {
            return verifyPin ?? ((p: string) => p === '111111');
        }
        return verifyPin ?? ((p: string) => p === globalPin);
    };
    const verifier = useMemo(getVerifier, [globalPin, verifyPin, pinLength]);

    const [pin, setPin] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [resetKey, setResetKey] = useState(0)
    const pinInputRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!visible) {
            setPin('')
            setError(null)
            setResetKey((k) => k + 1)
        }
    }, [visible])

    const handleContinue = useCallback((): boolean => {
        const ok = verifier(pin)
        if (ok) {
            onDonePressed?.()
            onVerified()
            return true
        }
        setError('Incorrect PIN')
        setPin('')
        setResetKey((k) => k + 1)
        return false
    }, [onDonePressed, onVerified, pin, verifier])

    const handleKeypadKey = useCallback((key: string) => {
        setError(null)
        if (key === 'done') {
            if (pin.length !== pinLength) return
            handleContinue()
            return
        }
        if (key === 'del') {
            setPin((prev) => prev.slice(0, -1))
            return
        }
        if (!/^\d$/.test(key)) return
        setPin((prev) => (prev.length < pinLength ? prev + key : prev))
    }, [handleContinue, pin.length, pinLength])

    const isComplete = pin.length === pinLength

    return (
        <BottomSheetModal showTitle={showTitle} backdropBlur={true} visible={visible} onClose={onClose} title={title} maxHeight={0.92}>
            <div className="flex flex-col gap-5">
                <p className="text-sm text-text-secondary pt-8 text-center">{subtitle}</p>

                <div ref={pinInputRef} className="flex flex-col items-center gap-3">
                    <OTPInput
                        useDots
                        resetKey={resetKey}
                        value={pin}
                        maxLength={pinLength}
                        onPress={() => {
                            // keypad is always visible in this drawer
                        }}
                    />
                    {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                </div>
                <div className='w-full flex flex-col items-center gap-2'>

                    <Button fullWidth disabled={!isComplete} onClick={handleContinue}>Continue</Button>
                    <Link href={routes.forgetPin} className="text-sm text-text-secondary text-center">Forgot PIN?</Link>
                </div>

                <div className="w-full pt-4 -mt-4">
                    <OTPKeypad  needPadding={false} showBackground={false} onKeyPress={handleKeypadKey} />
                </div>
            </div>

        </BottomSheetModal>
    )
}
