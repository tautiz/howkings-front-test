import { useState, useEffect } from 'react';

interface UseCountryLanguageResult {
  language: string;
  isLoading: boolean;
  error: string | null;
}

const countryToLanguage: Record<string, string> = {
  US: 'en', UK: 'en', CA: 'en',
  ES: 'es', MX: 'es', AR: 'es',
  FR: 'fr', DE: 'de', IT: 'it',
  PT: 'pt', BR: 'pt',
  RU: 'ru',
  CN: 'zh', TW: 'zh', HK: 'zh'
};

export const useCountryLanguage = (): UseCountryLanguageResult => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Failed to detect country');
        
        const data = await response.json();
        const detectedLanguage = countryToLanguage[data.country_code] || 'en';
        setLanguage(detectedLanguage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to detect language');
        setLanguage('en'); // Fallback to English
      } finally {
        setIsLoading(false);
      }
    };

    detectCountry();
  }, []);

  return { language, isLoading, error };
};