'use client'

import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { createPortal } from 'react-dom'
import { haptic } from '@/lib/useHaptics'

import 'react-day-picker/style.css'
import ButtonComponent from '../screens/components/ui/ButtonComponent'

export interface DatePickerModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (date: Date) => void
  title: string
  selectedDate?: Date
  minDate?: Date
  maxDate?: Date
}

export default function DatePickerModal({
  visible,
  onClose,
  onSelect,
  title,
  selectedDate,
  minDate,
  maxDate,
}: DatePickerModalProps) {
  const [month, setMonth] = useState<Date>(selectedDate ?? new Date())
  const [tempSelected, setTempSelected] = useState<Date | undefined>(selectedDate)
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (visible) {
      setShouldRender(true)
      setIsClosing(false)
      document.body.style.overflow = 'hidden'
      const initial = selectedDate ?? new Date()
      setTempSelected(selectedDate)
      setMonth(initial)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible, selectedDate])

  const handleClose = () => {
    haptic('light')
    setIsClosing(true)
    setTimeout(() => {
      setShouldRender(false)
      onClose()
    }, 300)
  }

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      haptic('light')
      setTempSelected(date)
    }
  }

  const handleConfirm = () => {
    if (tempSelected) {
      onSelect(tempSelected)
      haptic('light')
    }
    handleClose()
  }

  if (!shouldRender && !visible) return null

  const modalContent = (
    <div className='fixed inset-0 z-[9999] flex items-end justify-center'>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
        aria-hidden
      />
      <div
        className={`relative w-full bg-white rounded-t-[28px] border border-border overflow-hidden max-h-[85vh] flex flex-col transition-transform duration-500  ${isClosing ? 'translate-y-full' : 'translate-y-0 animate-slide-up'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between px-5 py-2 border-b border-border'>
          <h2 className='text-sm font-medium text-text-primary'>{title}</h2>
          <ButtonComponent title='Cancel' onClick={handleClose} />
        </div>
        <div className='overflow-auto p-4 flex justify-center'>
          <div
            className='rdp-root'
            style={
              {
                '--rdp-accent-color': '#5A1186',
                '--rdp-accent-background-color': '#F5F0F9',
                '--rdp-day_button-height': '44px',
                '--rdp-day_button-width': '44px',
              } as React.CSSProperties
            }
          >
            <DayPicker
              mode='single'
              month={month}
              onMonthChange={setMonth}
              selected={tempSelected}
              onSelect={handleSelect}
              disabled={(date) => {
                if (minDate && date < minDate) return true
                if (maxDate && date > maxDate) return true
                return false
              }}
            />
          </div>
        </div>
        <div className='p-4 border-t border-border'>
          <ButtonComponent title={tempSelected ? format(tempSelected, 'MMM d, yyyy') : 'Date'} onClick={handleConfirm} />
        </div>
      </div>
      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .rdp-day_button {
          touch-action: manipulation;
        }
      `}</style>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
}
