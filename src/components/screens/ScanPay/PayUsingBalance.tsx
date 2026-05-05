'use client'

import { useState } from "react";

import Image from "next/image";

import NiaraSymbol from "@/components/Extras/NiaraSymbol";
import CardPinVerificationDrawer from "@/components/screens/AuthScreens/CardPinVerificationDrawer";
import ButtonComponent from "@/components/ui/ButtonComponent";
import { formatAmountWithCommas } from "@/lib/format-amount";
import { usePaymentProcessing } from "@/hooks/usePaymentProcessing";
import { CustomRadioBTN, PaymentProcessingOverlay } from "@/components/ui";

// Optional: Assign some dummy balances to be shown
const BANK_ACCOUNTS = [
  {
    id: 1,
    logo: '/img/montra.png',
    name: 'Montra Account 7866836869',
    checkBalanceLabel: 'Check balance',
    feeLabel: '0',
    balance: '₦ 12,000.80',
  },
  {
    id: 2,
    logo: '/svg/access.svg',
    name: 'ICICI Bank **** 0632',
    checkBalanceLabel: 'Check balance',
    feeLabel: '10',
    balance: '₦ 50,100.55',
  },
  {
    id: 3,
    logo: '/svg/gtbank.svg',
    name: 'HDFC Bank **** 4610',
    checkBalanceLabel: 'Check balance',
    feeLabel: '100',
    balance: '₦ 2,890.22',
  },
  {
    id: 4,
    logo: '/svg/ubabank.svg',
    name: 'SBI Bank **** 8731',
    checkBalanceLabel: 'Check balance',
    feeLabel: '5',
    balance: '₦ 720.00',
  },
  {
    id: 5,
    logo: '/img/montra.png',
    name: 'Montra Account 7866836869',
    checkBalanceLabel: 'Check balance',
    feeLabel: '0',
    balance: '₦ 12,000.80',
  },
  {
    id: 6,
    logo: '/svg/access.svg',
    name: 'ICICI Bank **** 0632',
    checkBalanceLabel: 'Check balance',
    feeLabel: '10',
    balance: '₦ 50,100.55',
  },
  {
    id: 7,
    logo: '/svg/gtbank.svg',
    name: 'HDFC Bank **** 4610',
    checkBalanceLabel: 'Check balance',
    feeLabel: '100',
    balance: '₦ 2,890.22',
  },
  {
    id: 8,
    logo: '/svg/ubabank.svg',
    name: 'SBI Bank **** 8731',
    checkBalanceLabel: 'Check balance',
    feeLabel: '5',
    balance: '₦ 720.00',
  },
];

type PayUsingBalanceProps = {
  amount?: number
  onPay?: (payload: { accountId: number; amount?: number }) => void
}

export default function PayUsingBalance({ amount, onPay }: PayUsingBalanceProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(1);
  const [showBalanceFor, setShowBalanceFor] = useState<number | null>(null);
  const [pinDrawerOpen, setPinDrawerOpen] = useState(false)
  const processing = usePaymentProcessing()

  function parseNairaAmount(value: string): number {
    // Examples: "₦ 12,000.80"
    const cleaned = value.replace(/[^\d.]/g, '')
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : 0
  }

  async function simulateNetworkBalanceFetch(bankId: number): Promise<number> {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 600))
    // Simulate occasional network error
    if (Math.random() < 0.2) {
      throw new Error('NETWORK_ERROR')
    }
    const bank = BANK_ACCOUNTS.find((b) => b.id === bankId)
    return bank ? parseNairaAmount(bank.balance) : 0
  }

  const startPayment = async (accountId: number) => {
    processing.start({ minDurationMs: 5000 })

    try {
      const balance = await simulateNetworkBalanceFetch(accountId)
      if (balance < totalPayable) {
        processing.fail('Sorry', 'Insufficient balance.')
        return
      }

      processing.succeedAfterMinDuration(() => onPay?.({ accountId, amount: totalPayable }), 5000)
    } catch (e) {
      processing.fail('Network error', 'Please check your internet connection and try again.')
    }
  }

  function handleCheckBalance(bankId: number) {
    setShowBalanceFor(showBalanceFor === bankId ? null : bankId);
  }

  const baseAmount = Number(amount ?? 0) || 0
  const selectedBank = BANK_ACCOUNTS.find((b) => b.id === selectedAccountId) ?? null
  const convenienceFee = Number(selectedBank?.feeLabel ?? 0) || 0
  const totalPayable = baseAmount + convenienceFee

  return (
    <div className="flex-1 overflow-y-auto pb-24 flex flex-col px-4">
      <div className="p-4 border border-border rounded-2xl w-full flex items-center justify-between">
        <p className="font-medium text-sm text-text-primary truncate">Total Payable</p>
        <p className="text-md font-bold truncate">
          <span className="line-through mr-1"><NiaraSymbol /></span> {formatAmountWithCommas(totalPayable.toString())}
        </p>
      </div>

      <div className="flex py-4 flex-col gap-2">
        {BANK_ACCOUNTS.map((bank) => {
          const isSelected = selectedAccountId === bank.id;
          return (
            <label
              key={bank.id}
              className="flex border border-border rounded-2xl items-center justify-between p-4 relative"
            >
              <div className="w-full flex flex-col items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <span className="h-10 w-10 overflow-hidden rounded-xl bg-white flex items-center justify-center">
                        <Image src={bank.logo} alt={bank.name} width={500} height={500} className="h-[95%] w-[95%] object-contain" />
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="truncate text-xs max-w-[150px]">{bank.name}</p>
                      {showBalanceFor === bank.id ? (
                        <span className="text-xs mt-1">
                          {bank.balance}
                        </span>
                      ) : (
                        <span
                          onClick={e => {
                            // e.stopPropagation();
                            handleCheckBalance(bank.id);
                          }}
                          className="text-primary text-xs w-fit truncate cursor-pointer p-0 border-none"
                          tabIndex={-1}
                        >
                          {bank.checkBalanceLabel}
                        </span>
                      )}

                    </div>
                  </div>
                </div>
                <p className="text-text-primary mt-2 ml-1 text-xs truncate w-fit">
                  Convenience Fee : <span className="line-through mr-1"> N</span>{bank.feeLabel}
                </p>
              </div>
              <CustomRadioBTN
                name="selectedAccount"
                ariaLabel={`Select ${bank.name}`}
                checked={isSelected}
                onChange={() => setSelectedAccountId(bank.id)}
                className="ml-5"
                sizePx={22}
              />

            </label>
          )
        })}

        <ButtonComponent
          title={`Pay Now ₦ ${formatAmountWithCommas(totalPayable.toString())}`}
          onClick={() => {
            if (!selectedAccountId) return
            setPinDrawerOpen(true)
          }}
        />
      </div>

      <CardPinVerificationDrawer
        fieldLength={6}
        visible={pinDrawerOpen}
        onClose={() => {
          if (processing.model.open) return
          setPinDrawerOpen(false)
        }}
        showTitle={false}
        subtitle="Enter Your 6 Digit OTP"
        onVerified={() => {
          if (!selectedAccountId) return
          setPinDrawerOpen(false)
          void startPayment(selectedAccountId)
        }}
      />

      <PaymentProcessingOverlay
        open={processing.model.open}
        state={processing.model.state}
        title={processing.model.title}
        subtitle={processing.model.subtitle}
        primaryActionLabel={processing.model.state === 'error' ? 'Try again' : undefined}
        onPrimaryAction={
          processing.model.state === 'error' && selectedAccountId
            ? () => void startPayment(selectedAccountId)
            : undefined
        }
        secondaryActionLabel={processing.model.state === 'error' ? 'Close' : undefined}
        onSecondaryAction={processing.model.state === 'error' ? () => processing.close() : undefined}
      />
    </div>
  );
}
