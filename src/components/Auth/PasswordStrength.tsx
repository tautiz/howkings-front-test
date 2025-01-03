import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { translations } = useLanguage();

  const calculateStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const strength = calculateStrength(password);
  const strengthMessages = [
    translations.signUp.passwordStrength.veryWeak,
    translations.signUp.passwordStrength.weak,
    translations.signUp.passwordStrength.medium,
    translations.signUp.passwordStrength.strong,
    translations.signUp.passwordStrength.veryStrong,
  ];

  const getStrengthColor = (strength: number): string => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
    return colors[strength] || colors[0];
  };

  return password ? (
    <div className="mt-1">
      <div className="flex h-1 overflow-hidden rounded bg-gray-200">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`flex-1 ${index <= strength ? getStrengthColor(strength) : 'bg-gray-300'}`}
          />
        ))}
      </div>
      <p className={`mt-1 text-sm ${getStrengthColor(strength).replace('bg-', 'text-')}`}>
        {strengthMessages[strength]}
      </p>
    </div>
  ) : null;
};

export default PasswordStrength;
