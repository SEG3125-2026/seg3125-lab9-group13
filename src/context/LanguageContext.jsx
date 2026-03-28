import { createContext, useContext, useMemo, useState } from 'react'
import { translations } from '../i18n/translations.js'

const LANGUAGE_STORAGE_KEY = 'player2parlor-language'

const LanguageContext = createContext(null)

function getInitialLanguage() {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)

  if (savedLanguage === 'en' || savedLanguage === 'zh') {
    return savedLanguage
  }

  return 'en'
}

function getNestedValue(object, path) {
  return path.split('.').reduce((current, key) => current?.[key], object)
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage)

  function setLanguage(nextLanguage) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    setLanguageState(nextLanguage)
  }

  function t(path) {
    const value =
      getNestedValue(translations[language], path) ??
      getNestedValue(translations.en, path)

    return value ?? path
  }

  const value = useMemo(() => {
    return {
      language,
      setLanguage,
      t,
    }
  }, [language])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider.')
  }

  return context
}