'use client'

import {
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  User,
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageDropdown } from './LanguageDropdown'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { useAppSelector } from '@/store/redux/hooks'

interface ProfileContentProps {
  userName?: string
  onClose: () => void
}

export function ProfileContent({
  userName = 'User',
  onClose,
}: ProfileContentProps) {
  const { t, i18n } = useTranslation()
  const userEmail = useAppSelector((s) => s.user.email)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const selectedLang = i18n.language?.split('-')[0] ?? 'en'
  const router = useRouter()
  const isRTL = selectedLang === 'ar'
  const overlayRef = useRef<HTMLDivElement>(null)
  const iconContainerRef = useRef<HTMLDivElement>(null)
  const sunRef = useRef<SVGSVGElement>(null)
  const moonRef = useRef<SVGSVGElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)

  // Initialize dark mode state from localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      // Default to light theme and save it
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [])

  // Apply text/layout direction based on current language (RTL for Arabic)
  useEffect(() => {
    if (typeof document === 'undefined') return
    const langCode = i18n.language?.split('-')[0] || 'en'
    const isRTL = langCode === 'ar'
    const dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.body.dir = dir
  }, [i18n.language])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    document.documentElement.classList.toggle('dark', newDarkMode)
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
  }

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)


  const handleGoBack = () => {
    onClose()
    router.push('/')

  }

  const handleDarkModeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    // Prevent clicking while animation is in progress
    if (isAnimating) return

    const overlay = overlayRef.current
    const iconContainer = iconContainerRef.current
    const sun = sunRef.current
    const moon = moonRef.current
    const circle = circleRef.current
    const willBeDark = !isDarkMode

    if (overlay && iconContainer && sun && moon && circle) {
      setIsAnimating(true)

      // Set initial states
      gsap.set(overlay, { 
        display: 'flex', 
        opacity: 0,
      })
      
      gsap.set(circle, {
        scale: 0,
        backgroundColor: willBeDark ? '#252525' : '#ffffff',
      })

      gsap.set(iconContainer, {
        opacity: 1,
        scale: 1,
      })

      // Set initial icon states
      if (willBeDark) {
        gsap.set(sun, { opacity: 1, scale: 1, rotation: 0 })
        gsap.set(moon, { opacity: 0, scale: 0.5, rotation: -90 })
      } else {
        gsap.set(moon, { opacity: 1, scale: 1, rotation: 0 })
        gsap.set(sun, { opacity: 0, scale: 0.5, rotation: 90 })
      }

      // Create animation timeline with faster transitions
      const tl = gsap.timeline()
      
      // Fade in overlay - faster
      tl.to(overlay, {
        opacity: 1,
        duration: 0.15,
        ease: 'sine.out',
      })
      // Expand circle from center - faster
      .to(circle, {
        scale: 3,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.1')
      // Animate icon transition - faster
      .to(willBeDark ? sun : moon, {
        opacity: 0,
        scale: 0.5,
        rotation: willBeDark ? 180 : -180,
        duration: 0.25,
        ease: 'power2.inOut',
      }, '-=0.4')
      .to(willBeDark ? moon : sun, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)',
      }, '-=0.15')
      // Toggle dark mode
      .call(() => {
        toggleDarkMode()
      })
      // Hold shorter
      .to({}, { duration: 0.2 })
      // Fade out icon - faster
      .to(iconContainer, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'power2.inOut',
      })
    
      .to(overlay, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' })
          setIsAnimating(false)
        }
      }, '-=0.1')
    } else {
      toggleDarkMode()
    }
  }

  return (
    <>
      <div 
        ref={overlayRef}
        id='theme-overlay' 
        className='h-screen fixed top-0 left-0 z-100 w-screen flex items-center justify-center pointer-events-none'
        style={{ display: 'none' }}
      >
        {/* Expanding circle background */}
        <div
          ref={circleRef}
          className='absolute w-[150vmax] h-[150vmax] rounded-full'
          style={{ transform: 'scale(0)' }}
        />
        {/* Icon container */}
        <div
          ref={iconContainerRef}
          className='relative z-10 flex items-center justify-center'
        >
          <Sun 
            ref={sunRef}
            className='absolute w-13 h-13 text-amber-500'
            strokeWidth={2}
          />
          <Moon 
            ref={moonRef}
            className='absolute w-13 h-13 text-indigo-300'
            strokeWidth={2}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-card-background overflow-hidden">
        {/* <header className="flex items-center justify-center px-6 pt-6 pb-5 shrink-0 border-b border-border">
        <button
          type="button"
          onClick={handleGoBack}
          className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-primary text-[#fff] font-semibold  transition-all duration-200"
        >
          <span className="w-18 h-18">

            <Image src="/svg/fcmb.svg" alt="FCMB" width={1000} height={1000} className='h-full w-full object-contain' />
          </span>
          <span className='capitalize text-sm w-[70%] leading-[1.2]'>Go back to my banking app</span>
        </button>
      </header> */}

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          <div className="flex ml-4 items-center mt-8 mb-8">
            <div className="w-[50px] mr-2 h-[50px] rounded-xl bg-shadow flex items-center justify-center">
              <span className="text-xs font-bold text-text-on-primary">
                {initials}
              </span>
            </div>
            <div className="flex flex-col justify-center mt-1">

              <p className="text-xl font-semibold leading-none text-text-primary">
                {userName}
              </p>
              <p className="text-sm text-text-secondary leading-none">{userEmail}</p>
            </div>
          </div>

          <nav className="rounded-2xl overflow-hidden ">
            <MenuRow
              icon={<User className="w-5 h-5 text-primary" />}
              label={t('profile.profileSettings')}
              onPress={() => { router.push('/underdev') }}

              isRTL={isRTL}
            />
            <LanguageDropdown
              selectedLang={selectedLang}
              onSelect={() => { }}
              isRTL={isRTL}
              isDarkMode={isDarkMode}
            />
            <MenuRow
              icon={<Moon className="w-5 h-5 text-primary" />}
              label={t('profile.darkMode')}
              onPress={toggleDarkMode}
              showChevron={false}
              isRTL={isRTL}
              rightElement={
                <button
                  type="button"
                  role="switch"
                  aria-checked={isDarkMode}
                  onClick={handleDarkModeClick}
                  disabled={isAnimating}
                  className={`relative w-11 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-primary' : 'bg-border'
                    } ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isDarkMode ? 'left-1 translate-x-5' : 'left-1'
                      }`}
                  />
                </button>
              }
            />
            {/* <MenuRow
            icon={<HelpCircle className="w-5 h-5 text-primary" />}
            label={t('profile.helpSupport')}
            onPress={() => {
              onClose()
              window.setTimeout(() => router.push('/help-and-support'), 240)
            }}
            isRTL={isRTL}
          /> */}
            {/* <MenuRow
            icon={<LogOut className="w-5 h-5 text-error" />}
            label={t('profile.signOut')}
            showChevron={false}
            onPress={onClose}
            danger
            isRTL={isRTL}
          /> */}
          </nav>

          <p className="text-center text-xs text-text-secondary mt-8">
            {t('profile.version')}
          </p>
        </div>
      </div>
    </>

  )
}

interface MenuRowProps {
  icon: React.ReactNode
  label: string
  onPress: () => void
  rightElement?: React.ReactNode
  danger?: boolean
  showChevron?: boolean
  isRTL?: boolean
}

function MenuRow({
  icon,
  label,
  onPress,
  rightElement,
  danger,
  showChevron = true,
  isRTL = false,
}: MenuRowProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex items-center gap-3 w-full py-4 px-4 text-left transition-colors"
    >
      <span
        className={`flex items-center justify-center w-9 h-9 rounded-[10px] ${danger ? 'bg-error/10' : 'bg-light-gray'
          }`}
      >
        {icon}
      </span>
      <span
        className={`flex-1 text-[15px] font-medium ${danger ? 'text-error' : 'text-text-primary'
          }`}
      >
        {label}
      </span>
      {rightElement}
      {showChevron && <ChevronRight className={`w-[18px] h-[18px] text-text-secondary ${isRTL ? 'rotate-180' : ''}`} />}
    </button>
  )
}
