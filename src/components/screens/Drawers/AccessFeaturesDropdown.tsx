'use client'

import { useCallback, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  ChevronDown,
  CreditCard,
  HandCoins,
  KeyRound,
  MessageCircle,
  QrCode,
  Star,
  Store,
  Users,
  Wallet,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'


type FeatureId =
  | 'digitalAccountWallet'
  | 'virtualCardWallet'
  | 'merchantAccountWallet'
  | 'agencyBanking'
  | 'instantDigitalLoans'
  | 'upgradeKyc'
  | 'rewardsManagement'
  | 'softTokenAccount'
  | 'chatboxHelpSupport'
  | 'scanPay'

type FeatureRow = {
  id: FeatureId
  Icon: React.ComponentType<{ className?: string }>
}

interface AccessFeaturesDropdownProps {
  isRTL?: boolean
  onSelect?: (id: FeatureId) => void
}

export function AccessFeaturesDropdown({
  isRTL = false,
  onSelect,
}: AccessFeaturesDropdownProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()

  const features = useMemo<FeatureRow[]>(
    () => [
      { id: 'digitalAccountWallet', Icon: Smartphone },
      { id: 'virtualCardWallet', Icon: CreditCard },
      { id: 'merchantAccountWallet', Icon: Store },
      { id: 'agencyBanking', Icon: Users },
      { id: 'instantDigitalLoans', Icon: HandCoins },
      { id: 'upgradeKyc', Icon: ShieldCheck },
      { id: 'rewardsManagement', Icon: Star },
      { id: 'softTokenAccount', Icon: KeyRound },
      { id: 'chatboxHelpSupport', Icon: MessageCircle },
      { id: 'scanPay', Icon: QrCode },
    ],
    []
  )

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-3 w-full py-4 px-4 text-left transition-colors"
        aria-expanded={isOpen}
        aria-label={t('profile.accessFeatures')}
      >
        <span className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-light-gray">
          <Wallet className="w-5 h-5 text-primary" />
        </span>
        <span className="flex-1 text-[15px] font-medium text-text-primary">
          {t('profile.accessFeatures')}
        </span>
        <ChevronDown
          className={`w-[18px] h-[18px] text-text-secondary transition-transform duration-300 ease-out ${
            isOpen ? 'rotate-180' : ''
          } ${isRTL ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{ maxHeight: isOpen ? '300' : 0 }}
      >
        <div className="bg-light-gray py-2 px-2 rounded-xl mx-1 my-1  overflow-y-auto">
          {features.map(({ id, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                onSelect?.(id)
                router.push(`/underdev`)
              }}
              className={`flex items-center gap-3 w-full py-3 px-4 my-0.5 rounded-xl transition-colors hover:bg-white/60 ${
                isRTL ? 'flex-row-reverse text-right' : ''
              }`}
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-white/70">
                <Icon className="w-5 h-5 text-text-primary" />
              </span>
              <span className="text-sm font-medium text-text-primary">
                {t(`accessFeatures.${id}`)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
