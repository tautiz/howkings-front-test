import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations as ltTranslations } from '../locales/lt';
import { translations as enTranslations } from '../locales/en';

type Language = 'lt' | 'en';
type Translations = typeof ltTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Konvertuojame string į boolean
  const isFeatureEnabled = import.meta.env.VITE_FEATURE_LANGUAGE_SWITCH?.toLowerCase() === 'true';
  const defaultLanguage: Language = isFeatureEnabled ? 'lt' : 'en';
  
  const [language, setLanguage] = useState<Language>(() => {
    if (!isFeatureEnabled) return defaultLanguage;
    
    const savedLang = localStorage.getItem('language');
    return (savedLang === 'lt' || savedLang === 'en') ? savedLang : defaultLanguage;
  });

  useEffect(() => {
    if (isFeatureEnabled) {
      localStorage.setItem('language', language);
    }
  }, [language, isFeatureEnabled]);

  const translations = language === 'lt' ? ltTranslations : enTranslations;

  const contextValue = {
    language,
    setLanguage: isFeatureEnabled ? setLanguage : () => {}, // Jei feature išjungtas, setLanguage nieko nedaro
    translations
  };

  return (
    <LanguageContext.Provider value={contextValue}>
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
