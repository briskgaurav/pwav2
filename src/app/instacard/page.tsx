'use client'
import LayoutSheet from '@/components/screens/components/LayoutSheet'
import MainInstacardScreen from '@/components/screens/InstacardScreens/MainInstacardScreen'

export default function CardsScreen() {
  return (
    <LayoutSheet needPadding={false} routeTitle="Instacard">
      <MainInstacardScreen />
    </LayoutSheet>
  )
}
