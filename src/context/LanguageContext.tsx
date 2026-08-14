import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LanguageInfo, TranslationDictionary, SUPPORTED_LANGUAGES } from '../i18n/types';
import { TRANSLATIONS } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  languages: LanguageInfo[];
  currentLanguage: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'lpk_alpha_beta_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // 1. Check local storage
    const saved = localStorage.getItem(STORAGE_KEY) as Language;
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }

    // 2. Check browser language
    try {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ar')) return 'ar';
      if (browserLang.startsWith('de')) return 'de';
      if (browserLang.startsWith('ms')) return 'ms';
      if (browserLang.startsWith('en')) return 'en';
      if (browserLang.startsWith('id')) return 'id';
    } catch {
      // ignore
    }

    // 3. Default fallback to Indonesian
    return 'id';
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Unable to save language preference:', e);
    }
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const isRTL = currentLanguage.dir === 'rtl';
  const dir = currentLanguage.dir;
  const t = TRANSLATIONS[language] || TRANSLATIONS.id;

  // Sync document root dir and lang attribute
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    if (isRTL) {
      document.documentElement.classList.add('rtl');
      document.body.classList.add('rtl-mode');
    } else {
      document.documentElement.classList.remove('rtl');
      document.body.classList.remove('rtl-mode');
    }
  }, [language, dir, isRTL]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL,
        dir,
        languages: SUPPORTED_LANGUAGES,
        currentLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
