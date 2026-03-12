'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SheetContainer, Button, RadioOption } from '@/components/ui'
import { routes } from '@/lib/routes'
import { Mail, UserPlus } from 'lucide-react'

type Choice = 'current' | 'new'

const CURRENT_EMAIL = 'nird***malik@gmail.com'

export default function ContinueOrRegisterScreen() {
  const router = useRouter()
  const [choice, setChoice] = useState<Choice | null>(null)

  const handleContinue = () => {
    if (!choice) return

    if (choice === 'current') {
      localStorage.setItem('kyc_email', CURRENT_EMAIL)
      router.replace(routes.registrationVerifyExistingEmail)
    } else {
      router.push(routes.registrationNewEmail)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <SheetContainer>
        <div className="flex-1 flex flex-col p-6 py-10">
          <h2 className="text-xl font-semibold text-text-primary">
            Email Registration
          </h2>
          <p className="text-sm text-text-secondary mt-2 mb-8">
            Would you like to continue with your existing email or register a new one?
          </p>

          <div className="flex flex-col gap-3">
            <RadioOption
              label={`Continue with ${CURRENT_EMAIL}`}
              selected={choice === 'current'}
              onSelect={() => setChoice('current')}
              IconComponent={Mail}
            />
            <RadioOption
              label="Register a new Email ID"
              selected={choice === 'new'}
              onSelect={() => setChoice('new')}
              IconComponent={UserPlus}
            />
          </div>
        </div>

        <div className="p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
          <Button fullWidth onClick={handleContinue} disabled={!choice}>
            {choice === 'current' ? 'Continue to Instacard' : choice === 'new' ? 'Register New Email' : 'Continue'}
          </Button>
        </div>
      </SheetContainer>
    </div>
  )
}
