import UcScanScreen from '@/components/screens/AddInstacardScreens/UniversalCardScreens/UCScanScreen'
import LayoutSheet from '@/components/ui/LayoutSheet'
import { useRouter } from 'next/navigation'
import React from 'react'
import { routes } from '@/lib/routes'
import type { UserUniveralCardSteps } from '@/types/userVerificationSteps'

export default function page() {
    const router = useRouter()

    const handleNext = (step: UserUniveralCardSteps) => {
        if (step === 'registered_email_verification') {
            router.push(routes.addUniversalVerifyEmail)
        }
        // Add other steps if needed
    }

    return (
        <LayoutSheet needPadding={false} routeTitle="Scan Your Universal Card">
            <UcScanScreen handleNext={handleNext} />
        </LayoutSheet>
    )
}
