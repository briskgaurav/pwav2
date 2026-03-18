'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { SheetContainer, Button } from '@/components/ui';
import { ICONS, ManageCard, PhoneIcon } from '@/constants/icons';
import { notifyNavigation, notifyCardAdded } from '@/lib/bridge';
import { ChevronDown } from 'lucide-react';
import FAQModal from '@/components/modals/FAQModal';
import FaqIconButton from '@/components/ui/FaqIconButton';
import type { FAQData } from '@/components/modals/FAQModal';
import { useRouter, useSearchParams } from 'next/navigation';
import CardMockup from '@/components/ui/CardMockup';
import { routes } from '@/lib/routes';
import type { CardType } from '@/lib/types';
import { useManagingCard } from '@/hooks/useManagingCard';
import { useUserStore } from '@/store/useUserStore';
import Link from 'next/link';

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

const CARD_TYPE_CONFIG: Record<CardType, {
    label: string;
    mockupImage: string;
    description: string;
    accordion: Array<{
        id: string;
        title: string;
        intro: string;
        bullets: string[];
    }>;
}> = {
    debit: {
        label: 'Debit Card',
        mockupImage: '/img/debitmockup.png',
        description: 'You can simply use this Virtual Debit Card using any of the following method:',
        accordion: [
            {
                id: 'virtual',
                title: 'Use Virtual Debit Card Directly',
                intro: 'Open your Digital Instacard Wallet and select this card to:',
                bullets: [
                    'Make Online Payment using security of a Dynamic CVV',
                    'Make the selected card your Default Contactless card on your NFC enabled phone to Tap your Phone on any POS for initiating a contactless payment, similar to how you make contactless payment using a Physical Card.',
                ],
            },
            {
                id: 'link-physical',
                title: 'Link to Universal Card',
                intro: 'You can link this Virtual Instacard to a Universal Card:',
                bullets: [
                    'Request a Universal Card from any FCMB branch near you',
                    'Link your Virtual Instacard to the Universal Card to share the same account and transaction history',
                    'Use the Universal Card at ATMs and POS terminals for cash withdrawals and in-store purchases',
                ],
            },
        ],
    },
    credit: {
        label: 'Credit Card',
        mockupImage: '/img/creditmockup.png',
        description: 'You can simply use this Virtual Credit Card using any of the following method:',
        accordion: [
            {
                id: 'virtual',
                title: 'Use Virtual Credit Card Directly',
                intro: 'Open your Digital Instacard Wallet and select this card to:',
                bullets: [
                    'Make Online Payments using security of a Dynamic CVV with your available credit limit',
                    'Make the selected card your Default Contactless card on your NFC enabled phone to Tap your Phone on any POS for initiating a contactless payment.',
                ],
            },
            {
                id: 'link-physical',
                title: 'Link to Universal Card',
                intro: 'You can link this Virtual Instacard to a Universal Card:',
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
    },
    prepaid: {
        label: 'Pre-Paid Card',
        mockupImage: '/img/prepaid.png',
        description: 'You can simply use this Virtual Pre-Paid Card using any of the following method:',
        accordion: [
            {
                id: 'virtual',
                title: 'Use Virtual Pre-Paid Card Directly',
                intro: 'Open your Digital Instacard Wallet and select this card to:',
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
                intro: 'You can link this Virtual Instacard to a Universal Card:',
                bullets: [
                    'Request a Universal Card from any FCMB branch near you',
                    'Link your Virtual Instacard to the Universal Card to share the same loaded balance',
                    'Use the Universal Card at ATMs and POS terminals for purchases',
                ],
            },
        ],
    },
    gift: {
        label: 'Gift Card',
        mockupImage: '/img/gift.png',
        description: 'You can simply use this Virtual Gift Card using any of the following method:',
        accordion: [
            {
                id: 'virtual',
                title: 'Use Virtual Gift Card Directly',
                intro: 'Open your Digital Instacard Wallet and select this card to:',
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
    },
};

const getCardActions = (cardType: CardType): Array<{
    icon: React.ReactNode;
    text: string;
    faqData: FAQData;
    route: string;
}> => [
        {
            icon: <ManageCard />,
            text: 'Manage Card',
            route: routes.manageCard(cardType),
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

    ];

function HowToUseCardContent() {
    const [expandedSection, setExpandedSection] = useState<string | null>('virtual');
    const [isFaqOpen, setIsFaqOpen] = useState(false);
    const [faqData, setFaqData] = useState<FAQData | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const cardType = (searchParams.get('type') as CardType) || 'debit';
    const config = CARD_TYPE_CONFIG[cardType];
    const cardActions = useMemo(() => getCardActions(cardType), [cardType]);
    const { mockupImageSrc, maskedNumber } = useManagingCard();
    const userFullName = useUserStore((s) => s.fullName);

    useEffect(() => {
        notifyNavigation('how-to-use-card');
    }, []);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const openFaq = (e: React.MouseEvent, data: FAQData) => {
        e.stopPropagation();
        setFaqData(data);
        setIsFaqOpen(true);
    };

    const closeFaq = () => {
        setIsFaqOpen(false);
        setFaqData(null);
    };

    return (
        <div className="h-screen flex flex-col">
            <SheetContainer>
                <div className="flex-1 flex flex-col overflow-auto py-10  p-6">
                    {/* Header */}
                    <div className="text-center">
                        <p className="text-sm text-text-primary">Hello, {userFullName}</p>
                        <p className="text-sm text-text-primary mt-1">Your Instacard is now ready for usage</p>
                    </div>

                    {/* Card Preview */}
                    <CardMockup isclickable={false} imageSrc={mockupImageSrc ?? config.mockupImage} maskedNumber={maskedNumber} />

                    {/* How to use section */}
                    <div className="mt-6">
                        <h2 className="text-base text-text-primary text-center">
                            How to use this card?
                        </h2>
                        <p className="text-xs text-text-primary text-center mt-2">
                            {config.description}
                        </p>
                    </div>

                    {/* Accordion Sections */}
                    <div className="mt-4  space-y-3 pb-6">
                        {config.accordion.map((section) => (
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
                <div onClick={() => router.replace(routes.instacard)} className='p-4  w-full'>
                    <Button className='w-full'>
                        Go To Instacard Home
                    </Button>
                </div>
            </SheetContainer>
        </div>
    );
}

export default function HowToUseCardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HowToUseCardContent />
        </Suspense>
    );
}