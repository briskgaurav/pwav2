'use client'

import { Button, SheetContainer } from '@/components/ui'
import { notifyCardAdded, notifyNavigation } from '@/lib/bridge'
import { routes } from '@/lib/routes'
import { useCardWalletStore } from '@/store/useCardWalletStore'
import { CARD_IMAGE_PATHS, type CardData } from '@/components/StackingCard/cardData'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { ICONS, ManageCard, PhoneIcon } from '@/constants/icons'
import { ChevronDown } from 'lucide-react'
import FaqIconButton from '@/components/ui/FaqIconButton'
import FAQModal from '@/components/modals/FAQModal'
import type { FAQData } from '@/components/modals/FAQModal'
import CardMockup from '@/components/ui/CardMockup'

interface AccordionItemProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionItem({ title, isExpanded, onToggle, children }: AccordionItemProps) {
  return (
    <div className="bg-background2 rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="text-sm font-medium text-text-primary">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-text-primary transition-transform duration-200 ease-out ${isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const accordionData = [
  {
    id: 'virtual',
    title: 'Use Universal Card Directly',
    intro: 'Your Universal Card is ready to use:',
    bullets: [
      'Use at any ATM for cash withdrawals',
      'Make payments at POS terminals in stores',
      'Link virtual cards to use them through this Universal Card',
    ],
  },
  {
    id: 'link-virtual',
    title: 'Link Virtual Cards',
    intro: 'Connect your virtual cards to this Universal Card:',
    bullets: [
      'Link any Virtual Instacard to share the same account',
      'Switch between linked cards anytime',
      'Use your virtual card balance through the Universal Card',
    ],
  },
];

const cardActions: Array<{
  icon: React.ReactNode;
  text: string;
  faqData: FAQData;
  route: string;
}> = [
  {
    icon: <ManageCard />,
    text: 'Manage Card',
    route: routes.manageCard('debit'),
    faqData: {
      heading: 'Manage Card',
      bulletPoints: [
        'View and update your card settings.',
        'Block or unblock your card temporarily.',
        'Set transaction limits and controls.',
        'View linked accounts and cards.',
      ],
    },
  },
  {
    icon: <PhoneIcon />,
    text: 'Link Virtual Card',
    route: routes.linkPhysicalCard,
    faqData: {
      heading: 'Link Virtual Card',
      bulletPoints: [
        'Link any Virtual Instacard to your Universal Card.',
        'Use your virtual card at ATMs and POS terminals.',
        'Share the same account and transaction history.',
        'Switch between linked cards anytime.',
      ],
    },
  },
];

export default function UniversalCardSuccessPage() {
  const router = useRouter()
  const addCard = useCardWalletStore((s) => s.addCard)
  const setPendingCardForm = useCardWalletStore((s) => s.setPendingCardForm)
  const cardAddedRef = useRef(false)
  const [createdCard, setCreatedCard] = useState<CardData | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>('virtual')
  const [isFaqOpen, setIsFaqOpen] = useState(false)
  const [faqData, setFaqData] = useState<FAQData | null>(null)

  useEffect(() => {
    notifyNavigation('add-universal-card-success')

    if (!cardAddedRef.current) {
      cardAddedRef.current = true
      setPendingCardForm('universal')
      const newCard = addCard('debit')
      setCreatedCard(newCard)
      notifyCardAdded({
        cardId: newCard.id,
        cardType: newCard.cardType,
        lastFourDigits: newCard.cardNumber.slice(-4),
      })
    }
  }, [addCard, setPendingCardForm])

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const openFaq = (e: React.MouseEvent, data: FAQData) => {
    e.stopPropagation()
    setFaqData(data)
    setIsFaqOpen(true)
  }

  const closeFaq = () => {
    setIsFaqOpen(false)
    setFaqData(null)
  }

  const handleDone = () => {
    router.push(routes.instacard)
  }

  return (
    <div className='h-dvh w-full flex flex-col overflow-hidden'>
      <SheetContainer>
        <div className='flex-1 w-full flex flex-col overflow-auto pt-10 space-y-4 p-6'>
          {/* Header */}
          <div className="text-center">
            <p className="text-sm text-text-primary">Congratulations!</p>
            <p className="text-sm text-text-primary mt-1">Your Universal Card is now ready for usage</p>
          </div>

          {/* Card Preview - show the created universal card */}
          <CardMockup
            isclickable={false}
            imageSrc={createdCard ? CARD_IMAGE_PATHS[createdCard.imageId] : '/img/cards/universal.png'}
            maskedNumber={
              createdCard
                ? `**** **** **** ${createdCard.cardNumber.slice(-4)}`
                : '**** **** **** 0000'
            }
          />

          {/* How to use section */}
          <div className="mt-6">
            <h2 className="text-base text-text-primary text-center">
              How to use this card?
            </h2>
            <p className="text-xs text-text-primary text-center mt-2">
              You can use your Universal Card in the following ways:
            </p>
          </div>

          {/* Accordion Sections */}
          <div className="mt-4 space-y-3 pb-6">
            {accordionData.map((section) => (
              <AccordionItem
                key={section.id}
                title={section.title}
                isExpanded={expandedSection === section.id}
                onToggle={() => toggleSection(section.id)}
              >
                <p className="text-xs text-text-primary mb-3">
                  {section.intro}
                </p>
                <ul className="space-y-2 text-xs text-text-primary">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </AccordionItem>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex w-full gap-2">
            {cardActions.map((action, index) => (
              <div
                key={index}
                onClick={() => router.push(action.route)}
                className="w-full border flex items-start flex-col justify-between border-text-primary/20 gap-4 rounded-xl p-4"
              >
                <div className="flex h-[30%] items-center gap-2 w-full justify-between">
                  <div>
                    <div className="w-7 h-auto flex items-center justify-center aspect-square">
                      {action.icon}
                    </div>
                  </div>
                  <FaqIconButton
                    onClick={(e) => openFaq(e, action.faqData)}
                  />
                </div>
                <p className="text-xs w-full leading-[1.2]">{action.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='p-4 pb-[max(env(safe-area-inset-bottom),24px)] pt-2'>
          <Button fullWidth onClick={handleDone}>Go To Instacard Home</Button>
        </div>
      </SheetContainer>

      {faqData && (
        <FAQModal
          visible={isFaqOpen}
          onClose={closeFaq}
          data={faqData}
        />
      )}
    </div>
  )
}
