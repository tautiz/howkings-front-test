import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { lt } from '../locales/lt';

type Language = 'en' | 'lt';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang as Language) || 'en';
  });

  const [translations, setTranslations] = useState<Translations>(language === 'lt' ? lt : en);

  useEffect(() => {
    localStorage.setItem('language', language);
    setTranslations(language === 'lt' ? lt : en);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
