import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../data/translations/en.json'
import ar from '../data/translations/ar.json'
import { LOCALES } from './constants'

const STORAGE_KEY = 'ire.lang'

const initialLang = (() => {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'ar') return saved
  return 'en'
})()

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnEmptyString: false,
})

// Sync <html lang/dir> with active language
function applyHtmlLang(lang) {
  if (typeof document === 'undefined') return
  const locale = LOCALES[lang] || LOCALES.en
  document.documentElement.lang = locale.code
  document.documentElement.dir = locale.dir
}

applyHtmlLang(i18n.language)

i18n.on('languageChanged', (lng) => {
  applyHtmlLang(lng)
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, lng)
})

export default i18n
