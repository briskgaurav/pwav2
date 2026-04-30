'use client'
import LayoutSheet from '@/components/ui/LayoutSheet'
import MainInstacardScreen from '@/components/screens/InstacardScreens/MainInstacardScreen'
import { useBackRedirect } from '@/hooks/useBackRedirect'

export default function CardsScreen() {
  return (
    <LayoutSheet needPadding={false} routeTitle="Instacard">
      <MainInstacardScreen  />
    </LayoutSheet>
  )
}
