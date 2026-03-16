
'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { haptic } from '@/lib/useHaptics'
import { Button } from './button'
import { ChevronDown } from 'lucide-react'
import DatePickerModal from './DatePickerModal'
import { StatementsIcon } from '@/constants/icons'

type StatementOption = {
  id: 'mini' | 'custom'
  label: string
  sublabel?: string
}

const statementOptions: StatementOption[] = [
  { id: 'mini', label: 'Mini Statement', sublabel: '( Last 1 Month )' },
  { id: 'custom', label: 'Custom Date Range' },
]

export default function EmailStatements() {
  const [selectedOption, setSelectedOption] = useState<'mini' | 'custom'>('custom')
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [showPopup, setShowPopup] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState<'from' | 'to' | null>(null)
  const [successMessage, setSuccessMessage] = useState(false)
  const [dateError, setDateError] = useState<string>('')

  const handleSelect = (option: 'mini' | 'custom') => {
    haptic('light')
    setSelectedOption(option)
    setSuccessMessage(false)
    setDateError('')
  }

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const openDatePicker = (field: 'from' | 'to') => {
    if (selectedOption === 'custom') {
      haptic('light')
      setDatePickerOpen(field)
    }
  }

  const handleDateSelect = (date: Date, field: 'from' | 'to') => {
    const iso = date.toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    
    // Validate date is not in the future
    if (iso > today) {
      setDateError('Date cannot be in the future')
      setDatePickerOpen(null)
      return
    }
    
    setDateError('')
    
    if (field === 'from') {
      setFromDate(iso)
      // If toDate exists and fromDate is after toDate, reset toDate
      if (toDate && iso > toDate) {
        setToDate('')
      }
    } else {
      // Validate toDate is not before fromDate
      if (fromDate && iso < fromDate) {
        setDateError('To date cannot be before From date')
        setDatePickerOpen(null)
        return
      }
      setToDate(iso)
    }
    setDatePickerOpen(null)
  }

  const validateDates = (): boolean => {
    if (selectedOption === 'custom') {
      if (!fromDate || !toDate) {
        setDateError('Please select both From and To dates')
        return false
      }
      if (fromDate > toDate) {
        setDateError('From date cannot be after To date')
        return false
      }
    }
    setDateError('')
    return true
  }

  const handleSendEmail = () => {
    if (!validateDates()) {
      haptic('light')
      return
    }
    haptic('light')
    setSuccessMessage(true)
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    haptic('light')
    setShowPopup(false)
  }

  return (
    <>
      <div className='p-5 border border-border rounded-2xl'>
        <div className='flex items-center gap-2 mb-5'>
          <div className='w-6 h-6 flex items-center justify-center '>
           <StatementsIcon />
          </div>
          <p className='text-text-primary text-md font-medium'>Email Statements</p>
        </div>

        <div className='space-y-5'>
          {statementOptions.map((option, index) => (
            <React.Fragment key={option.id}>
              {index > 0 && <div className='' />}
              <button
                type='button'
                role='radio'
                aria-checked={selectedOption === option.id}
                onClick={() => handleSelect(option.id)}
                className='btn-press w-full flex items-center gap-3 cursor-pointer'
              >
                <span
                  className={`w-[22px] h-[22px] rounded-full border flex items-center justify-center transition-[border-color] duration-200 ease-in-out ${selectedOption === option.id ? 'border-text-primary' : 'border-border'}`}
                >
                  {selectedOption === option.id && (
                    <span className='w-[10px] h-[10px] rounded-full bg-orange' />
                  )}
                </span>
                <span className='text-[14px] text-text-primary'>
                  {option.label} {option.sublabel && <span className='text-text-secondary'>{option.sublabel}</span>}
                </span>
              </button>
            </React.Fragment>
          ))}

          <div className='flex gap-3 mt-2'>
            <button
              type='button'
              className={`flex-1 flex items-center justify-between px-4 py-3 border border-border rounded-lg text-left ${selectedOption === 'custom' ? 'cursor-pointer active:bg-gray-50' : 'opacity-50 cursor-not-allowed'}`}
              onClick={() => openDatePicker('from')}
              disabled={selectedOption !== 'custom'}
            >
              <span className={`text-sm ${fromDate ? 'text-text-primary' : 'text-text-secondary'}`}>
                {fromDate ? formatDateDisplay(fromDate) : 'From'}
              </span>
              <ChevronDown size={16} className='text-text-secondary shrink-0' />
            </button>
            <button
              type='button'
              className={`flex-1 flex items-center justify-between px-4 py-3 border border-border rounded-lg text-left ${selectedOption === 'custom' ? 'cursor-pointer active:bg-gray-50' : 'opacity-50 cursor-not-allowed'}`}
              onClick={() => openDatePicker('to')}
              disabled={selectedOption !== 'custom'}
            >
              <span className={`text-sm ${toDate ? 'text-text-primary' : 'text-text-secondary'}`}>
                {toDate ? formatDateDisplay(toDate) : 'To'}
              </span>
              <ChevronDown size={16} className='text-text-secondary shrink-0' />
            </button>
          </div>

          {dateError && (
            <p className='text-red-500 text-sm text-center'>{dateError}</p>
          )}

          <DatePickerModal
            visible={datePickerOpen === 'from'}
            onClose={() => setDatePickerOpen(null)}
            onSelect={(date) => handleDateSelect(date, 'from')}
            title='Select From Date'
            selectedDate={fromDate ? new Date(fromDate + 'T12:00:00') : undefined}
            maxDate={new Date()}
          />
          <DatePickerModal
            visible={datePickerOpen === 'to'}
            onClose={() => setDatePickerOpen(null)}
            onSelect={(date) => handleDateSelect(date, 'to')}
            title='Select To Date'
            selectedDate={toDate ? new Date(toDate + 'T12:00:00') : undefined}
            minDate={fromDate ? new Date(fromDate + 'T12:00:00') : undefined}
            maxDate={new Date()}
          />

          {/* {successMessage && (
            <p className='text-green-600 text-sm text-center'>Statements sent on your registered mail address</p>
          )} */}

          <Button variant='primary' size='lg' fullWidth onClick={handleSendEmail}>
            Send to Registered Email
          </Button>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className='fixed inset-0 z-50 h-screen flex items-center justify-center bg-black/20'>
          <div className='bg-white/60 backdrop-blur-2xl border-white border rounded-2xl p-6 mx-6 max-w-sm w-full text-center shadow-lg'>
            <p className='text-text-primary text-base mb-6'>
              Your Statement has been emailed to your registered Email ********@gmail.com
            </p>
            <button
              type='button'
              onClick={handleClosePopup}
              className='text-text-primary text-base font-medium py-2 px-8 cursor-pointer'
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  )
}