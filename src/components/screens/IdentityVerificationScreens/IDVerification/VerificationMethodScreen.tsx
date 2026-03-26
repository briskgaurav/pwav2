'use client'

import { useState } from 'react'
import { RadioOption } from '@/components/ui'
import { LucideIcon } from 'lucide-react'
import { ChatIcon, PhoneIcon } from '@/constants/icons'
import ButtonComponent from '@/components/ui/ButtonComponent'

type VerificationMethod = 'email' | 'phone' | 'bvn'

export default function VerificationMethodScreen({ getButtonText, handleContinue }: { getButtonText: () => string, handleContinue: () => void }) {
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null)

  const METHODS: { id: VerificationMethod; label: string; maskedValue: string; Icon: LucideIcon }[] = [
    { id: 'email', label: 'Verify via Email', maskedValue: 'j***@example.com', Icon: ChatIcon as LucideIcon },
    { id: 'phone', label: 'Verify via Phone Number', maskedValue: '+234 *** *** 1234', Icon: PhoneIcon as LucideIcon },
  ]

  return (
    <div className="h-fit flex flex-col">
      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-xl font-semibold text-text-primary">
          Choose Verification Method
        </h2>
        <p className="text-sm text-text-secondary mt-2 mb-8">
          Select how you&apos;d like to verify your identity for KYC
        </p>

        <div className="flex flex-col gap-3">
          {METHODS.map(({ id, label, maskedValue, Icon }) => (
            <RadioOption
              key={id}
              label={maskedValue}
              selected={selectedMethod === id}
              onSelect={() => setSelectedMethod(id)}
              IconComponent={Icon}
            />
          ))}
        </div>
      </div>
      <ButtonComponent title={getButtonText()} onClick={handleContinue} disabled={selectedMethod === null} />

    </div>
  )
}
