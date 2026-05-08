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
import ButtonComponent from '@/components/ui/ButtonComponent'
import { useAppSelector } from '@/store/redux/hooks'
import { selectCustomerName } from '@/store/redux/slices/cardRequestSlice'
import { ManageCard, PhoneIcon } from '@/constants/icons'

const UNIVERSAL_CARD_DATA = {
  label: 'Universal Card',
  mockupImage: '/img/cards/Universal1.png',
  description:
    'You can simply use this Virtual Universal Card using any of the following method:',

  accordion: [
    {
      id: 'virtual',
      title: 'Use Virtual Debit Card Directly',
      intro:
        'Open your Digital Instacard Wallet and select this card to:',

      bullets: [
        'Make Online Payment using security of a Dynamic CVV',

        'Make the selected card your Default Contactless card on your NFC enabled phone to Tap your Phone on any POS for initiating a contactless payment, similar to how you make contactless payment using a Physical Card.',
      ],
    },

    {
      id: 'link-physical',
      title: 'Link to Universal Card',
      intro:
        'You can link this Virtual Instacard to a Universal Card:',

      bullets: [
        'Request a Universal Card from any FCMB branch near you',

        'Link your Virtual Instacard to the Universal Card to share the same account and transaction history',

        'Use the Universal Card at ATMs and POS terminals for cash withdrawals and in-store purchases',
      ],
    },
  ],

  actions: [
    {
      icon: <ManageCard />,
      text: 'Manage Card',

      route: routes.manageCard('DEBIT_CARD' as CardType, 'universal'),

      faqData: {
        heading: 'Remove Card',

        bulletPoints: [
          'Removing a card will permanently delete it from your account.',

          'All associated transactions and history will be archived.',

          'You will no longer be able to use this card for any transactions.',

          'If you have any pending transactions, please wait for them to complete before removing the card.',

          'You can always add a new card later if needed.',
        ],
      },
    },

    {
      icon: <PhoneIcon />,
      text: 'Link to a Virtual Card',

      route: routes.linkVirtualCard,

      faqData: {
        heading: 'Link to a Virtual Card',

        bulletPoints: [
          'You can purchase a Universal Card or a Sigma card from your Bank or any Agent, Marketplace or order online.',

          'Universal Card or Sigma Card offer unified card experience such that you can link any Virtual Instacard to them to start using the virtual Instacard on any POS/ATM through the linked Universal or Sigma Instacard.',

          'Sigma Card is a Universal card variant of Instacard that is issued by a Bank/ FinTech to allow users to link any Virtual Instacard issued by them for making Domestic as well as International payments.',

          'Universal Card is another Universal card variant of Instacard that users can link any virtual Instacard issued by any Bank/ FinTech in your country for making Domestic Payments through a single Universal Card.',

          'You can simply link any one Virtual Instacard to a Universal or Sigma Cards to start using the linked Virtual Instacard from the Universal card. When you link a new Virtual Instacard to a Universal or Sigma card, previously linked Virtual Instacard is de-linked and you can start using the newly linked Virtual Card from the Universal / Sigma card.',
        ],
      },
    },
  ],

}

export default function HowToUseUniversalCard() {
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
        <p className="text-sm text-text-primary">Hello, {userName ? userName : "Customer"}</p>
        <p className="text-sm text-text-primary">Your Instacard is now ready for usage</p>
      </div>
      <CardMockup
        isclickable={false}
        imageSrc={UNIVERSAL_CARD_DATA.mockupImage}
        maskedNumber="3333 4444 5555 6666"
      />

      {/* Description */}
      <div className="space-y-2 text-center">
        <h2 className="text-base">
          How to use this card?
        </h2>

        <p className="text-xs">
          {UNIVERSAL_CARD_DATA.description}
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {UNIVERSAL_CARD_DATA.accordion.map((section) => (
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
        {UNIVERSAL_CARD_DATA.actions.map((action, index) => (
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