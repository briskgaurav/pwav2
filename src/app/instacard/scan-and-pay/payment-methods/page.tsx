import LayoutSheet from '@/components/ui/LayoutSheet'
import ChoosePayUsingMethods from '@/components/screens/Scan&PayScreens/ChoosePayUsingMethods'
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
    <LayoutSheet needPadding={false} routeTitle="Choose Payment Methods" isScrollable={false}>
      <ChoosePayUsingMethods amount={amount} message={message} recipientName={recipientName} />
    </LayoutSheet>
  )
}
