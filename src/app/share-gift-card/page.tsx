'use client'
import { Button, SheetContainer } from '@/components/ui'
import { ICONS } from '@/constants/icons'
import Image from 'next/image'

import { Copy } from 'lucide-react'
import CardMockup from '@/components/ui/CardMockup'
import { useRouter, useSearchParams } from 'next/navigation'
import { routes } from '@/lib/routes'
import { shareText } from '@/lib/fetchDataFromKotlin'

export default function page() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const recipientName = searchParams.get('name') || 'Gift Recipient'
    const recipientEmail = searchParams.get('email') || 'recipient@example.com'
    const recipientMessage = searchParams.get('message') || '🎉 Congratulations! Wishing you joy and happiness on this special occasion. Enjoy your gift!'
    const giftCardCode = 'DS73488QDJ738'

    const giftCardDetails = [
        { label: 'Name', value: recipientName },
        { label: 'Email', value: recipientEmail },
        { label: 'Message', value: recipientMessage },
    ]

    const handleShareGiftCard = async () => {
        const shareMessage = `🎁 You've received an InstaCard Gift Card!

👤 To: ${recipientName}
📧 Email: ${recipientEmail}
🎫 Gift Card Code: ${giftCardCode}

💬 Message: ${recipientMessage}

---
Powered by InstaCard`

        await shareText({
            title: 'InstaCard Gift Card',
            text: shareMessage,
        })
    }

    return (
        <div className="h-screen flex flex-col">
            <SheetContainer>
                <div className="flex-1 overflow-auto h-fit pb-10 p-4 space-y-4">
                    {/* <CardMockup /> */}

                    <div className='w-full rounded-2xl mt-5 space-y-2'>
                        {giftCardDetails.map((detail, index) => (
                            <div key={index} className='p-4 border border-border rounded-2xl'>
                                <p className='text-text-primary text-sm'>{detail.label}</p>
                                <p className='text-text-primary font-sm'>{detail.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className='w-full flex items-center relative justify-center overflow-hidden rounded-2xl min-h-[180px]'>
                        <div className='absolute inset-0'>
                            <Image src="/img/giftcardbg2.png" alt="Gift Card background" width={340} height={215} className="w-full h-full object-cover rounded-2xl" />
                        </div>

                        <div className='flex items-center flex-col z-10 justify-center gap-5 py-6 w-full'>
                            <div className='flex items-center gap-2'>
                                <p className='text-[#fff] text-2xl font-bold'>{giftCardCode}</p>
                            </div>

                            <div className='flex items-center justify-center gap-4'>
                                <button 
                                    onClick={handleShareGiftCard}
                                    className='h-fit py-2 px-4 flex items-center gap-2 border border-[#fff] rounded-full'
                                >
                                    <span className='w-5 brightness-0 invert h-5 block'>
                                        <Image className='object-contain h-full w-full' src={ICONS.share} alt="Share" width={20} height={20} />
                                    </span>
                                    <p className='text-white text-xs font-medium'>Share Gift Card</p>
                                </button>
                                <div className='h-fit py-2 px-4 flex items-center gap-2 border border-[#fff] rounded-full'>
                                    <span className='w-5 brightness-0 invert h-5 block'>
                                        <Image className='object-contain h-full w-full' src={ICONS.mail} alt="Download" width={20} height={20} />
                                    </span>
                                    <p className='text-white text-xs font-medium'>Download Card</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-2 absolute bottom-5 left-1/2 -translate-x-1/2 px-4 w-full'>

                        <Button onClick={() => router.push(routes.oneTimeActivation)} fullWidth variant='primary' size='md'>
                           Get Activation Code
                        </Button>
                    </div>
                </div>
            </SheetContainer>


        </div>
    )
}
