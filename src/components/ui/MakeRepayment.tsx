'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from './button'
import { Dropdown } from './Dropdown'
import { routes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { AddCardIcon } from '@/constants/icons'

type PaymentOption = 'full' | 'minimum' | 'other'

type BankAccount = {
  id: string
  bank: string
  accountNumber: string
  accountName: string
}

const BANK_ACCOUNTS: BankAccount[] = [
  { id: 'sigma', bank: 'Sigma Bank', accountNumber: '1234567890', accountName: 'John Doe' },
  { id: 'gtb', bank: 'GTBank', accountNumber: '0987654321', accountName: 'John Doe' },
  { id: 'access', bank: 'Access Bank', accountNumber: '5678901234', accountName: 'John Doe' },
]

export default function MakeRepayment() {
  const [selectedOption, setSelectedOption] = useState<PaymentOption>('full')
  const router = useRouter()

  const [selectedBank, setSelectedBank] =
    useState<BankAccount>(BANK_ACCOUNTS[0])

  const [amounts, setAmounts] = useState({
    full: '625,000',
    minimum: '62,500',
    other: '',
  })

  const handleAmountChange = (
    option: PaymentOption,
    value: string
  ) => {
    setAmounts((prev) => ({ ...prev, [option]: value }))
  }

  const renderFields = (option: PaymentOption) => {
    const isActive = selectedOption === option

    return (
      <div
        className={`
          transition-all duration-300 ease-out
          ${
            isActive
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2 pointer-events-none absolute'
          }
        `}
      >
        {isActive && (
          <div className='space-y-3 pt-3'>
            <div className='field-item'>
              <Dropdown<BankAccount>
                label="Select Bank Account"
                placeholder="Select bank..."
                value={selectedBank}
                options={BANK_ACCOUNTS}
                onChange={setSelectedBank}
                getOptionLabel={(bank) =>
                  `${bank.bank} · ${bank.accountNumber}`
                }
              />
            </div>

            <input
              type='none'
              autoComplete="one-time-code"
              placeholder='Enter Amount'
              value={amounts[option]}
              onChange={(e) =>
                handleAmountChange(option, e.target.value)
              }
              className='field-item w-full border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none transition-colors'
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='p-5 border border-border rounded-2xl space-y-4'>
      <div className='flex items-center gap-4'>
        <div className='w-5 h-5 flex items-center justify-center shrink-0'>
        <AddCardIcon />
        </div>
        <p className='text-text-primary text-md font-medium'>
          Make Repayment
        </p>
      </div>

      <div>
        <button
          onClick={() => setSelectedOption('full')}
          className='flex items-center gap-3 w-full text-left'
        >
          {renderRadioButton(selectedOption === 'full')}
          <span className='text-sm text-text-primary'>
            Pay Full Outstanding Amount
          </span>
        </button>
        {renderFields('full')}
      </div>

      <div>
        <button
          onClick={() => setSelectedOption('minimum')}
          className='flex items-center gap-3 w-full text-left'
        >
          {renderRadioButton(selectedOption === 'minimum')}
          <span className='text-sm text-text-primary'>
            Pay Minimum Due Amount
          </span>
        </button>
        {renderFields('minimum')}
      </div>

      <div>
        <button
          onClick={() => setSelectedOption('other')}
          className='flex items-center gap-3 w-full text-left'
        >
          {renderRadioButton(selectedOption === 'other')}
          <span className='text-sm text-text-primary'>
            Pay other Amount for Repayment
          </span>
        </button>
        {renderFields('other')}
      </div>

      <Button
        onClick={() =>
          router.push(routes.makeRepaymentsVerifyOtp)
        }
        variant='primary'
        size='lg'
        fullWidth
      >
        Pay Now
      </Button>
    </div>
  )
}

function renderRadioButton(isSelected: boolean) {
  return (
    <span className={`w-5 h-5 rounded-full border-2 flex border-text-primary items-center justify-center transition-all duration-300`}>
      {isSelected && (
        <span className='w-3 h-3 rounded-full bg-orange' />
      )}
    </span>
  )
}