'use client'

import { useParams } from 'next/navigation'

import TransactionReceiptScreen from '@/components/screens/MakeOnlinePaymentsScreens/TransactionReceiptScreen'

export default function TransactionReceiptPage() {
  const params = useParams<{ id: string }>()

  return <TransactionReceiptScreen transactionId={params.id} />
}