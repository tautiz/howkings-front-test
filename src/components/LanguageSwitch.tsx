import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Languages } from 'lucide-react';

const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  // Konvertuojame string į boolean
  const isFeatureEnabled = import.meta.env.VITE_FEATURE_LANGUAGE_SWITCH?.toLowerCase() === 'true';

  // Jei feature išjungtas, negrąžiname nieko
  if (!isFeatureEnabled) {
    return null;
  }

  const toggleLanguage = () => {
    setLanguage(language === 'lt' ? 'en' : 'lt');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors"
      aria-label={`Switch to ${language === 'lt' ? 'English' : 'Lithuanian'}`}
    >
      <Languages className="w-4 h-4" />
      <span>{language === 'lt' ? 'EN' : 'LT'}</span>
    </button>
  );
};

export default LanguageSwitch;
