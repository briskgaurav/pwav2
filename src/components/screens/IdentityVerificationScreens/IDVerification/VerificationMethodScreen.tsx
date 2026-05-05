'use client'

import { useEffect, useMemo, useState } from 'react'

import { type LucideIcon } from 'lucide-react'

import { RadioOption } from '@/components/ui'
import ButtonComponent from '@/components/ui/ButtonComponent'
import { ChatIcon, PhoneIcon } from '@/constants/icons'
import type { UserInfo } from '@/lib/api/idVerification'

type VerificationMethod = 'email' | 'phone' | 'bvn'

function maskEmail(email: string) {
  const value = email.trim().toLowerCase()
  const [local, domain] = value.split('@')
  if (!local || !domain) return '***'
  return `${local[0]}***@${domain}`
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return '***'
  return `+${digits.slice(0, 3)} *** *** ${digits.slice(-4)}`
}

export default function VerificationMethodScreen({
  userInfo,
  getButtonText,
  handleContinue,
}: {
  userInfo: UserInfo
  getButtonText: () => string
  handleContinue: () => void
}) {
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('kyc_verification_method') as VerificationMethod | null
    if (stored === 'email' || stored === 'phone') setSelectedMethod(stored)
  }, [])

  const METHODS: { id: VerificationMethod; label: string; maskedValue: string; Icon: LucideIcon }[] = useMemo(() => {
    const email = userInfo.email ?? ''
    const phone = userInfo.phone_number ?? ''
    return [
      { id: 'email', label: 'Verify via Email', maskedValue: email ? maskEmail(email) : '***', Icon: ChatIcon as LucideIcon },
      { id: 'phone', label: 'Verify via Phone Number', maskedValue: phone ? maskPhone(phone) : '***', Icon: PhoneIcon as LucideIcon },
    ]
  }, [userInfo])

  return (
    <div className="h-fit flex flex-col">
      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-xl font-semibold text-text-primary">
          Choose Verification Method
        </h2>
        <p className="text-sm text-text-secondary mt-2 mb-8">
          Select how you&apos;d like to verify your identity for KYC
        </p>

        <div className="flex flex-col gap-3" role="radiogroup" aria-label="Choose verification method">
          {METHODS.map(({ id, label, maskedValue, Icon }) => (
            <RadioOption
              key={id}
              label={maskedValue}
              selected={selectedMethod === id}
              onSelect={() => {
                setSelectedMethod(id)
                if (typeof window !== 'undefined') {
                  localStorage.setItem('kyc_verification_method', id)
                }
              }}
              IconComponent={Icon}
            />
          ))}
        </div>
      </div>
      <ButtonComponent title={getButtonText()} onClick={handleContinue} disabled={selectedMethod === null} />

    </div>
  )
}
