import UcScanScreen from '@/components/screens/AddInstacardScreens/UCScanScreen'
import LayoutSheet from '@/components/ui/LayoutSheet'
import React from 'react'

export default function page() {
    return (
        <LayoutSheet needPadding={false} routeTitle="Scan Your Universal Card">
            <UcScanScreen />
        </LayoutSheet>
    )
}
