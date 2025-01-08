import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations as ltTranslations } from './locales/lt';
import { translations as enTranslations } from './locales/en';

// Konvertuojame string į boolean
const isFeatureEnabled = import.meta.env.VITE_FEATURE_LANGUAGE_SWITCH?.toLowerCase() === 'true';
const defaultLanguage = isFeatureEnabled ? 'lt' : 'en';

// Gauname išsaugotą kalbą
const savedLang = localStorage.getItem('language');
const initialLanguage = (savedLang === 'lt' || savedLang === 'en') ? savedLang : defaultLanguage;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      lt: {
        translation: ltTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
