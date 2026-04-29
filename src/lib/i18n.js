import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../data/translations/en.json'
import ar from '../data/translations/ar.json'
import { LOCALES } from './constants'

// Arabic UI toggle disabled for v1 — locked to English. Translation files for
// 'ar' remain in src/data/translations/ar.json so we can re-enable the toggle
// later without losing copy. Wipe any previously-stored preference so users
// who tested the AR mode don't get stuck in it.
const STORAGE_KEY = 'ire.lang'
if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY)
const initialLang = 'en'

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
