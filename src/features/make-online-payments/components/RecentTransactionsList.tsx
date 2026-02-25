'use client'

import React from 'react'
import { useOnlinePaymentStore } from '../store/useOnlinePaymentStore'
import type { Transaction } from '../store/useOnlinePaymentStore'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { ChevronRight } from 'lucide-react'
import { haptic } from '@/lib/useHaptics'

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const router = useRouter()

  const handleClick = () => {
    haptic('light')
    router.push(routes.transactionReceipt(transaction.id))
  }

  const status = transaction.status

  const statusColor =
    status === 'success'
      ? 'text-success'
      : status === 'failed'
        ? 'text-error'
        : 'text-orange'

  const statusDot =
    status === 'success'
      ? 'bg-success'
      : status === 'failed'
        ? 'bg-error'
        : 'bg-orange'

  const isDebit = transaction.isDebit

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center gap-3 py-3.5 btn-press text-left"
    >
      <div
        className={`w-10 h-10 ${transaction.color} rounded-xl flex items-center justify-center shrink-0`}
      >
        <span className="text-white font-semibold text-base">
          {transaction.initial}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-text-primary truncate">
            {transaction.merchantName}
          </p>

          <p
            className={`text-sm font-semibold shrink-0 ${
              isDebit ? 'text-error' : 'text-success'
            }`}
          >
            {isDebit ? '-' : '+'} <span className="line-through">N</span> {transaction.amount}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-text-secondary">
            {transaction.date} | {transaction.time}
          </p>

          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
            <span className={`text-[10px] capitalize ${statusColor}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
    </button>
  )
}

export default function RecentTransactionsList() {
  const transactions = useOnlinePaymentStore((s) => s.transactions)
  const isRefreshing = useOnlinePaymentStore((s) => s.isRefreshing)

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium text-text-primary">Recent Transactions</p>
        <p className="text-[10px] text-text-secondary">Tap for details</p>
      </div>

      {isRefreshing ? (
        <div className="flex flex-col gap-3 py-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="h-3.5 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-text-primary/10">
          {transactions.map((txn) => (
            <TransactionItem key={txn.id} transaction={txn} />
          ))}
        </div>
      )}
    </div>
  )
}
