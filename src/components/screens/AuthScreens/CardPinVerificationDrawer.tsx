'use client'

import BottomSheetModal from '@/components/ui/BottomSheetModal'
import { Button } from '@/components/ui'
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

function NativePinInput({
    value,
    maxLength,
    onChange,
    resetKey,
    onDone,
    onFocus,
    useDots = true,
}: {
    value: string
    maxLength: number
    onChange: (v: string) => void
    resetKey: number
    onDone?: () => void
    onFocus?: () => void
    useDots?: boolean
}) {
    const hiddenRef = useRef<HTMLInputElement | null>(null)
    const digits = Array.from({ length: maxLength }, (_, i) => value[i] || '')

    const focus = () => hiddenRef.current?.focus()

    useEffect(() => {
        const t = window.setTimeout(() => focus(), 150)
        return () => window.clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetKey])

    return (
        <div className="relative w-full" onClick={focus}>
            <input
                ref={hiddenRef}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                pattern="\\d*"
                enterKeyHint="done"
                maxLength={maxLength}
                value={value}
                onFocus={() => onFocus?.()}
                onKeyDown={(e) => {
                    if (e.key !== 'Enter') return
                    e.preventDefault()
                    onDone?.()
                }}
                onChange={(e) => {
                    const cleaned = e.target.value.replace(/\\D/g, '').slice(0, maxLength)
                    onChange(cleaned)
                }}
                // Keep it *inside* the sheet so focusing scrolls correctly
                className="absolute left-0 top-0 w-px h-px opacity-0 pointer-events-none"
            />

            <div
                className="flex w-full justify-center px-5"
                style={{ gap: maxLength > 6 ? 6 : 10 }}
            >
                {digits.map((digit, i) => {
                    const isCursor = i === value.length && value.length < maxLength
                    return (
                        <div
                            key={i}
                            className={`border flex items-center justify-center text-base font-semibold text-text-primary text-center outline-none shrink-0 transition-colors ${
                                maxLength > 6 ? 'w-10 h-10 rounded-lg' : 'w-12 h-12 rounded-xl'
                            } ${
                                isCursor ? 'border-primary' : digit ? 'border-text-primary' : 'border-text-secondary'
                            }`}
                            style={{ position: 'relative' }}
                        >
                            {digit ? (
                                useDots ? (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            width: maxLength > 6 ? 8 : 12,
                                            height: maxLength > 6 ? 8 : 12,
                                            background: 'currentColor',
                                            borderRadius: '9999px',
                                            transform: 'translate(-50%, -50%)',
                                            display: 'block',
                                            fontSize: 0,
                                        }}
                                    />
                                ) : (
                                    <span>{digit}</span>
                                )
                            ) : isCursor ? (
                                <span className="w-0.5 h-5 bg-primary animate-pulse rounded-full" />
                            ) : (
                                ''
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
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
    const [keyboardInset, setKeyboardInset] = useState(0)
    const pinInputRef = useRef<HTMLDivElement | null>(null)

    const bringIntoView = useCallback(() => {
        // Let the keyboard layout settle first
        window.setTimeout(() => {
            pinInputRef.current?.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' })
        }, 50)
    }, [])

    useEffect(() => {
        if (!visible) {
            setPin('')
            setError(null)
            setKeyboardInset(0)
            setResetKey((k) => k + 1)
            return
        }
        // ensure we autofocus when opening as well
        setResetKey((k) => k + 1)
    }, [visible])

    useEffect(() => {
        if (!visible) return

        const vv = window.visualViewport
        if (!vv) return

        const compute = () => {
            // Approx keyboard height in px for iOS/Android browsers that support VisualViewport
            const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
            setKeyboardInset(inset)
            if (inset > 0) bringIntoView()
        }

        compute()
        vv.addEventListener('resize', compute)
        vv.addEventListener('scroll', compute)
        return () => {
            vv.removeEventListener('resize', compute)
            vv.removeEventListener('scroll', compute)
        }
    }, [bringIntoView, visible])

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

    const isComplete = pin.length === pinLength

    return (
        <BottomSheetModal showTitle={showTitle} backdropBlur={true} visible={visible} onClose={onClose} title={title} maxHeight={0.92}>
            <div className="flex flex-col gap-5" style={{ paddingBottom: keyboardInset ? keyboardInset + 12 : undefined }}>
                <p className="text-sm text-text-secondary pt-2 text-center">{subtitle}</p>

                <div ref={pinInputRef} className="flex flex-col items-center gap-3">
                    <NativePinInput
                        useDots
                        resetKey={resetKey}
                        value={pin}
                        maxLength={pinLength}
                        onChange={(v) => {
                            setError(null)
                            setPin(v)
                        }}
                        onFocus={bringIntoView}
                        onDone={() => {
                            if (!isComplete) return
                            handleContinue()
                        }}
                    />
                    {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                </div>
                <div className='w-full flex flex-col items-center gap-2'>

                    <Button fullWidth disabled={!isComplete} onClick={handleContinue}>Continue</Button>
                    <Link href={routes.forgetPin} className="text-sm text-text-secondary text-center">Forgot PIN?</Link>
                </div>
                {/* <div className='h-[20vh]'></div> */}
            </div>

        </BottomSheetModal>
    )
}
