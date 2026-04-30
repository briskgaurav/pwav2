'use client'

import { useState } from "react";
import Image from "next/image";
import ButtonComponent from "@/components/ui/ButtonComponent";
import { formatAmountWithCommas } from "@/lib/format-amount";
import NiaraSymbol from "@/components/Extras/NiaraSymbol";
import CardPinVerificationDrawer from "@/components/screens/AuthScreens/CardPinVerificationDrawer";

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
              {/* Custom radio to match AddMoneyCardsSection type */}
              <button
                type="button"
                tabIndex={0}
                aria-label={`Select ${bank.name}`}
                className="ml-5 outline-none border-none bg-transparent p-0"
                onClick={() => setSelectedAccountId(bank.id)}
              >
                <span
                  className={`flex items-center justify-center rounded-full ${
                    isSelected
                      ? 'w-[22px] h-[22px] border'
                      : 'w-[22px] h-[22px] border border-text-primary'
                  }`}
                >
                  {isSelected && <span className='w-[12px] h-[12px] rounded-full bg-orange' />}
                </span>
              </button>
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
        visible={pinDrawerOpen}
        onClose={() => setPinDrawerOpen(false)}
        showTitle={false}
        subtitle="Enter Your PIN"
        onVerified={() => {
          if (!selectedAccountId) return
          setPinDrawerOpen(false)
          onPay?.({ accountId: selectedAccountId, amount: totalPayable })
        }}
      />
    </div>
  );
}
