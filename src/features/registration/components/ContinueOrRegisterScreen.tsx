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
  const [newEmail, setNewEmail] = useState('')

  const handleContinue = () => {
    if (!choice) return

    if (choice === 'current') {
      localStorage.setItem('kyc_email', CURRENT_EMAIL)
      router.replace(routes.registrationWithExistingEmailSuccess)
    } else {
      if (!newEmail.trim()) return
      localStorage.setItem('kyc_email', newEmail)
      router.push(routes.registrationNewEmail)
    }
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const canContinue = choice === 'current' || (choice === 'new' && isValidEmail(newEmail))

  return (
    <div className="h-fit overflow-hidden flex flex-col">
      <SheetContainer>
        <div className="h-full flex flex-col p-6 py-10">
          <h2 className="text-xl font-semibold text-text-primary">
            Confirm Your Email
          </h2>
          <p className="text-sm text-text-secondary mt-2 mb-8">
            Would you like to continue with your existing email or register a new one?
          </p>

          <div className="space-y-3">
            <RadioOption
              label={`Continue with ${CURRENT_EMAIL}`}
              selected={choice === 'current'}
              onSelect={() => setChoice('current')}
              IconComponent={Mail}
            />
            <div>
              <RadioOption
                label="Register a new Email ID"
                selected={choice === 'new'}
                onSelect={() => setChoice('new')}
                IconComponent={UserPlus}
              />
              {choice === 'new' && (
                <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white/60 backdrop-blur-xl text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-0 focus:border-primary transition-all"
                    autoFocus
                  />
                  {newEmail && !isValidEmail(newEmail) && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1">
                      Please enter a valid email address
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className=" py-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)]">
            <Button fullWidth onClick={handleContinue} disabled={!canContinue}>
              {choice === 'current' ? 'Continue to Instacard' : choice === 'new' ? 'Continue With New Email' : 'Continue'}
            </Button>
          </div>
        </div>
      </SheetContainer>
    </div>
  )
}
