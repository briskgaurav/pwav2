import { FAQData } from "@/components/ui/FAQModal"
import { routes } from "../routes"
import { ManageCard, PhoneIcon } from "@/constants/icons"
import React from "react"
import { CardType } from "@/constants/cardData"

export const CARD_DATA: Record<
  CardType,
  {
    label: string
    mockupImage: string
    description: string

    accordion: Array<{
      id: string
      title: string
      intro: string
      bullets: string[]
    }>

    actions: Array<{
      icon: React.ReactNode
      text: string
      faqData: FAQData
      route: string
    }>
  }
> = {
  DEBIT_CARD: {
    label: 'Debit Card',
    mockupImage: '/img/debitmockup.png',
    description:
      'You can simply use this Virtual Debit Card using any of the following method:',

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

        route: routes.manageCard('DEBIT_CARD'),

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
        text: 'Link to a Universal Card',

        route: routes.linkPhysicalCard,

        faqData: {
          heading: 'Link to a Universal Card',

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
  },

  CREDIT_CARD: {
    label: 'Credit Card',

    mockupImage: '/img/creditmockup.png',

    description:
      'You can simply use this Virtual Credit Card using any of the following method:',

    accordion: [
      {
        id: 'virtual',

        title: 'Use Virtual Credit Card Directly',

        intro:
          'Open your Digital Instacard Wallet and select this card to:',

        bullets: [
          'Make Online Payments using security of a Dynamic CVV with your available credit limit',

          'Make the selected card your Default Contactless card on your NFC enabled phone to Tap your Phone on any POS for initiating a contactless payment.',
        ],
      },

      {
        id: 'link-physical',

        title: 'Link to Universal Card',

        intro:
          'You can link this Virtual Instacard to a Universal Card:',

        bullets: [
          'Request a Universal Card from any FCMB branch near you',

          'Link your Virtual Instacard to the Universal Card to share the same credit limit and transaction history',

          'Use the Universal Card at ATMs and POS terminals for purchases on credit',
        ],
      },

      {
        id: 'repayment',

        title: 'Repayment',

        intro: 'Manage your credit card repayments easily:',

        bullets: [
          'View your outstanding balance and minimum due amount anytime',

          'Set up auto-debit from your linked bank account for timely repayments',

          'Make partial or full payments before the due date to avoid interest charges',
        ],
      },
    ],

    actions: [
      {
        icon: <ManageCard />,
        text: 'Manage Card',

        route: routes.manageCard('CREDIT_CARD'),

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
        text: 'Link to a Universal Card',

        route: routes.linkPhysicalCard,

        faqData: {
          heading: 'Link to a Universal Card',

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
  },

  PREPAID_CARD: {
    label: 'Pre-Paid Card',

    mockupImage: '/img/prepaid.png',

    description:
      'You can simply use this Virtual Pre-Paid Card using any of the following method:',

    accordion: [
      {
        id: 'virtual',

        title: 'Use Virtual Pre-Paid Card Directly',

        intro:
          'Open your Digital Instacard Wallet and select this card to:',

        bullets: [
          'Make Online Payments using security of a Dynamic CVV with your loaded balance',

          'Make the selected card your Default Contactless card on your NFC enabled phone to Tap your Phone on any POS for initiating a contactless payment.',
        ],
      },

      {
        id: 'add-money',

        title: 'Add Money to Card',

        intro: 'Top up your Pre-Paid Card easily:',

        bullets: [
          'Load money from your linked bank account instantly',

          'Set up recurring top-ups so you never run out of balance',

          'Track your loaded balance and spending in real-time',
        ],
      },

      {
        id: 'link-physical',

        title: 'Link to Universal Card',

        intro:
          'You can link this Virtual Instacard to a Universal Card:',

        bullets: [
          'Request a Universal Card from any FCMB branch near you',

          'Link your Virtual Instacard to the Universal Card to share the same loaded balance',

          'Use the Universal Card at ATMs and POS terminals for purchases',
        ],
      },
    ],

    actions: [
      {
        icon: <ManageCard />,
        text: 'Manage Card',

        route: routes.manageCard('PREPAID_CARD'),

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
        text: 'Link to a Universal Card',

        route: routes.linkPhysicalCard,

        faqData: {
          heading: 'Link to a Universal Card',

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
  },

  GIFT_CARD: {
    label: 'Gift Card',

    mockupImage: '/img/gift.png',

    description:
      'You can simply use this Virtual Gift Card using any of the following method:',

    accordion: [
      {
        id: 'virtual',

        title: 'Use Virtual Gift Card Directly',

        intro:
          'Open your Digital Instacard Wallet and select this card to:',

        bullets: [
          'Make Online Payments using security of a Dynamic CVV with your gift card balance',

          'Share the card details with the recipient so they can use it for online purchases',
        ],
      },

      {
        id: 'share',

        title: 'Share Gift Card',

        intro: 'Send your Gift Card to someone special:',

        bullets: [
          'Share the Gift Card via email, SMS or any messaging app',

          'Add a personalized message for the recipient',

          'The recipient can add the Gift Card to their own Instacard Wallet',
        ],
      },
    ],

    actions: [
      {
        icon: <ManageCard />,
        text: 'Manage Card',

        route: routes.manageCard('GIFT_CARD'),

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
        text: 'Link to a Universal Card',

        route: routes.linkPhysicalCard,

        faqData: {
          heading: 'Link to a Universal Card',

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
  },
 
}