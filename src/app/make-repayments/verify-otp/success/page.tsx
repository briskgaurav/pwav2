'use client'
import SuccessScreen from '@/features/success/components/SuccessScreen'
import { notifyUserCancelled } from '@/lib/bridge'
import { useRouter } from 'next/navigation'

export default function page() {
    const router = useRouter()
    return (
        <SuccessScreen
            title="Payment was Successful!"
            description="We have successfully collected card issuance Fee of N XXXX for the Virtual Instacard you had requested to be issued."
            buttonText="Back to Home"
            
            onButtonClick={() => {notifyUserCancelled() , router.push('/instacard')}}
            showCardPreview={false}
        />
    )
}
