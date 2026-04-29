// Minimal stand-in for `react-i18next` so we can keep the `useTranslation()`
// API across the codebase without bundling i18next. English-only.
//
// Wired up via vite.config.js alias: any `import ... from 'react-i18next'`
// resolves to this file in the build.

import en from '../data/translations/en.json'

function deepGet(obj, dottedPath) {
  return dottedPath.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}

function interpolate(template, params) {
  if (!params) return template
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), String(v ?? '')),
    template
  )
}

export function useTranslation() {
  return {
    t: (key, params) => {
      const val = deepGet(en, key)
      if (typeof val !== 'string') return key
      return interpolate(val, params)
    },
    i18n: {
      language: 'en',
      changeLanguage: () => Promise.resolve(),
    },
  }
}

// react-i18next also exports these — keep stubs so any stray imports succeed.
export const Trans = ({ children }) => children
export const initReactI18next = { type: '3rdParty', init: () => {} }
export const I18nextProvider = ({ children }) => children
export default { useTranslation, Trans, initReactI18next, I18nextProvider }
