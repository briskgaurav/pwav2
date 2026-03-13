'use client'

import { Phone, X } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import Draggable from 'gsap/dist/Draggable'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { CardData } from './cardData'
import { CARD_IMAGE_PATHS } from './cardData'
import type { CardType } from '@/lib/types'
import { routes } from '@/lib/routes'
import FAQModal from '../modals/FAQModal'
import { AddCardIcon, LinkToUniversalIcon, ManageCard, PhoneIcon } from '@/constants/icons'
import { useCardWalletStore } from '@/store/useCardWalletStore'

// Register GSAP plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(Draggable)
}

type ActionItem = {
    id: string
    title: string
    icon: React.ReactNode
    faqData?: {
        heading: string
        bulletPoints: string[]
    }
}

export const ACTIONS: ActionItem[] = [
    {
        id: 'manage',
        title: 'Manage Card',
        icon: <ManageCard />,
        faqData: {
            heading: 'Manage Card',
            bulletPoints: [
                'View and update your card settings and preferences.',
                'Set spending limits and transaction controls.',
                'Enable or disable online and international transactions.',
                'Update your PIN or request a new card.',
                'View your card statement and transaction history.',
            ],
        },
    },
    {
        id: 'card-details',
        title: 'View Card Details',
        icon: <AddCardIcon />,
        faqData: {
            heading: 'View Card Details',
            bulletPoints: [
                'View your complete card information including card number, expiry date, and CVV.',
                'Copy card details securely for online transactions.',
                'Card details are protected and require authentication to view.',
                'You can view details for any of your linked virtual cards.',
            ],
        },
    },
    {
        id: 'make-online-payments',
        title: 'Make Online Payment',
        icon: <PhoneIcon />,
        faqData: {
            heading: 'Make Online Payment',
            bulletPoints: [
                'Use your virtual card for secure online purchases.',
                'Generate a one-time virtual card number for added security.',
                'Set transaction limits for online payments.',
                'Track all your online transactions in real-time.',
            ],
        },
    },
    {
        id: 'contactless-default',
        title: 'Make default for Contactless Payments',
        icon: <PhoneIcon />,
        faqData: {
            heading: 'Make Default for Contactless Payments',
            bulletPoints: [
                'Set this card as your default for tap-to-pay transactions.',
                'Use your phone or smartwatch for contactless payments.',
                'Enjoy faster checkout at supported terminals.',
                'Change your default card anytime from settings.',
            ],
        },
    },
    {
        id: 'link-physical',
        title: 'Link Virtual / Physical Card',
        icon: <LinkToUniversalIcon />,
        faqData: {
            heading: 'Link Virtual Instacard with Physical Universal or Sigma Instacard',
            bulletPoints: [
                'You can purchase a Universal Card or a Sigma card from your Bank or any Agent, Marketplace or order online.',
                'Universal Card or Sigma Card offer unified card experience such that you can link any Virtual Instacard to them to start using the virtual Instacard on any POS/ATM through the linked Universal or Sigma Instacard.',
                'Sigma Card is a physical card variant of Instacard that is issued by a Bank/ FinTech to allow users to link any Virtual Instacard issued by them for making Domestic as well as International payments.',
                'Universal Card is another physical card variant of Instacard that users can link any virtual Instacard issued by any Bank/ FinTech in your country for making Domestic Payments through a single Physical Card.',
                'You can simply link any one Virtual Instacard to a Universal or Sigma Cards to start using the linked Virtual Instacard from the physical card. When you link a new Virtual Instacard to a Universal or Sigma card, previously linked Virtual Instacard is de-linked and you can start using the newly linked Virtual Card from the physical Universal / Sigma card.',
            ],
        },
    },
]

interface ActionDrawerProps {
    visible: boolean
    cards: CardData[]
    selectedCardId?: string | null
    onClose: () => void
    onSelectCard?: (card: CardData) => void
    onActionPress?: (actionId: string, card: CardData) => void
    cardMode?: 'virtual' | 'universal'
    setCurrentCardIndex?: (index: number) => void
    isDarkMode?: boolean
}

export default function ActionDrawer({
    visible,
    cards,
    selectedCardId,
    onClose,
    onSelectCard,
    onActionPress,
    cardMode = 'virtual',
    setCurrentCardIndex,
    isDarkMode,
}: ActionDrawerProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const handleRef = useRef<HTMLDivElement>(null)
    const draggableRef = useRef<Draggable[]>([])

    const [faqModalVisible, setFaqModalVisible] = useState(false)
    const [currentFaqData, setCurrentFaqData] = useState<ActionItem['faqData'] | undefined>(undefined)
    const allCards = useCardWalletStore((s) => s.cards)

    const router = useRouter()

    const selectedCard = useMemo(() => {
        if (!cards.length) return undefined
        return cards.find((card) => card.id === selectedCardId) ?? cards[0]
    }, [cards, selectedCardId])

    const selectedCardType = (selectedCard?.cardType ?? 'debit') as CardType

    const actionRoutes = useMemo(
        () => ({
            manage: routes.manageCard(selectedCardType, cardMode),
            'card-details': routes.cardDetail(selectedCardType),
            'make-online-payments': routes.makeOnlinePayments,
            'link-physical':
                cardMode === 'virtual' ? routes.linkPhysicalCard : routes.linkVirtualCard,
            'add-gift': routes.addGiftCard,
        }),
        [cardMode, selectedCardType]
    )

    const filteredActions = useMemo(() => {
        if (cardMode === 'universal') {
            return ACTIONS.filter(
                (action) => action.id !== 'make-online-payments' && action.id !== 'contactless-default'
            )
        }
        return ACTIONS
    }, [cardMode])

    const handleClose = useCallback(() => {
        if (modalRef.current && backdropRef.current) {
            gsap.to(backdropRef.current, {
                opacity: 0,
                duration: 0.25,
                ease: 'power2.in',
            })
            gsap.to(modalRef.current, {
                y: '100%',
                duration: 0.3,
                ease: 'power3.in',
                onComplete: onClose,
            })
        } else {
            onClose()
        }
    }, [onClose])

    const initDraggable = useCallback(() => {
        if (modalRef.current && handleRef.current) {
            const modalHeight = modalRef.current.offsetHeight 
            const threshold = modalHeight * 0.3

            draggableRef.current = Draggable.create(modalRef.current, {
                type: 'y',
                trigger: handleRef.current,
                bounds: { minY: 0, maxY: window.innerHeight },
                inertia: true,
                onDragEnd: function () {
                    const endY = this.endY || this.y
                    if (endY > threshold) {
                        handleClose()
                    } else {
                        gsap.to(modalRef.current, {
                            y: 0,
                            duration: 0.3,
                            ease: 'power3.out',
                        })
                    }
                },
            })
        }
    }, [handleClose])

    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden'

            if (modalRef.current && backdropRef.current) {
                gsap.fromTo(
                    backdropRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: 'power2.out' }
                )
                gsap.fromTo(
                    modalRef.current,
                    { y: '100%' },
                    { y: '0%', duration: 0.4, ease: 'power3.out', onComplete: initDraggable }
                )
            }
        } else {
            document.body.style.overflow = 'unset'
            if (draggableRef.current.length > 0) {
                draggableRef.current.forEach((d) => d.kill())
                draggableRef.current = []
            }
        }
        return () => {
            document.body.style.overflow = 'unset'
            if (draggableRef.current.length > 0) {
                draggableRef.current.forEach((d) => d.kill())
                draggableRef.current = []
            }
        }
    }, [initDraggable, visible])

    const handleActionOpen = useCallback(
        (actionId: string) => {
            if (!selectedCard) return
            onActionPress?.(actionId, selectedCard)

            useCardWalletStore.getState().setManagingCardId(selectedCard.id)

            const path = actionRoutes[actionId as keyof typeof actionRoutes]
            if (path) {
                handleClose()
                router.push(path)
            }
        },
        [onActionPress, selectedCard, actionRoutes, handleClose, router]
    )

    const handleFaqPress = useCallback((action: ActionItem) => {
        setCurrentFaqData(action.faqData)
        setFaqModalVisible(true)
    }, [])

    const handleCardSelect = useCallback(
        (card: CardData, index: number) => {
            onSelectCard?.(card)
            setCurrentCardIndex?.(index)
        },
        [onSelectCard, setCurrentCardIndex]
    )

    if (!visible) return null

    return (
        <>
            <div className="fixed inset-0 z-1000 flex items-end justify-center">
                {/* Backdrop */}
                <div
                    ref={backdropRef}
                    className="absolute inset-0"
                    onClick={handleClose}
                />

                {/* Modal */}
                <div
                    ref={modalRef}
                    className="relative w-full max-h-[50vh] bg-white/80 backdrop-blur-sm border border-border rounded-t-[28px] overflow-hidden"
                >
                    {/* Handle Indicator */}
                    <div
                        ref={handleRef}
                        className="flex justify-center pt-3 pb-4 cursor-grab active:cursor-grabbing"
                    >
                        <div className="w-[42px] h-[5px] rounded-full bg-text-primary/40" />
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto max-h-[calc(50vh-40px)] px-2 pb-6">
                        {/* Card Carousel */}
                        <div className="pb-4">
                            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                                {cards.map((card, index) => {
                                    const isSelected = card.id === selectedCard?.id
                                    return (
                                        <button
                                            key={card.id}
                                            type="button"
                                            onClick={() => handleCardSelect(card, index)}
                                            className={`relative shrink-0 w-[100px] h-[63px] rounded-lg overflow-hidden ${isSelected ? 'border-2 border-[#fff]' : ''
                                                }`}
                                        >
                                            <Image
                                                src={CARD_IMAGE_PATHS[card.imageId]}
                                                alt={card.name}
                                                fill
                                                className="object-contain"
                                            />

                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Actions Grid */}
                        <div className="grid grid-cols-2 px-4  gap-2.5">
                            {filteredActions.map((action, index) => {
                                const isLinkedToVirtual =
                                    cardMode === 'universal' &&
                                    action.id === 'link-physical' &&
                                    !!selectedCard?.linkedVirtualCardId

                                const isLinkedToUniversal =
                                    cardMode === 'virtual' &&
                                    action.id === 'link-physical' &&
                                    allCards.some(c => c.cardForm === 'universal' && c.linkedVirtualCardId === selectedCard?.id)

                                const displayTitle =
                                    action.id === 'link-physical'
                                        ? cardMode === 'virtual'
                                            ? isLinkedToUniversal
                                                ? 'Link to Universal Card'
                                                : 'Link to Universal Card'
                                            : isLinkedToVirtual
                                                ? 'Link to Virtual Card'
                                                : 'Link to Virtual Card'
                                        : action.title
                                const isLastOdd =
                                    index === filteredActions.length - 1 && filteredActions.length % 2 !== 0

                                return (
                                    <div
                                        key={action.id}
                                        onClick={() => handleActionOpen(action.id)}
                                        className={`bg-white border border-border rounded-2xl p-3 min-h-[80px] flex flex-col justify-between items-start text-left ${isLastOdd ? 'col-span-2' : ''} cursor-pointer`}
                                    >
                                        <div className="flex w-full justify-between items-center mb-3">
                                            <div className="w-6 h-6 flex items-center justify-center aspect-square">

                                                {action.icon}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleFaqPress(action)
                                                }}
                                                className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium"
                                            >
                                                <span className="text-center mt-0.5 text-[#ffffff] leading-none">?</span>
                                            </button>
                                        </div>
                                        <span className="text-xs leading-[1.1] text-text-primary">
                                            {displayTitle}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <FAQModal
                visible={faqModalVisible}
                onClose={() => setFaqModalVisible(false)}
                data={currentFaqData}
            />
        </>
    )
}
