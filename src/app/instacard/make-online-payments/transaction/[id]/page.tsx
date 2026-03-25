'use client'

import TransactionReceiptScreen from '@/components/screens/MakeOnlinePaymentsScreens/TransactionReceiptScreen'
import { useParams } from 'next/navigation'

export default function TransactionReceiptPage() {
  const params = useParams<{ id: string }>()

  return <TransactionReceiptScreen transactionId={params.id} />
}