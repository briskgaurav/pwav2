'use client'

import { useState } from 'react'

import { Mail, UserPlus } from 'lucide-react'

import { RadioOption } from '@/components/ui'
import ButtonComponent from '@/components/ui/ButtonComponent'

type Choice = 'current' | 'new'

type ConfirmYourEmailScreenProps = {
  currentEmailMasked: string
  getButtonText: () => string
  onContinue: (payload: { choice: Choice; newEmail?: string }) => void
}

export default function ConfirmYourEmailScreen({
  currentEmailMasked,
  getButtonText,
  onContinue,
}: ConfirmYourEmailScreenProps) {
  const [choice, setChoice] = useState<Choice | null>(null)
  const [newEmail, setNewEmail] = useState('')

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const canContinue = choice === 'current' || (choice === 'new' && isValidEmail(newEmail))

  return (
    <div className="h-full flex p-4 flex-col">
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-semibold text-text-primary">
          Confirm Your Email
        </h2>
        <p className="text-sm text-text-secondary mt-2 mb-8">
          Would you like to continue with your existing email or register a new one?
        </p>

        <div className="space-y-3" role="radiogroup" aria-label="Choose email option">
          <RadioOption
            label={`Continue with ${currentEmailMasked || 'your existing email'}`}
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
              <div className="mt-3 px-1 animate-in slide-in-from-top-2 duration-200">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white/60 backdrop-blur-xl text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-0! focus:border-none! transition-all"
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
      </div>

      <ButtonComponent
        title={getButtonText()}
        onClick={() => {
          if (!choice) return
          onContinue({ choice, newEmail: choice === 'new' ? newEmail : undefined })
        }}
        disabled={!canContinue}
      />
    </div>
  )
}
