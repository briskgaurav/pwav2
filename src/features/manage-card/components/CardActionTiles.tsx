'use client'

import Image from 'next/image'
import FaqIconButton from '@/components/ui/FaqIconButton'
import { cardActions } from '../constants'
import { useManageCardStore } from '../store/useManageCardStore'

type CardActionTilesProps = {
  onActionClick: (action: typeof cardActions[number]) => void
}

export default function CardActionTiles({ onActionClick }: CardActionTilesProps) {
  const { openFaq } = useManageCardStore()

  return (
    <div className="flex w-full gap-2">
      {cardActions.map((action, index) => (
        <div
          key={index}
          onClick={() => onActionClick(action)}
          className="w-full border flex items-start flex-col justify-between border-text-primary/20 gap-4 rounded-xl p-4 cursor-pointer"
        >
          <div className="flex h-[30%] items-center gap-2 w-full justify-between">
            <div>
              <div className="w-6 h-auto flex items-center justify-center aspect-square">
                <Image src={action.icon} alt="icon" className='h-full w-full object-contain' width={24} height={24} />
              </div>
            </div>
            <FaqIconButton
              onClick={(e) => {
                e.stopPropagation()
                openFaq(action.faqData)
              }}
            />
          </div>

          <p className="text-[12px] w-full leading-[1.2]">{action.text}</p>
        </div>
      ))}
    </div>
  )
}
