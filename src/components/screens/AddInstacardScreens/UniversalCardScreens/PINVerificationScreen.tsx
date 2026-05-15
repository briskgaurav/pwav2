'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CardMockup } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks'
import { PIN_LENGTH } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth-context'
import { useManagingCard } from '@/hooks/useManagingCard'
import { routes } from '@/lib/routes'
import {
  verifyUcPin,
  verifyVcPin,
  getCardLinkErrorDetails,
} from '@/lib/api/cardLinkApi'
import { universalCardStableId, type UniversalCard } from '@/lib/api/cards'
import { setCardLinkingData, selectCardLinkingData } from '@/store/redux/slices/cardLinkingSlice'
import { selectUniversalCards } from '@/store/redux/slices/cardDataWalletSlice'
import { showToast } from '@/store/redux/slices/toasterSlice'

type CardPinAuthProps = {
  title?: string
  cardImageSrc: string
  maskedNumber?: string
  onVerified?: () => void
  handleNext?: (step: any) => void
  nextStep?: string
  cardType?: "Virtual" | "Universal"
  /** When true, verifies PIN via POST /card-link/{requestId}/verify-uc-pin instead of local/global PIN */
  verifyUcPinApi?: boolean
  /** When true, verifies PIN via POST /card-link/{requestId}/verify-vc-pin (uses `cardLinkingData.response`) */
  verifyVcPinApi?: boolean
}

function NativePINInput({
  value,
  maxLength,
  onChange,
  resetKey,
}: {
  value: string
  maxLength: number
  onChange: (v: string) => void
  resetKey: string | number
}) {
  const hiddenRef = useRef<HTMLInputElement>(null)
  const digits = Array.from({ length: maxLength }, (_, i) => value[i] || '')

  const focusInput = () => hiddenRef.current?.focus()

  useEffect(() => {
    const t = window.setTimeout(() => focusInput(), 150)
    return () => window.clearTimeout(t)
  }, [resetKey])

  return (
    <div className="relative w-full">
      <input
        ref={hiddenRef}
        type="tel"
        inputMode="numeric"
        autoComplete="off"
        pattern="\d*"
        enterKeyHint="done"
        maxLength={maxLength}
        value={value}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/\D/g, '').slice(0, maxLength)
          onChange(cleaned)
        }}
        className="absolute -left-[9999px] top-0 w-px h-px opacity-0"
      />

      <div className="flex gap-2.5 w-full px-5 justify-center" onClick={focusInput}>
        {digits.map((digit, i) => {
          const isCursor = i === value.length && value.length < maxLength
          return (
            <div
              key={i}
              className={`w-12 h-12 rounded-[10px] border flex items-center justify-center text-base font-semibold text-text-primary shrink-0 transition-colors ${isCursor ? 'border-primary' : digit ? 'border-text-primary' : 'border-border'
                }`}
            >
              {digit ? (
                <span className="w-3 h-3 rounded-full bg-text-primary" />
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


export default function PINVerificationScreen({
  title = 'Enter PIN for Selected Instacard',
  cardImageSrc,
  maskedNumber = '0000 0000 0000 0000',
  handleNext,
  cardType,
  onVerified: onVerifiedProp,
  nextStep = 'virtual_card_selection',
  verifyUcPinApi = false,
  verifyVcPinApi = false,
}: CardPinAuthProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const apiPinVerifyLockRef = useRef(false)
  const { verifyPin: verifyCardPin, card: managingCard } = useManagingCard()
  const globalPin = useAppSelector((s) => s.card.pin)
  const cardLinkingData = useAppSelector(selectCardLinkingData)
  const managingCardId = useAppSelector((s) => s.cardWallet.managingCardId)
  const universalCards = useAppSelector(selectUniversalCards)

  const selectedUniversal = useMemo((): UniversalCard | undefined => {
    if (!managingCardId) return undefined
    return universalCards.find(
      (c) => universalCardStableId(c) === managingCardId,
    )
  }, [managingCardId, universalCards])

  const ucPinRequestId = useMemo(() => {
    return (
      cardLinkingData.response?.requestId ?? selectedUniversal?.requestId
    )
  }, [cardLinkingData.response?.requestId, selectedUniversal])
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { t } = useTranslation()
  const { language } = useAuth()
  const isRtl = language === 'ar'


  const onVerified = useCallback(() => {
    if (onVerifiedProp) {
      onVerifiedProp()
    } else if (handleNext) {
      handleNext(nextStep as any)
    }
  }, [handleNext, nextStep, onVerifiedProp])

  const handleContinue = useCallback(async () => {
    if (verifyVcPinApi) {
      if (apiPinVerifyLockRef.current) return
      const requestId = cardLinkingData.response?.requestId
      if (!requestId) {
        dispatch(
          showToast({
            message: 'Something went wrong',
            subtitle: 'Missing link session. Please go back and try again.',
            duration: 3000,
            tosterType: 'error',
          }),
        )
        return
      }
      apiPinVerifyLockRef.current = true
      setIsVerifying(true)
      try {
        const vcCardId =
          cardLinkingData.response?.vcSummary?.vcCardId ??
          (cardLinkingData.vcCardId || undefined)
        const response = await verifyVcPin(requestId, pin, vcCardId)
        dispatch(setCardLinkingData({ response }))
        onVerified()
      } catch (err: unknown) {
        const { errorMessage: linkErrMsg } = getCardLinkErrorDetails(err)
        const msg =
          linkErrMsg ||
          (err instanceof Error ? err.message : '') ||
          t('cardPinAuth.incorrectPin')
        setError(msg)
        setPin('')
        setResetKey((prev) => prev + 1)
      } finally {
        apiPinVerifyLockRef.current = false
        setIsVerifying(false)
      }
      return
    }

    if (verifyUcPinApi) {
      if (apiPinVerifyLockRef.current) return
      const requestId = ucPinRequestId
      if (!requestId) {
        dispatch(
          showToast({
            message: 'Something went wrong',
            subtitle: 'Missing link session. Open this flow from your Universal Card.',
            duration: 3000,
            tosterType: 'error',
          }),
        )
        return
      }
      apiPinVerifyLockRef.current = true
      setIsVerifying(true)
      try {
        const response = await verifyUcPin(
          requestId,
          pin,
          // cardLinkingData.vcCardId || undefined,
          // selectedUniversal?.ucCardId,
        )
        dispatch(setCardLinkingData({ response }))
        onVerified()
      } catch (err: unknown) {
        const { errorCode, errorMessage: linkErrMsg } =
          getCardLinkErrorDetails(err)
        if (errorCode === 'LINK_ALREADY_EXISTS') {
          dispatch(
            showToast({
              message: 'Already linked',
              subtitle:
                linkErrMsg ??
                'This Virtual Card is already linked to that Universal Card.',
              duration: 5000,
              tosterType: 'error',
            }),
          )
        }
        const msg =
          (typeof err === 'object' &&
            err !== null &&
            'errorMessage' in err &&
            typeof (err as { errorMessage?: string }).errorMessage === 'string' &&
            (err as { errorMessage: string }).errorMessage) ||
          (err instanceof Error ? err.message : '') ||
          t('cardPinAuth.incorrectPin')
        setError(msg)
        setPin('')
        setResetKey((prev) => prev + 1)
      } finally {
        apiPinVerifyLockRef.current = false
        setIsVerifying(false)
      }
      return
    }

    const globalPinOk = pin === globalPin
    const isValid = managingCard ? verifyCardPin(pin) : globalPinOk
    if (isValid) {
      onVerified()
    } else {
      setError(t('cardPinAuth.incorrectPin'))
      setPin('')
      setResetKey((prev) => prev + 1)
    }
  }, [
    cardLinkingData.response,
    cardLinkingData.vcCardId,
    dispatch,
    globalPin,
    managingCard,
    onVerified,
    pin,
    selectedUniversal?.ucCardId,
    t,
    ucPinRequestId,
    verifyCardPin,
    verifyUcPinApi,
    verifyVcPinApi,
  ])

  const isComplete = pin.length === PIN_LENGTH
  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return
    if ((verifyUcPinApi || verifyVcPinApi) && apiPinVerifyLockRef.current) return
    if (!verifyUcPinApi && !verifyVcPinApi && isVerifying) return
    void handleContinue()
  }, [pin, handleContinue, verifyUcPinApi, verifyVcPinApi, isVerifying])



  return (
    <div className=" flex flex-col pt-6 h-fit " dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col h-1/2 overflow-y-auto items-center gap-2 ">
        <p className="text-md text-center text-text-primary">
          {title}
        </p>
        <div className='w-[70%] mx-auto'>

          <CardMockup
            numberSize='text-lg'
            imageSrc={cardImageSrc || '/img/cards/DebitCard.png'}
            // maskedNumber={maskedNumber}
            isclickable={false}
            showActions={false}
            showNumber={false}

          />
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <p className="text-md text-center text-text-primary">
            {t('cardPinAuth.enterYourPin')}
          </p>
          <NativePINInput
            resetKey={resetKey}
            value={pin}
            maxLength={PIN_LENGTH}
            onChange={(v) => {
              setError('')
              setPin(v)
            }}
          />
          <div className="h-4">
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col items-center py-6 gap-3 px-6 shrink-0">
          <button
            type="button"
            className="w-full py-3 rounded-[20px] bg-primary text-[#fff] font-medium text-base disabled:opacity-30 active:scale-[0.97] transition-transform"
            onClick={handleContinue}
            disabled={!isComplete || isVerifying}
          >
            {t('cardPinAuth.continue')}
          </button>
          <button
            type="button"
            onClick={() => router.replace(routes.forgetPin)}
            className="text-xs text-text-primary bg-transparent border-none cursor-pointer"
          >
            {t('cardPinAuth.forgotPin')}
          </button>
        </div>

      </div>

    </div>
  )
}
