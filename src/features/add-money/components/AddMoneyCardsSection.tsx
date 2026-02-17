'use client'

import Image from 'next/image'
import React from 'react'

export type CardType = 'sigma' | 'universal-1' | 'universal-2' | 'verve'

const CARD_OPTIONS: {
    id: CardType
    brandIcon: string
    maskedNumber: string
    description: string
}[] = [
    {
        id: 'sigma',
        brandIcon: '/svg/visa.svg',
        maskedNumber: '*** *** *** 7872',
        description: 'Sigma Card',
    },
    {
        id: 'universal-1',
        brandIcon: '/svg/mastercard.svg',
        maskedNumber: '*** *** *** 837',
        description: 'Universal Card',
    },
    {
        id: 'universal-2',
        brandIcon: '/svg/visa.svg',
        maskedNumber: '*** *** *** 9040',
        description: 'Universal Card',
    },
    {
        id: 'verve',
        brandIcon: '/svg/verve.svg',
        maskedNumber: '*** *** *** 837',
        description: 'Universal Card',
    },
]

export interface AddMoneyCardsSectionProps {
    selectedCard: CardType
    onSelectCard: (id: CardType) => void
}

export function AddMoneyCardsSection({ selectedCard, onSelectCard }: AddMoneyCardsSectionProps) {
    return (
        <div className='p-4 border border-border rounded-2xl space-y-2'>
            <div className='flex items-center justify-between'>
                <p className='text-text-primary text-sm'>Add using Cards</p>
                <p className='text-text-primary text-xs'>Linked cards</p>
            </div>

            <div className='divide-y divide-border text-sm'>
                {CARD_OPTIONS.map((card) => {
                    const isSelected = selectedCard === card.id
                    return (
                        <button
                            key={card.id}
                            type='button'
                            onClick={() => onSelectCard(card.id)}
                            className='w-full flex items-center justify-between py-4'
                        >
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-5 relative'>
                                    <Image
                                        src={card.brandIcon}
                                        alt={card.description}
                                        fill
                                        className='object-contain'
                                    />
                                </div>
                                <p className='text-text-primary'>
                                    {card.maskedNumber}{' '}
                                    <span className='text-text-primary'>({card.description})</span>
                                </p>
                            </div>
                            <span
                                className={`flex items-center justify-center rounded-full ${
                                    isSelected
                                        ? 'w-[22px] h-[22px] border'
                                        : 'w-[22px] h-[22px] border border-text-primary'
                                }`}
                            >
                                {isSelected && <span className='w-[12px] h-[12px] rounded-full bg-orange' />}
                            </span>
                        </button>
                    )
                })}
            </div>

          
        </div>
    )
}

