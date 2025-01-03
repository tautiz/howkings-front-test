import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface GDPRConsentProps {
  onConsent: (consented: boolean) => void;
  consented: boolean;
}

const GDPRConsent: React.FC<GDPRConsentProps> = ({ onConsent, consented }) => {
  const { translations } = useLanguage();

  const consentText = translations.signUp.gdpr.consent.replace(
    '{privacyPolicy}',
    `<Link to="/privacy-policy" class="text-blue-400 hover:underline" target="_blank">
      ${translations.signUp.gdpr.privacyPolicy}
    </Link>`
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="gdpr-consent"
          checked={consented}
          onChange={(e) => onConsent(e.target.checked)}
          className="mt-1"
        />
        <label 
          htmlFor="gdpr-consent" 
          className="text-sm text-gray-300"
          dangerouslySetInnerHTML={{ __html: consentText }}
        />
      </div>
      <div className="text-xs text-gray-400">
        <p>{translations.signUp.gdpr.dataUsage}</p>
        <ul className="list-disc list-inside mt-1">
          <li>{translations.signUp.gdpr.purposes.account}</li>
          <li>{translations.signUp.gdpr.purposes.services}</li>
          <li>{translations.signUp.gdpr.purposes.communication}</li>
          <li>{translations.signUp.gdpr.purposes.legal}</li>
        </ul>
      </div>
    </div>
  );
};

export default GDPRConsent;
