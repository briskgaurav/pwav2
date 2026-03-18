'use client'

import { ProfileDrawer } from '@/components/ProfileDrawer'
import i18n from '@/lib/i18n'
import { useAccessDrawerStore } from '@/store/useAccessDrawerStore'
import { useUserStore } from '@/store/useUserStore'
import {
  CreditCard,
  HandCoins,
  KeyRound,
  MessageCircle,
  QrCode,
  Star,
  Store,
  Users,
  ShieldCheck,
  Smartphone,
  Wallet,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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

const features: { id: FeatureId; Icon: React.ComponentType<{ className?: string }> }[] = [
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
]

export default function GlobalAccessDrawer() {
  const visible = useAccessDrawerStore((s) => s.visible)
  const close = useAccessDrawerStore((s) => s.close)
  const router = useRouter()
  const { t } = useTranslation()
  const selectedLang = i18n.language?.split('-')[0] ?? 'en'
  const isRTL = selectedLang === 'ar'
  const { fullName, initials, email } = useUserStore()

  const handleGoBack = () => {
    close()
    router.push('/')

  }

  const handleFeatureClick = (id: FeatureId) => {
    close()
    router.push('/underdev')
  }

  return (
    <ProfileDrawer visible={visible} onClose={close} side="right">
      <div className="h-full flex flex-col p-4 bg-card-background overflow-hidden">
        <button
          type="button"
          onClick={handleGoBack}
          className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-primary text-[#fff] font-semibold  transition-all duration-200"
        >
          <span className="w-18 h-18">

            <Image src="/svg/fcmb.svg" alt="FCMB" width={1000} height={1000} className='h-full w-full object-contain' />
          </span>
          <span className='capitalize text-sm w-[70%] leading-[1.2]'>Go back to my banking app</span>
        </button>

        <div className="flex-1 overflow-y-auto">

          <div className="flex ml-4 items-center mt-8 mb-8">
            <div className="w-[50px] mr-2 h-[50px] rounded-xl bg-shadow flex items-center justify-center">
              <span className="text-xs font-bold text-text-on-primary">
                {initials}
              </span>
            </div>
            <div className="flex flex-col justify-center mt-1">

              <p className="text-xl font-semibold leading-none text-text-primary">
                {fullName}
              </p>
              <p className="text-sm text-text-secondary leading-none">{email}</p>
            </div>
          </div>

          <div className='flex items-center gap-3 w-full px-4 py-2 text-left transition-colors'>
            <span className="flex-1 text-lg font-medium text-text-primary">
              Access Features
            </span>
          </div>
          <div className="bg-light-gray py-2 px-2 rounded-xl mx-1 my-1">
            {features.map(({ id, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleFeatureClick(id)}
                className={`flex items-center gap-3 w-full py-3 px-4 my-0.5 rounded-xl transition-colors hover:bg-white/60 ${isRTL ? 'flex-row-reverse text-right' : ''
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
    </ProfileDrawer>
  )
}
