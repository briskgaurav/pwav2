import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import ar from '@/locales/ar.json'
import { getInitialLanguage } from './bridge'

const initialLang = typeof window !== 'undefined' ? getInitialLanguage() : 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  initImmediate: false,  

})

if (typeof window !== 'undefined') {
  localStorage.setItem('lang', initialLang)
  console.log('[PWA] i18n initialized with language:', initialLang)
}

export default i18n
