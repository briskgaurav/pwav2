"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FAQData } from "@/components/ui/FAQModal"
import { CardType } from "@/constants/cardData"
import { routes } from "@/lib/routes"
import CardMockup from "@/components/ui/CardMockup"
import AccordionItem from "@/components/ui/AccordionItem"
import FaqIconButton from '@/components/ui/FaqIconButton'
import FAQModal from '@/components/ui/FAQModal'
import { CARD_DATA } from '@/lib/api/HowToUseCardsData'
import ButtonComponent from '@/components/ui/ButtonComponent'
import { useAppSelector } from '@/store/redux/hooks'
import { selectCustomerName } from '@/store/redux/slices/cardRequestSlice'

interface howToUseProps {
    CardImagesUrl: string
    cardType: CardType | null
}
export default function HowToUseInstacards({
    CardImagesUrl,
    cardType
}: howToUseProps) {
    const config = CARD_DATA[cardType || 'CREDIT_CARD'];
    const router = useRouter()
    const userName = useAppSelector(selectCustomerName)
    const [expandedSection, setExpandedSection] =
        useState<string | null>(null)

    const [isFaqOpen, setIsFaqOpen] = useState(false)
    const [faqData, setFaqData] = useState<FAQData | null>(null)

    const openFaq = (e: React.MouseEvent, data: FAQData) => {
        e.stopPropagation()
        setFaqData(data)
        setIsFaqOpen(true)
    }

    const closeFaq = () => {
        setIsFaqOpen(false)
        setFaqData(null)
    }

    return (
        <div className="flex pb-[10vh] flex-col gap-6 p-6">
            {/* Card */}

            <div className="text-center">
                <p className="text-sm text-text-primary">Hello, {userName}</p>
                <p className="text-sm text-text-primary">Your Instacard is now ready for usage</p>
            </div>
            <CardMockup
                isclickable={false}
                imageSrc={CardImagesUrl}
                maskedNumber="3333 4444 5555 6666"
            />

            {/* Description */}
            <div className="space-y-2 text-center">
                <h2 className="text-base">
                    How to use this card?
                </h2>

                <p className="text-xs">
                    {config.description}
                </p>
            </div>

            {/* Accordion */}
            <div className="space-y-3">
                {config.accordion.map((section) => (
                    <AccordionItem
                        key={section.id}
                        title={section.title}
                        isExpanded={expandedSection === section.id}
                        onToggle={() =>
                            setExpandedSection(
                                expandedSection === section.id
                                    ? null
                                    : section.id
                            )
                        }
                    >
                        <div className="space-y-3">
                            <p className="text-xs">
                                {section.intro}
                            </p>

                            <ul className="space-y-2 text-xs">
                                {section.bullets.map((bullet, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-2"
                                    >
                                        <span>•</span>
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionItem>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {config.actions.map((action, index) => (
                    <div
                        key={index}
                        onClick={() => router.push(action.route)}
                        className="w-full border  border-border rounded-xl p-4 flex flex-col justify-between gap-4"
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="w-7 h-7 flex items-center justify-center">
                                {action.icon}
                            </div>
                            <FaqIconButton
                                onClick={(e) => openFaq(e, action.faqData)}
                            />
                        </div>

                        <p className="text-xs leading-tight">
                            {action.text}
                        </p>
                    </div>
                ))}
            </div>

            <FAQModal
                visible={isFaqOpen}
                onClose={closeFaq}
                data={faqData ?? undefined}
            />
            <div className="sticky bottom-0 bg-background">
                <ButtonComponent title="Go To Instacard Home" onClick={() => router.replace(routes.instacard)} />
            </div>

        </div>
    )
}