'use client'

import { ICONS } from '@/constants/icons'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks'
import { hideToast, selectToasts, ToasterType, ToastItem as IToastItem } from '@/store/redux/slices/toasterSlice'

// Map toast types to their distinctive styling
const TOASTER_STYLES: Record<
  ToasterType,
  {
    iconColor: string
    borderColor: string
    bgColor: string
    textColor: string
    buttonBg: string
    buttonBorder: string
    buttonText: string
    buttonHover: string
  }
> = {
  success: {
    iconColor: 'text-[#19C964]',
    borderColor: 'border-[#19C964]/20',
    bgColor: 'bg-white/80',
    textColor: 'text-green-900',
    buttonBg: 'bg-green-100',
    buttonBorder: 'border-[#19C964]/20',
    buttonText: 'text-green-700',
    buttonHover: 'hover:bg-[#19C964]/20',
  },
  error: {
    iconColor: 'text-red-500',
    borderColor: 'border-error/20',
    bgColor: 'bg-red-50/80',
    textColor: 'text-error',
    buttonBg: 'bg-red-100',
    buttonBorder: 'border-error/20',
    buttonText: 'text-red-700',
    buttonHover: 'hover:border-error/20',
  },
  warning: {
    iconColor: 'text-yellow-500',
    borderColor: 'border-[#F6B751]/20',
    bgColor: 'bg-white/80',
    textColor: 'text-[#F6B751]',
    buttonBg: 'bg-yellow-100',
    buttonBorder: 'border-[#F6B751]/20',
    buttonText: 'text-[#F6B751]',
    buttonHover: 'hover:bg-[#F6B751]/20',
  },
  info: {
    iconColor: 'text-primary',
    borderColor: 'border-primary/20',
    bgColor: 'bg-white/80',
    textColor: 'text-[#18181B]',
    buttonBg: 'bg-primary/10',
    buttonBorder: 'border-primary/20',
    buttonText: 'text-primary',
    buttonHover: 'hover:bg-primary/20',
  },
}

function ToastItem({ toast }: { toast: IToastItem }) {
  const { id, message, subtitle, duration = 3000, tosterType = 'info' } = toast
  const toastRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!toastRef.current) return

    gsap.fromTo(
      toastRef.current,
      { y: -20, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.7)',
      }
    )

    const timer = setTimeout(() => {
      handleDismiss()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleDismiss = () => {
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          dispatch(hideToast(id))
        },
      })
    } else {
      dispatch(hideToast(id))
    }
  }

  const style = TOASTER_STYLES[tosterType] ?? TOASTER_STYLES.info

  return (
    <div
      ref={toastRef}
      className={`h-fit py-3 w-[90vw] max-w-[400px] px-4 ${style.bgColor} ${style.textColor} 
        flex items-start justify-between backdrop-blur-sm 
        border ${style.borderColor} rounded-2xl shadow-lg transition-shadow duration-300 pointer-events-auto`}
    >
      <div className="flex items-start justify-start gap-3">
        <div className={`w-5 h-auto aspect-square mt-2 flex items-center justify-center ${style.iconColor}`}>
          {ICONS[tosterType]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
          {subtitle && <p className="text-xs text-[#52525B] mt-0.5 line-clamp-2">{subtitle}</p>}
        </div>
      </div>
      <button
        className={`my-auto ml-4 ${style.buttonBg} rounded-full px-3 py-1 h-fit ${style.buttonText} text-xs font-semibold border ${style.buttonBorder} ${style.buttonHover} transition-colors shrink-0`}
        onClick={handleDismiss}
      >
        Dismiss
      </button>
    </div>
  )
}

export default function Toaster() {
  const toasts = useAppSelector(selectToasts)

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-9999 flex flex-col items-center gap-3 w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
