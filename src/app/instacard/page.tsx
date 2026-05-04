'use client'
import MainInstacardScreen from '@/components/screens/InstacardScreens/MainInstacardScreen'
import LayoutSheet from '@/components/ui/LayoutSheet'

export default function CardsScreen() {
  return (
    <LayoutSheet needPadding={false} routeTitle="Instacard">
      <MainInstacardScreen  />
    </LayoutSheet>
  )
}
