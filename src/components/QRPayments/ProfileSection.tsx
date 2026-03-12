'use client'

import { Check } from 'lucide-react'

interface ProfileSectionProps {
  name: string
  phone: string
  upiId: string
  initials: string
}

export function ProfileSection({ name, phone, upiId, initials }: ProfileSectionProps) {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="w-[60px] h-[60px] rounded-full bg-orange flex items-center justify-center mb-3">
        <span className="text-2xl font-medium text-white">{initials}</span>
      </div>

      <div className="flex items-center gap-1 mb-1">
        <span className="text-2xl font-medium text-text-primary">{name}</span>
        <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      </div>

      <span className="text-sm text-text-secondary mb-0.5">{phone}</span>
      <span className="text-sm text-text-secondary">{upiId}</span>
    </div>
  )
}
