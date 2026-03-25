'use client'

import { LimitationsIcon, MerchantIcon, PhoneIcon } from '@/constants/icons'
import React from 'react'

import LimitToggle from '../../ui/LimitToggle'
import { useAppSelector, useAppDispatch } from '@/store/redux/hooks'
import { setActiveTab } from '@/store/redux/slices/limitSettingSlice'
import type { LimitTab } from '@/store/redux/slices/limitSettingSlice'
import LimitFAQ from '../../ui/LimitFAQ'
import LimitSetComponent from '../../ui/LimitSetComponent'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import LayoutSheet from '@/components/ui/LayoutSheet'
import ButtonComponent from '@/components/ui/ButtonComponent'


const domesticLimitItems = [
  {
    title: 'Merchant Outlet',
    description: 'Spending Limit for Point of Sale (POS) at merchant outlets',
    icon: MerchantIcon,
    dailyLimit: 275000,
    maxLimit: 375000,
    isEnabled: true,
  },
  {
    title: 'Online Spends',
    description: 'Online spending limit',
    icon: PhoneIcon,
    dailyLimit: 275000,
    maxLimit: 275000,
    isEnabled: true,
  },
  {
    title: 'Tap & Pay',
    description: 'Tap & Pay (without PIN) Max ₦ 5000 limit per transaction',
    icon: LimitationsIcon,
    dailyLimit: 20000,
    maxLimit: 20000,
    isEnabled: false,
  },
  {
    title: 'ATM Withdrawal',
    description: 'Daily ATM withdrawal limit',
    icon: LimitationsIcon,
    dailyLimit: 100000,
    maxLimit: 375000,
    isEnabled: true,
  },
]

const internationalLimitItems = [
  {
    title: 'Merchant Outlet',
    description: 'International spending limit for Point of Sale (POS)',
    icon: MerchantIcon,
    dailyLimit: 500000,
    maxLimit: 750000,
    isEnabled: true,
  },
  {
    title: 'Online Spends',
    description: 'International online spending limit',
    icon: PhoneIcon,
    dailyLimit: 500000,
    maxLimit: 500000,
    isEnabled: true,
  },
  {
    title: 'Tap & Pay',
    description: 'Tap & Pay (without PIN) Max $50 limit per transaction',
    icon: LimitationsIcon,
    dailyLimit: 50000,
    maxLimit: 50000,
    isEnabled: false,
  },
  {
    title: 'ATM Withdrawal',
    description: 'International ATM withdrawal limit',
    icon: LimitationsIcon,
    dailyLimit: 200000,
    maxLimit: 500000,
    isEnabled: true,
  },
]

export default function LimitSettingScreen() {
  const dispatch = useAppDispatch()
  const activeTab = useAppSelector((s) => s.limitSetting.activeTab)
  const handleSetActiveTab = (tab: LimitTab) => dispatch(setActiveTab(tab))
  const router = useRouter()
  const limitItems = activeTab === 'domestic' ? domesticLimitItems : internationalLimitItems

  return (
    <LayoutSheet routeTitle="Limit Settings" needPadding={false}>
      <div className="flex-1 overflow-auto pb-10 p-4 pt-8 space-y-4">
        <LimitToggle value={activeTab} onChange={handleSetActiveTab} />
        <LimitFAQ />
        {limitItems.map((item, index) => (
          <LimitSetComponent
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
            dailyLimit={item.dailyLimit}
            maxLimit={item.maxLimit}
            isEnabled={item.isEnabled}
            onToggle={() => { }}
            borderBottom={index !== limitItems.length - 1}
          />
        ))}
      </div>

      <ButtonComponent title="Save Limit" onClick={() => {
        router.push(routes.limitSettingVerifyEmail)
      }} />
    </LayoutSheet>
  )
}
