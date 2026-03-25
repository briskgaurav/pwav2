'use client'

import React from 'react'
import Image from 'next/image'
import FaqIconButton from '@/components/ui/FaqIconButton'
import type { FAQData } from '@/components/screens/components/ui/FAQModal'
import { getCardActions, type CardAction } from '../constants'
import { useAppDispatch } from '@/store/redux/hooks'
import { openFaq } from '@/store/redux/slices/manageCardSlice'
import { useAuth } from '@/lib/auth-context'
import { useMemo } from 'react'

type CardActionTilesProps = {
  cardMode?: 'virtual' | 'universal'
  onActionClick: (action: CardAction) => void
}

export default function CardActionTiles({ cardMode = 'virtual', onActionClick }: CardActionTilesProps) {
  const dispatch = useAppDispatch()
  const handleOpenFaq = (data: FAQData) => dispatch(openFaq(data))
  const { isDarkMode } = useAuth()
  const iconClassName = `h-full w-full object-contain ${isDarkMode ? 'invert' : ''}`
  const actions = useMemo(() => getCardActions(cardMode), [cardMode])
  return (
    <div className="flex w-full gap-2">
      {actions.map((action, index) => (
        <div
          key={index}
          onClick={() => onActionClick(action)}
          className="w-full border flex items-start flex-col justify-between border-text-primary/20 gap-4 rounded-xl p-4 cursor-pointer"
        >
          <div className="flex h-[30%] items-center gap-2 w-full justify-between">
            <div>
              <div className="w-6 h-auto flex items-center justify-center aspect-square">
                {typeof action.icon === 'string' ? (
                  <Image src={action.icon} alt="icon" className={iconClassName} width={24} height={24} />
                ) : (
                  React.createElement(action.icon, { className: iconClassName })
                )}
              </div>
            </div>
            <FaqIconButton
              onClick={(e) => {
                e.stopPropagation()
                handleOpenFaq(action.faqData)
              }}
            />
          </div>

          <p className="text-[12px] w-full leading-[1.2]">{action.text}</p>
        </div>
      ))}
    </div>
  )
}
