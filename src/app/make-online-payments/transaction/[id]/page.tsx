'use client'

import TransactionReceipt from '@/features/make-online-payments/components/TransactionReceipt'
import { useParams } from 'next/navigation'

export default function TransactionReceiptPage() {
  const params = useParams<{ id: string }>()

  return <TransactionReceipt transactionId={params.id} />
}
