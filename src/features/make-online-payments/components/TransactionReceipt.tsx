'use client'

import React from 'react'
import { SheetContainer, Button } from '@/components/ui'
import { Header } from '@/components/ui'
import { useOnlinePaymentStore } from '../store/useOnlinePaymentStore'
import type { Transaction } from '../store/useOnlinePaymentStore'
import { useRouter } from 'next/navigation'
import { Share2, Download, AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { haptic } from '@/lib/useHaptics'

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const config = {
    success: {
      icon: CheckCircle2,
      label: 'Successful',
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
    },
    failed: {
      icon: XCircle,
      label: 'Failed',
      bg: 'bg-error/10',
      text: 'text-error',
      border: 'border-error/20',
    },
    pending: {
      icon: Clock,
      label: 'Pending',
      bg: 'bg-orange/10',
      text: 'text-orange',
      border: 'border-orange/20',
    },
  }

  const { icon: Icon, label, bg, text, border } = config[status]

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${bg} border ${border}`}>
      <Icon className={`w-4 h-4 ${text}`} />
      <span className={`text-xs font-semibold ${text}`}>{label}</span>
    </div>
  )
}

function DetailRow({ label, value, isMono = false }: { label: string; value: string; isMono?: boolean }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-text-primary/5 last:border-b-0">
      <span className="text-xs text-text-secondary">{label}</span>
      <span className={`text-sm text-text-primary font-medium text-right max-w-[60%] ${isMono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  )
}

type TransactionReceiptProps = {
  transactionId: string
}

export default function TransactionReceipt({ transactionId }: TransactionReceiptProps) {
  const router = useRouter()
  const transactions = useOnlinePaymentStore((s) => s.transactions)
  const cardDetails = useOnlinePaymentStore((s) => s.cardDetails)
  const transaction = transactions.find((t) => t.id === transactionId)

  if (!transaction) {
    return (
      <div className="h-dvh flex flex-col">
        <SheetContainer>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-orange mx-auto mb-3" />
              <p className="text-text-primary font-medium">Transaction not found</p>
              <p className="text-text-secondary text-sm mt-1">This transaction may no longer be available.</p>
              <Button variant="primary" className="mt-6" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </SheetContainer>
      </div>
    )
  }

  const handleShare = () => {
    haptic('medium')
    if (navigator.share) {
      navigator.share({
        title: 'Transaction Receipt',
        text: `${transaction.merchantName} - ${transaction.isDebit ? '-' : '+'}N ${transaction.amount} (${transaction.status})`,
      })
    }
  }

  const handleDownload = () => {
    haptic('medium')
    // Placeholder for receipt download
  }

  return (
    <div className="h-dvh flex flex-col">
      {/* <Header title="Transaction Receipt" showBackButton onBack={() => router.back()} /> */}
      <SheetContainer>
        <div className="flex-1 overflow-y-auto py-10">
          {/* Status hero */}
          <div className="flex flex-col items-center pt-6 pb-5 px-5">
            <div className={`w-16 h-16 ${transaction.color} rounded-2xl flex items-center justify-center mb-4`}>
              <span className="text-white font-bold text-2xl">{transaction.initial}</span>
            </div>
            <p className="text-text-primary text-lg font-semibold">{transaction.merchantName}</p>
            <p className={`text-2xl font-bold mt-2 ${transaction.isDebit ? 'text-error' : 'text-success'}`}>
              {transaction.isDebit ? '-' : '+'} <span className="line-through">N</span> {transaction.amount}
            </p>
            <div className="mt-3">
              <StatusBadge status={transaction.status} />
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-dashed border-text-primary/10 relative">
            <div className="absolute -left-2.5 -top-2.5 w-5 h-5 bg-white rounded-full" />
            <div className="absolute -right-2.5 -top-2.5 w-5 h-5 bg-white rounded-full" />
          </div>

          {/* Transaction details */}
          <div className="px-5 pt-4">
            <DetailRow label="Date" value={transaction.date} />
            <DetailRow label="Time" value={transaction.time} />
            <DetailRow label="Transaction ID" value={transaction.referenceId} isMono />
            <DetailRow label="Payment Method" value={`Virtual Card (${cardDetails.maskedNumber})`} />
            <DetailRow label="Card Type" value={`${cardDetails.cardType.charAt(0).toUpperCase() + cardDetails.cardType.slice(1)} - ${cardDetails.scheme}`} />
            {transaction.category && (
              <DetailRow label="Category" value={transaction.category} />
            )}
            <DetailRow label="Status" value={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 px-5 pt-6">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleShare}
            >
              <span className="flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </span>
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={handleDownload}
            >
              <span className="flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </span>
            </Button>
          </div>

          {/* Dispute link */}
          {transaction.status === 'success' && (
            <div className="px-5 pt-4 pb-6">
              <button
                type="button"
                className="text-xs text-primary bg-transparent border-none cursor-pointer w-full text-center"
              >
                Report an issue with this transaction
              </button>
            </div>
          )}
        </div>
      </SheetContainer>
    </div>
  )
}
