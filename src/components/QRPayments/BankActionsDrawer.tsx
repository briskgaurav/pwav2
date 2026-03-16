'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import Draggable from 'gsap/dist/Draggable'
import { formatAmountWithCommas } from '@/lib/format-amount'
import { ChevronDown } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable)
}

type CardType = 'debit' | 'credit' | 'prepaid' | 'gift'

export interface BankItem {
  id: string
  name: string
  subtitle: string
  balance: string
  cardType: CardType
}

interface BankActionsDrawerProps {
  visible: boolean
  amount: string
  banks: BankItem[]
  selectedBankId?: string | null
  onSelectBank: (bankId: string) => void
  onClose: () => void
  onConfirm: () => void
  onAddNew?: () => void
}

const TYPE_ICONS: Record<CardType, string> = {
  debit: '/svg/debit-card.svg',
  credit: '/svg/credit-card.svg',
  prepaid: '/svg/prepaid-card.svg',
  gift: '/svg/giftcard.svg',
}

const TYPE_LABELS: Record<CardType, string> = {
  debit: 'Debit Cards',
  credit: 'Credit Cards',
  prepaid: 'Prepaid Cards',
  gift: 'Gift Cards',
}

function haptic(ms = 8) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(ms)
}

// ─── Balance Chip ────────────────────────────────────────────────
function BalanceChip({ balance }: { balance: string }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        haptic()
        setRevealed(!revealed)
      }}
      className="inline-flex items-center gap-1 text-xs text-primary transition-colors"
    >
      {revealed ? balance : 'Check Balance'}
    
    </button>
  )
}

// ─── Bank Row ────────────────────────────────────────────────────
function BankRow({
  bank,
  selected,
  onSelect,
}: {
  bank: BankItem
  selected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => {
        haptic()
        onSelect(bank.id)
      }}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${selected ? 'bg-primary/5' : ''}`}
      role="radio"
      aria-checked={selected}
    >
      {/* Bank Icon */}
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-base font-semibold text-primary">
          {bank.name.slice(0, 1).toUpperCase()}
        </span>
      </div>

      {/* Bank Text */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-text-primary truncate">{bank.name}</p>
        </div>
        <BalanceChip balance={bank.balance} />
      </div>

      {/* Radio Button */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-[#fff]' : 'border-border'}`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-orange" />}
      </div>
    </button>
  )
}

// ─── Accordion Section ───────────────────────────────────────────
function AccordionSection({
  type,
  banks,
  isExpanded,
  selectedBankId,
  onToggle,
  onSelectBank,
}: {
  type: CardType
  banks: BankItem[]
  isExpanded: boolean
  selectedBankId?: string
  onToggle: () => void
  onSelectBank: (id: string) => void
}) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const chevronRef = useRef<HTMLDivElement>(null)
  const iconSrc = TYPE_ICONS[type]

  useEffect(() => {
    if (!bodyRef.current || !contentRef.current) return
    
    if (isExpanded) {
      // Get the actual scroll height of the content
      const contentHeight = contentRef.current.scrollHeight
      gsap.to(bodyRef.current, {
        height: contentHeight,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    } else {
      gsap.to(bodyRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [isExpanded, banks.length])

  useEffect(() => {
    if (!chevronRef.current) return
    gsap.to(chevronRef.current, {
      rotation: isExpanded ? 180 : 0,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [isExpanded])

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-border">
      <button
        type="button"
        onClick={() => { haptic(); onToggle() }}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2">
          <img src={iconSrc} alt={TYPE_LABELS[type]} className="w-6 h-6" />
          <span className="text-base font-medium text-text-primary capitalize tracking-wide">
            {TYPE_LABELS[type]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div ref={chevronRef}>
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          </div>
        </div>
      </button>

      <div ref={bodyRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div ref={contentRef} className="px-3 pb-3 flex flex-col">
          {banks.map((bank, i) => {
            const isSelected = bank.id === selectedBankId
            return (
              <div key={bank.id}>
                {i > 0 && <div className="h-px bg-border mx-2.5 my-1" />}
                <BankRow
                  bank={bank}
                  selected={isSelected}
                  onSelect={onSelectBank}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Main Drawer ─────────────────────────────────────────────────
export function BankActionsDrawer({
  visible,
  amount,
  banks,
  selectedBankId,
  onSelectBank,
  onClose,
  onConfirm,
  onAddNew,
}: BankActionsDrawerProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const draggableRef = useRef<Draggable[]>([])

  const groupedBanks = useMemo(() => {
    const groups: Record<CardType, BankItem[]> = { debit: [], credit: [], prepaid: [], gift: [] }
    banks.forEach(b => groups[b.cardType]?.push(b))
    return groups
  }, [banks])

  const selectedBank = useMemo(
    () => banks.find(b => b.id === selectedBankId) ?? banks[0],
    [banks, selectedBankId],
  )

  const [expandedType, setExpandedType] = useState<CardType | null>(() => {
    const active = banks.find(b => b.id === selectedBankId) ?? banks[0]
    return active?.cardType ?? null
  })

  const toggleType = useCallback((type: CardType) => {
    setExpandedType(prev => prev === type ? null : type)
  }, [])

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

  if (!visible) return null

  const cardTypes: CardType[] = ['debit', 'credit', 'prepaid', 'gift']
  const canConfirm = Boolean(selectedBank?.id)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div ref={backdropRef} className="absolute inset-0 bg-black/30" onClick={handleClose} />

      {/* Drawer */}
      <div
        ref={modalRef}
        className="relative w-full max-h-[85vh] bg-white/60 backdrop-blur-sm border-t border-border rounded-t-[28px] overflow-hidden"
      >
        {/* Drag handle */}
        <div ref={handleRef} className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-[42px] h-[5px] rounded-full bg-text-primary/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider">Select Bank</p>
          </div>
          <p className="text-sm  text-text-primary">Pay
            <span className="line-through font-bold ml-1">N</span>{formatAmountWithCommas(amount)}
          </p>

        </div>

        {/* Scrollable card list */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)] px-4 pb-2 flex flex-col gap-2">
          {cardTypes.map(type => {
            const items = groupedBanks[type]
            if (!items.length) return null
            return (
              <AccordionSection
                key={type}
                type={type}
                banks={items}
                isExpanded={expandedType === type}
                selectedBankId={selectedBank?.id}
                onToggle={() => toggleType(type)}
                onSelectBank={onSelectBank}
              />
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-4 pt-2 pb-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.5rem))] flex gap-3">
        
          <button
            type="button"
            onClick={() => { haptic(15); onConfirm() }}
            disabled={!canConfirm}
            className="flex-1 py-3 rounded-[20px] bg-primary text-[#fff] font-medium text-base disabled:opacity-30 active:scale-[0.97] transition-transform"
          >
          Pay Now
          </button>
        </div>
      </div>
    </div>
  )
}
