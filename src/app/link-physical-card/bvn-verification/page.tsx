'use client'
import { SheetContainer, Button } from '@/components/ui'
import { ICONS, MessageIcon, PhoneIcon } from '@/constants/icons'
import { RadioOption2 } from '@/components/ui/RadioButton2'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import React, { ComponentType, useState } from 'react'
import { LucideIcon } from 'lucide-react'
import { useAppSelector } from '@/store/redux/hooks'

const VERIFICATION_OPTIONS_CONFIG = (maskedMobile: string, maskedEmail: string) => [
  { id: 'phone' as const, label: maskedMobile, Icon: PhoneIcon },
  { id: 'email' as const, label: maskedEmail, Icon: MessageIcon },
]

type VerificationOption = 'phone' | 'email'

export default function page() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<VerificationOption>('phone')
  const maskedMobile = useAppSelector((s) => s.user.maskedMobile)
  const maskedEmail = useAppSelector((s) => s.user.maskedEmail)
  const VERIFICATION_OPTIONS = VERIFICATION_OPTIONS_CONFIG(maskedMobile, maskedEmail)

  const handleNext = () => {
    if(selectedOption === 'phone') {
      router.push(routes.linkVerifyOtp)
    } else {
      router.push(routes.linkVerifyEmail)
    }
  }

  return (
    <div className='h-screen w-full flex flex-col'>
      <SheetContainer>
        <div className='h-full w-full flex flex-col justify-start items-center overflow-auto pt-10 space-y-4 p-6'>

          <p>Your BVN has been found linked to the following phone numbers / email address. Please select any one to help us verify your identity</p>

          <div className='w-full space-y-4 my-5'>
            <p>We will send an OTP to verify your identity</p>
            <div className='flex flex-col gap-2'>
              {VERIFICATION_OPTIONS.map((option) => (
                <RadioOption2
                  key={option.id}
                  label={option.label}
                  selected={selectedOption === option.id}
                  IconComponent={option.Icon as LucideIcon}
                  onSelect={() => setSelectedOption(option.id)}
                />
              ))}
            </div>

            <p className='text-text-primary mt-10 text-sm'>This Instacard has been successfully linked to your Universal Card</p>
            <div className='border flex gap-10 items-center justify-center border-text-primary/20 rounded-2xl p-4'>

              <div className='h-auto w-22 rounded-lg overflow-hidden aspect-[1.58] '>
                <Image src={ICONS.debitCard} alt='Mastercard' width={1000} height={1000} className='h-full w-full object-cover' />
              </div>
              <p className='text-text-primary text-xs'>**** **** ****  1234 (Universal card)</p>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '8px 16px 24px',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
          }}
        >
          <Button fullWidth onClick={handleNext}>
            Send OTP
          </Button>
        </div>
      </SheetContainer>
    </div>
  )
}
