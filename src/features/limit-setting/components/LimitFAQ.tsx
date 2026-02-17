'use client'

import React, { useState } from 'react'
import FAQModal, { FAQData } from '@/components/modals/FAQModal'
import FaqIconButton from '@/components/ui/FaqIconButton'

const limitFaqData: FAQData = {
    heading: 'Limit Settings Information',
    bulletPoints: [
        'All limits set are daily transactions limits.',
        'Limits must be in multiples of N 10000.',
        'You can adjust your limits at any time from this screen.',
        'Changes to limits take effect immediately.',
    ],
}

export default function LimitFAQ() {
    const [isFaqOpen, setIsFaqOpen] = useState(false)

    const openFaq = () => setIsFaqOpen(true)
    const closeFaq = () => setIsFaqOpen(false)

    return (
        <>
            <div className="flex w-full gap-2">
                <div className="w-full border flex items-start flex-col justify-between border-text-primary/20 gap-4 rounded-2xl p-4">
                    <div className="flex h-fit items-center py-2 gap-4 w-full justify-between">
                        <FaqIconButton onClick={openFaq} />
                        <p className="  w-[90%] text-xs">
                            All limits set are daily transactions limits, and must be in multiples of N 10000
                        </p>
                    </div>

                </div>
            </div>

            <FAQModal visible={isFaqOpen} onClose={closeFaq} data={limitFaqData} />
        </>
    )
}
