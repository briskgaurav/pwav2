'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RadioOption } from '@/components/ui'
import { notifyNavigation } from '@/lib/bridge'
import { haptic } from '@/lib/useHaptics'
import { routes } from '@/lib/routes'
import type { CardType } from '@/lib/types'
import ButtonComponent from '../../ui/ButtonComponent'
import LayoutSheet from '../../ui/LayoutSheet'

const CARD_TYPE_OPTIONS = [
  { id: 'debit' as const, label: 'Debit Card', icon: '/svg/debitcard.svg' },
  { id: 'credit' as const, label: 'Credit Card', icon: '/svg/creditcard.svg' },
  { id: 'prepaid' as const, label: 'Pre-Paid Card', icon: '/svg/prepaidcard.svg' },
  { id: 'gift' as const, label: 'Gift A Card', icon: '/svg/giftcard.svg' },
] satisfies readonly { id: CardType; label: string; icon: string }[]

export default function AddInstacardScreen() {
  const router = useRouter()

  const [selectedType, setSelectedType] = useState<CardType>('debit')

  useEffect(() => {
    notifyNavigation('select-card-type')
  }, [])

  const handleNext = () => {
    router.push(routes.addCard(selectedType))
    haptic('medium')
  }

  return (
    <LayoutSheet routeTitle="Add Instacard" needPadding={false}>

      <div className="min-h-full flex flex-col">
        <div className="flex-1 overflow-auto p-6 py-10">
          <p className="text-[4vw] text-text-primary leading-[1.4] mb-[5vw]">
            Select the type of Instacard you would like to be issued
          </p>

          <div role="radiogroup" className="flex flex-col gap-[3vw]">
            {CARD_TYPE_OPTIONS.map((option) => (
              <RadioOption
                icon={option.icon}
                key={option.id}
                label={option.label}
                selected={option.id === selectedType}
                onSelect={() => {
                  setSelectedType(option.id)
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            padding: '8px 16px 24px',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
          }}
        >
          <ButtonComponent title="Next" onClick={handleNext} />

        </div>
      </div>
    </LayoutSheet>

  );
}
