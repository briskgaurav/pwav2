'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SheetContainer, Button, RadioOption } from '@/components/ui'
import { routes } from '@/lib/routes'
import { Mail, Phone, Fingerprint } from 'lucide-react'
import { useAppSelector } from '@/store/redux/hooks'

type VerificationMethod = 'email' | 'phone' | 'bvn'

export default function VerificationMethodScreen() {
  const router = useRouter()
  const [selected, setSelected] = useState<VerificationMethod | null>(null)
  const maskedEmail = useAppSelector((s) => s.user.maskedEmail)
  const maskedMobile = useAppSelector((s) => s.user.maskedMobile)
  const maskedBvn = useAppSelector((s) => s.user.maskedBvn)

  const METHODS: { id: VerificationMethod; label: string; maskedValue: string; Icon: typeof Mail }[] = [
    { id: 'email', label: 'Verify via Email', maskedValue: maskedEmail, Icon: Mail },
    { id: 'phone', label: 'Verify via Phone Number', maskedValue: maskedMobile, Icon: Phone },
    // { id: 'bvn', label: 'Verify via BVN', maskedValue: maskedBvn, Icon: Fingerprint },
  ]

  const handleContinue = () => {
    if (!selected) return
    localStorage.setItem('kyc_verification_method', selected)
    router.push(routes.registrationVerificationConfirm)
  }

  return (
    <div className="h-fit flex flex-col">
      <SheetContainer>
        <div className="flex-1 flex flex-col p-6 py-10">
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
                selected={selected === id}
                onSelect={() => setSelected(id)}
                IconComponent={Icon}
              />
            ))}
          </div>
        </div>

        <div className="p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
          <Button fullWidth onClick={handleContinue} disabled={!selected}>
            Continue
          </Button>
        </div>
      </SheetContainer>
    </div>
  )
}
