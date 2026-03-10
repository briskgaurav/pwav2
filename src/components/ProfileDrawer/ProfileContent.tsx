'use client'

import {
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  Moon,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageDropdown } from './LanguageDropdown'
import { useRouter } from 'next/navigation'
import { AccessFeaturesDropdown } from './AccessFeaturesDropdown'

interface ProfileContentProps {
  userName?: string
  onClose: () => void
}

export function ProfileContent({
  userName = 'User',
  onClose,
}: ProfileContentProps) {
  const { t, i18n } = useTranslation()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const selectedLang = i18n.language?.split('-')[0] ?? 'en'
  const router = useRouter()
  const isRTL = selectedLang === 'ar'

  // Initialize dark mode state from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
      document.documentElement.classList.toggle('dark', prefersDark)
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

  return (
    <div className="flex-1 flex flex-col bg-card-background overflow-hidden">
      <header className="flex items-center justify-center px-6 pt-6 pb-5 shrink-0 border-b border-border">
        <button
          type="button"
          onClick={onClose}
          className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-primary text-[#fff] font-semibold  transition-all duration-200"
        >
          <ArrowLeft className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
          <span>Go back to my banking app</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="flex flex-col items-center mt-8 mb-8">
          <div className="w-[200px] h-[200px] rounded-[40px] bg-shadow flex items-center justify-center mb-3">
            <span className="text-[28px] font-bold text-text-on-primary">
              {initials}
            </span>
          </div>
          <p className="text-xl font-semibold text-text-primary mb-1">
            {userName}
          </p>
          <p className="text-sm text-text-secondary">user@example.com</p>
        </div>

        <nav className="rounded-2xl overflow-hidden ">
          <MenuRow
            icon={<User className="w-5 h-5 text-primary" />}
            label={t('profile.profileSettings')}
            onPress={() => {}}
            isRTL={isRTL}
          />
          <LanguageDropdown
            selectedLang={selectedLang}
            onSelect={() => {}}
            isRTL={isRTL}
            isDarkMode={isDarkMode}
          />
          <AccessFeaturesDropdown
            isRTL={isRTL}
            onSelect={() => {
              onClose()
            }}
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
                onClick={(e) => {
                  e.stopPropagation()
                  toggleDarkMode()
                }}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  isDarkMode ? 'bg-primary' : 'bg-border'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    isDarkMode ? 'left-1 translate-x-5' : 'left-1'
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
          <MenuRow
            icon={<LogOut className="w-5 h-5 text-error" />}
            label={t('profile.signOut')}
            showChevron={false}
            onPress={onClose}
            danger
            isRTL={isRTL}
          />
        </nav>

        <p className="text-center text-xs text-text-secondary mt-8">
          {t('profile.version')}
        </p>
      </div>
    </div>
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
        className={`flex items-center justify-center w-9 h-9 rounded-[10px] ${
          danger ? 'bg-error/10' : 'bg-light-gray'
        }`}
      >
        {icon}
      </span>
      <span
        className={`flex-1 text-[15px] font-medium ${
          danger ? 'text-error' : 'text-text-primary'
        }`}
      >
        {label}
      </span>
      {rightElement}
      {showChevron && <ChevronRight className={`w-[18px] h-[18px] text-text-secondary ${isRTL ? 'rotate-180' : ''}`} />}
    </button>
  )
}
