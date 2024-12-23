import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const calculateStrength = (): { score: number; message: string } => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;

    const messages = [
      'Labai silpnas',
      'Silpnas',
      'Vidutinis',
      'Stiprus',
      'Labai stiprus'
    ];

    return {
      score,
      message: messages[score - 1] || 'Netinkamas'
    };
  };

  const { score, message } = calculateStrength();
  const strengthColor = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-emerald-500'
  ][score - 1] || 'bg-gray-500';

  return (
    <div className="space-y-2">
      <div className="flex space-x-1 h-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`flex-1 rounded-full transition-colors ${
              level <= score ? strengthColor : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400">
        Slaptažodžio stiprumas: <span className="text-white">{message}</span>
      </p>
      {score < 3 && (
        <ul className="text-xs text-gray-400 list-disc list-inside">
          {!password.length && <li>Įveskite slaptažodį</li>}
          {password.length > 0 && password.length < 8 && (
            <li>Bent 8 simboliai</li>
          )}
          {!/[A-Z]/.test(password) && <li>Bent viena didžioji raidė</li>}
          {!/[0-9]/.test(password) && <li>Bent vienas skaičius</li>}
          {!/[!@#$%^&*(),.?":{}|<>]/.test(password) && (
            <li>Bent vienas specialus simbolis</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrength;
