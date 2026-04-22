'use client'

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui";

const BANK_ACCOUNTS = [
  {
    id: 1,
    logo: '/img/montra.png',
    name: 'Montra Account 7866836869',
    checkBalanceLabel: 'Check balance',
    feeLabel: '0',
  },
  {
    id: 2,
    logo: '/svg/access.svg',
    name: 'ICICI Bank **** 0632',
    checkBalanceLabel: 'Check balance',
    feeLabel: '10',
  },
  {
    id: 3,
    logo: '/svg/gtbank.svg',
    name: 'HDFC Bank **** 4610',
    checkBalanceLabel: 'Check balance',
    feeLabel: '100',
  },
  {
    id: 4,
    logo: '/svg/ubabank.svg',
    name: 'SBI Bank **** 8731',
    checkBalanceLabel: 'Check balance',
    feeLabel: '5',
  },
];

export default function PayUsingBalance() {
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(1);

  return (
    <div className="flex-1 flex flex-col space-y-4 px-4">
      <div className="p-4 border border-border rounded-2xl w-full flex items-center justify-between">
        <p className="font-medium text-sm text-text-primary truncate">Total Payable</p>
        <p className="text-md font-bold truncate">
          <span className="line-through mr-1">N</span> 100
        </p>
      </div>



      <div className="mt-4 flex  py-4 px-6 flex-col gap-2">
        {BANK_ACCOUNTS.map((bank, idx) => (
          <label
            key={bank.id}
            className="flex items-center border border-border rounded-2xl justify-between pb-4 cursor-pointer py-2 relative"
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="balance-account"
                checked={selectedAccountId === bank.id}
                onChange={() => setSelectedAccountId(bank.id)}
                className="accent-primary h-5 w-5"
              />
              <div className="flex items-center gap-2">
                <span className="h-10 w-10 overflow-hidden rounded-xl bg-white flex items-center justify-center">
                  <Image src={bank.logo} alt={bank.name} width={500} height={500} className="h-[95%] w-[95%] object-contain" />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="truncate max-w-[150px]">{bank.name}</p>
                  <p className="text-primary truncate w-fit">{bank.checkBalanceLabel}</p>
                </div>
              </div>
            </div>
            <p className={`truncate ${bank.feeLabel === 'Free' ? '' : 'text-text-primary font-semibold'}`}>
              <span className="line-through mr-.5">N</span> {bank.feeLabel}
            </p>
            {/* {idx !== BANK_ACCOUNTS.length - 1 && (
                <span className="w-full h-px bg-border absolute bottom-0 left-0"></span>
              )} */}
            <p className="truncate">Convenience Fee</p>

          </label>
        ))}

        <div className="pt-4 w-full">


          <Button size="lg" fullWidth>
            Pay <span className=" mx-2 line-through">N</span> 100
          </Button>
        </div>




      </div>
    </div>
  );
}
