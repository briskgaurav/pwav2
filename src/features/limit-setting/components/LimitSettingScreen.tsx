'use client'

import { Button, Header, SheetContainer } from '@/components/ui'
import { ICONS } from '@/constants/icons'
import React from 'react'

import LimitToggle from './LimitToggle'
import { useLimitSettingStore } from '../store/useLimitSettingStore'
import LimitFAQ from './LimitFAQ'
import LimitSetComponent from './LimitSetComponent'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'


const domesticLimitItems = [
  {
    title: 'Merchant Outlet',
    description: 'Spending Limit for Point of Sale (POS) at merchant outlets',
    iconSrc: ICONS.merchant,
    dailyLimit: 275000,
    maxLimit: 375000,
    isEnabled: true,
  },
  {
    title: 'Online Spends',
    description: 'Online spending limit',
    iconSrc: ICONS.phone,
    dailyLimit: 275000,
    maxLimit: 275000,
    isEnabled: true,
  },
  {
    title: 'Tap & Pay',
    description: 'Tap & Pay (without PIN) Max ₦ 5000 limit per transaction',
    iconSrc: ICONS.merchant,
    dailyLimit: 20000,
    maxLimit: 20000,
    isEnabled: false,
  },
  {
    title: 'ATM Withdrawal',
    description: 'Online spending limit',
    iconSrc: ICONS.merchant,
    dailyLimit: 100000,
    maxLimit: 375000,
    isEnabled: true,
  },
]

const internationalLimitItems = [
  {
    title: 'Merchant Outlet',
    description: 'International spending limit for Point of Sale (POS)',
    iconSrc: ICONS.merchant,
    dailyLimit: 500000,
    maxLimit: 750000,
    isEnabled: true,
  },
  {
    title: 'Online Spends',
    description: 'International online spending limit',
    iconSrc: ICONS.phone,
    dailyLimit: 500000,
    maxLimit: 500000,
    isEnabled: true,
  },
  {
    title: 'Tap & Pay',
    description: 'Tap & Pay (without PIN) Max $50 limit per transaction',
    iconSrc: ICONS.merchant,
    dailyLimit: 50000,
    maxLimit: 50000,
    isEnabled: false,
  },
  {
    title: 'ATM Withdrawal',
    description: 'International ATM withdrawal limit',
    iconSrc: ICONS.merchant,
    dailyLimit: 200000,
    maxLimit: 500000,
    isEnabled: true,
  },
]

export default function LimitSettingScreen() {
  const { activeTab, setActiveTab } = useLimitSettingStore()
  const router = useRouter()
  const limitItems = activeTab === 'domestic' ? domesticLimitItems : internationalLimitItems

  return (
    <div className="h-screen flex flex-col">
      {/* <Header title="Limit Settings" showBackButton /> */}
      <SheetContainer>
        <div className="flex-1 overflow-auto pb-10 p-4 pt-8 space-y-4">
          <LimitToggle value={activeTab} onChange={setActiveTab} />
          <LimitFAQ />
          {limitItems.map((item, index) => (
            <LimitSetComponent
              key={index}
              title={item.title}
              description={item.description}
              icon={item.iconSrc}
              dailyLimit={item.dailyLimit}
              maxLimit={item.maxLimit}
              isEnabled={item.isEnabled}
              onToggle={() => {}}
              borderBottom={index !== limitItems.length - 1}
            />
          ))}
        </div>
        <div
          style={{
            padding: '0px 16px 24px',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
          }}
        >
          <Button fullWidth onClick={() => {
            router.push(routes.limitSettingVerifyEmail)
          }}>
          Save Limit
          </Button>
        </div>
      </SheetContainer>
    </div>
  )
}
