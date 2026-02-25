'use client'
import SuccessScreen from '@/features/success/components/SuccessScreen'
import { notifyNavigation, notifyReady, notifyUserCancelled } from '@/lib/bridge'
import React from 'react'

export default function page() {
    return (
        <SuccessScreen
            title="Payment was Successful!"
            description="We have successfully collected card issuance Fee of N XXXX for the Virtual Instacard you had requested to be issued."
            buttonText="Back to Home"
            
            onButtonClick={() => notifyUserCancelled()}
            showCardPreview={false}
        />
    )
}
