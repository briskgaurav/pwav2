'use client'

import Link from 'next/link'
import { useState } from 'react';
import LayoutSheet from '@/components/ui/LayoutSheet'
import Image from "next/image";
import { Button } from '@/components/ui';
import NiaraSymbol from '@/components/Extras/NiaraSymbol';

export default function InitiatePayment() {

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Payment request initiated!\nAmount: ${amount}\nDescription: ${description}`);
  };

  return (
    <LayoutSheet needPadding={false} routeTitle='Beneficiary Details'>
      <div className='flex-1 w-full flex flex-col min-h-full'>

        {/* Beneficiary Card */}
        <div className='px-4 pt-4'>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
            {/* Avatar */}
            <div className="flex justify-center mb-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-black font-bold text-lg"
                style={{ backgroundColor: '#E8D5F5' }}
              >
                AR
              </div>
            </div>

            {/* Verified Name Row */}
            <div className="flex flex-row items-center justify-center gap-2 mb-1">
              <p className="text-sm text-gray-500">Verified Name</p>
              <Image
                src="/img/hibadgechek.png"
                alt="Verified"
                width={18}
                height={18}
                className="rounded-full"
              />
            </div>

            {/* Name */}
            <p className="text-xl font-bold text-gray-900 mb-1">Ashish Rai</p>

            {/* Since */}
            <p className="text-sm text-gray-500">On Montra Since May 2023</p>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col flex-1 px-4 pt-6 pb-6 gap-4">

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-800">Enter Amount  <NiaraSymbol /> </label>
           
            <input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-800">
              Description / Narration <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              placeholder="Write Description here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-xl border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>

          {/* Spacer to push button to bottom */}
          <div className="flex-1" />

          {/* CTA Button */}
          <button
            onClick={handleSubmit}
            className="w-full rounded-full py-4 text-white font-semibold text-base"
            style={{ backgroundColor: '#5A1186' }}
          >
            Initiate Payment Request
          </button>
        </div>

      </div>
    </LayoutSheet>
  );
}