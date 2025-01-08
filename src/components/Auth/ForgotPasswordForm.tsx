import React, { useState } from 'react';
import { X, Loader2, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail } from '../../utils/validation';
import { useTranslation } from 'react-i18next';

interface ForgotPasswordFormProps {
  onClose: () => void;
  onBack: () => void;
}

interface ValidationErrors {
  email?: string;
  general?: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onClose, onBack }) => {
  const { resetPassword } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetAttempts, setResetAttempts] = useState({ count: 0, lastAttempt: 0 });

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!email) {
      newErrors.email = t('resetPassword.errors.required');
    } else {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        newErrors.email = t('resetPassword.errors.invalidEmail');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limiting
    const now = Date.now();
    if (now - resetAttempts.lastAttempt < 30 * 60 * 1000 && resetAttempts.count >= 3) {
      setErrors({ general: t('resetPassword.errors.tooManyAttempts') });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSuccess(true);
      setResetAttempts({ count: 0, lastAttempt: now });
    } catch (err) {
      setErrors({ general: t('resetPassword.errors.resetFailed') });
      setResetAttempts({
        count: resetAttempts.count + 1,
        lastAttempt: now
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label={t('common.close')}
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-400 hover:text-white flex items-center"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="text-sm">{t('common.back')}</span>
        </button>

        {!isSuccess ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">{t('resetPassword.title')}</h2>
            <p className="text-gray-400 mb-6">{t('resetPassword.subtitle')}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('resetPassword.form.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({});
                    }}
                    className={`w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:outline-none
                      ${errors.email ? 'border-red-500' : ''}`}
                    placeholder={t('resetPassword.form.emailPlaceholder')}
                    required
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {errors.general && (
                <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || (resetAttempts.count >= 3)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 
                  text-white rounded-lg focus:ring-2 focus:ring-blue-500 
                  focus:outline-none transition-colors disabled:opacity-50 
                  disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('resetPassword.form.submit')
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{t('resetPassword.success.title')}</h2>
            <p className="text-gray-400">{t('resetPassword.success.message')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;