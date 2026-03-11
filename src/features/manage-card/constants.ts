import React from 'react'
import type { FAQData } from '@/components/modals/FAQModal'
import type { CardType } from '@/lib/types'
import { routes } from '@/lib/routes'
import {
  AddMoneyIcon,
  BlockUnblockIcon,
  DeleteIcon,
  LimitationsIcon,
  PhoneIcon,
  PinIcon,
  RepaymentIcon,
  StatementsIcon,
} from '@/constants/icons'
import { ICONS } from '@/constants/icons'

type IconComponent = React.ComponentType<{ className?: string }>
type ManageBtnIcon = IconComponent | string

export const getManageBtns = (cardType: CardType): Array<{ icon: ManageBtnIcon; title: string; href: string }> => {
  const baseBtns = [
    { icon: LimitationsIcon, title: 'Limit Setting', href: routes.limitSetting },
    { icon: PinIcon, title: 'PIN Change', href: routes.pinChange },
    { icon: BlockUnblockIcon, title: 'Block/Unblock Card', href: routes.cardStatus },
  ]


  if (cardType === 'debit') {
    return baseBtns
  }

  if (cardType === 'prepaid') {
    return [
      ...baseBtns,
      { icon: AddMoneyIcon, title: 'Add Money', href: routes.addMoney },
      { icon: StatementsIcon , title: 'View Statements', href: routes.emailStatements(cardType) },
    ]
  }

  if (cardType === 'credit') {
    return [
      { icon: StatementsIcon , title: 'View Statements', href: routes.emailStatements(cardType) },
      { icon: RepaymentIcon, title: 'Make Repayments', href: routes.makeRepayments },
    ]
  }
  if (cardType === 'gift') {
    return [
      ...baseBtns,
      { icon: StatementsIcon, title: 'View Statements', href: routes.emailStatements(cardType) },
    ]
  }

  return baseBtns
}

export type CardAction = {
  icon: IconComponent | string
  text: string
  route: string
  faqData: FAQData
}

export const getCardActions = (cardMode: 'virtual' | 'universal' = 'virtual'): CardAction[] => {
  const isVirtual = cardMode === 'virtual'

  return [
    {
      icon: PhoneIcon,
      text: isVirtual ? 'Link to a Universal Card' : 'Link to Virtual Card',
      route: isVirtual ? routes.linkPhysicalCard : routes.linkVirtualCard,
      faqData: isVirtual
        ? {
            heading: 'Link to a Universal Card',
            bulletPoints: [
              'You can purchase a Universal Card or a Sigma card from your Bank or any Agent, Marketplace or order online.',
              'Universal Card or Sigma Card offer unified card experience such that you can link any Virtual Instacard to them to start using the virtual Instacard on any POS/ATM through the linked Universal or Sigma Instacard.',
              'Sigma Card is a Universal card variant of Instacard that is issued by a Bank/ FinTech to allow users to link any Virtual Instacard issued by them for making Domestic as well as International payments.',
              'Universal Card is another Universal card variant of Instacard that users can link any virtual Instacard issued by any Bank/ FinTech in your country for making Domestic Payments through a single Universal Card.',
              'You can simply link any one Virtual Instacard to a Universal or Sigma Cards to start using the linked Virtual Instacard from the Universal card. When you link a new Virtual Instacard to a Universal or Sigma card, previously linked Virtual Instacard is de-linked and you can start using the newly linked Virtual Card from the Universal Universal / Sigma card.',
            ],
          }
        : {
            heading: 'Link to Virtual Card',
            bulletPoints: [
              'Link a Virtual Instacard to your Universal or Sigma card.',
              'You can switch the linked Virtual Instacard anytime from this option.',
              'When you link a new Virtual Instacard, the previously linked one is automatically de-linked.',
              'The linked Virtual Instacard can then be used on any POS/ATM through the Universal or Sigma card.',
            ],
          },
    },
    {
      icon: DeleteIcon,
      text: 'Remove Card',
      route: '#',
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
  ]
}

/** @deprecated Use getCardActions(cardMode) instead */
export const cardActions = getCardActions('virtual')
