'use client'

import { Check, ChevronDown, Globe } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Language = { code: string; name: string; native: string }

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'fr', name: 'French', native: 'Français' },
]

interface LanguageDropdownProps {
  selectedLang: string
  onSelect: (code: string) => void
  isRTL?: boolean
  isDarkMode?: boolean
}

export function LanguageDropdown({
  selectedLang,
  onSelect,
  isRTL = false,
}: LanguageDropdownProps) {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const normalizedLang = selectedLang?.split('-')[0] ?? 'en'
  const currentLang = LANGUAGES.find((l) => l.code === normalizedLang) ?? LANGUAGES[0]

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleSelect = useCallback(
    (code: string) => {
      i18n.changeLanguage(code)
      onSelect(code)
      setIsOpen(false)
    },
    [onSelect, i18n]
  )

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-3 w-full py-4 px-4 text-left transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Languages"
      >
        <span className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-light-gray">
          <Globe className="w-5 h-5 text-primary" />
        </span>
        <span className="flex-1 text-[15px] font-medium text-text-primary">
          {t('profile.languages')}
        </span>
        <span className="text-[13px] text-text-secondary mr-0.5">
          {currentLang.native}
        </span>
        <ChevronDown
          className={`w-[18px] h-[18px] text-text-secondary transition-transform duration-300 ease-out ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{ maxHeight: isOpen ? 280 : 0 }}
      >
        <div className="bg-light-gray py-1.5 px-3 rounded-xl mx-1 my-1">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === normalizedLang
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                role="option"
                aria-selected={isSelected}
                className={`flex items-center justify-between w-full py-3 px-5 my-0.5 rounded-xl transition-colors ${
                  isSelected ? 'bg-primary/10' : 'hover:bg-white/60'
                } ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <div className={isRTL ? 'flex flex-col items-end' : 'flex flex-col'}>
                  <span
                    className={`text-sm font-medium text-text-primary ${
                      isSelected ? 'font-semibold' : ''
                    } ${isRTL ? 'text-right' : ''}`}
                  >
                    {lang.name}
                  </span>
                  <span
                    className={`text-xs text-text-secondary ${isRTL ? 'text-right' : ''}`}
                  >
                    {lang.native}
                  </span>
                </div>
                {isSelected && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary shrink-0">
                    <Check className="w-3.5 h-3.5 text-text-on-primary" strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
