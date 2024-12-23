import React from 'react';
import { Link } from 'react-router-dom';

interface GDPRConsentProps {
  onConsent: (consented: boolean) => void;
  consented: boolean;
}

const GDPRConsent: React.FC<GDPRConsentProps> = ({ onConsent, consented }) => {
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
        <label htmlFor="gdpr-consent" className="text-sm text-gray-300">
          Sutinku, kad mano asmens duomenys būtų tvarkomi pagal{' '}
          <Link to="/privacy-policy" className="text-blue-400 hover:underline" target="_blank">
            privatumo politiką
          </Link>
          . Suprantu, kad galiu bet kada atšaukti sutikimą ir ištrinti savo paskyrą.
        </label>
      </div>
      <div className="text-xs text-gray-400">
        <p>Jūsų duomenys bus naudojami:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Paskyros sukūrimui ir valdymui</li>
          <li>Paslaugų teikimui</li>
          <li>Komunikacijai su jumis</li>
          <li>Teisinių įsipareigojimų vykdymui</li>
        </ul>
      </div>
    </div>
  );
};

export default GDPRConsent;
