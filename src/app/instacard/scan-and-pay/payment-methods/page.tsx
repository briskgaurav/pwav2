import React from 'react'

import ChooseCards from '@/components/screens/ScanPay/ChooseCards'
import LayoutSheet from '@/components/ui/LayoutSheet'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function page({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  const resolved = (await searchParams) ?? {}

  const pick = (key: string) => {
    const v = resolved[key]
    return Array.isArray(v) ? v[0] : v
  }

  const amount = Number(pick('amount') ?? 0) || 0
  const message = pick('message') ?? ''
  const recipientName = pick('recipientName') ?? ''

  return (
    <LayoutSheet needPadding={false} routeTitle="Scan & Pay">
      <ChooseCards
        amount={amount}
        message={message}
        recipientName={recipientName}
      />
    </LayoutSheet>
  )
}
