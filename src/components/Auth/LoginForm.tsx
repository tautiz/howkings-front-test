import React, { useState, useEffect } from 'react';
import { X, Loader2, Mail, Lock } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../contexts/AuthContext';
import { featureService } from '../../config/features';
import { useTranslation } from 'react-i18next';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useCountryLanguage } from '../../hooks/useCountryLanguage';

interface LoginFormProps {
  onClose: () => void;
  onForgotPassword: () => void;
}

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onForgotPassword }) => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const { language } = useCountryLanguage();
  const [savedData, setSavedData] = useLocalStorage<Partial<LoginData>>('login_form', {});
  
  const [formData, setFormData] = useState<LoginData>({
    email: savedData.email || '',
    password: '',
    rememberMe: savedData.rememberMe || false
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useLocalStorage('login_attempts', { count: 0, lastAttempt: 0 });

  useEffect(() => {
    // Reset login attempts after 30 minutes
    const now = Date.now();
    if (now - loginAttempts.lastAttempt > 30 * 60 * 1000) {
      setLoginAttempts({ count: 0, lastAttempt: now });
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.email) {
      newErrors.email = t('login.errors.required');
    } else {
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        newErrors.email = t('login.errors.invalidEmail');
      }
    }

    if (!formData.password) {
      newErrors.password = t('login.errors.required');
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = t('login.errors.invalidPassword');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear specific error when user starts typing
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    if (loginAttempts.count >= 5) {
      setErrors({ general: t('login.errors.tooManyAttempts') });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      if (formData.rememberMe) {
        setSavedData({ email: formData.email, rememberMe: true });
      } else {
        setSavedData({});
      }
      onClose();
    } catch (err: any) {
      setLoginAttempts({
        count: loginAttempts.count + 1,
        lastAttempt: Date.now()
      });
      setErrors({ general: t('login.errors.loginFailed') });
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

        <h2 className="text-2xl font-bold text-white mb-6">{t('login.title')}</h2>

        <form 
          onSubmit={handleSubmit}
          data-testid="login-form"
          className="space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('login.form.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:outline-none
                    ${errors.email ? 'border-red-500' : ''}`}
                  placeholder={t('login.form.emailPlaceholder')}
                  required
                  aria-invalid={!!errors.email}
                  autoComplete="username"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('login.form.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:outline-none
                    ${errors.password ? 'border-red-500' : ''}`}
                  placeholder={t('login.form.passwordPlaceholder')}
                  required
                  aria-invalid={!!errors.password}
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 
                  rounded focus:ring-blue-500 focus:ring-offset-gray-800"
              />
              <span className="ml-2 text-sm text-gray-300">{t('login.form.rememberMe')}</span>
            </label>

            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {t('login.form.forgotPassword')}
            </button>
          </div>

          {errors.general && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || loginAttempts.count >= 5}
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
              t('login.form.submit')
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-400">
              {t('login.form.noAccount')}{' '}
              <button
                type="button"
                onClick={() => setAuthForm('signup')}
                className="text-blue-400 hover:text-blue-300"
              >
                {t('login.form.createAccount')}
              </button>
            </p>
          </div>

          {featureService.isEnabled('enableFacebookAuth') && (
            <div className="mt-6">
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-400 bg-gray-800">
                    {t('common.or')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`;
                }}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg
                  className="w-5 h-5 text-[#1877F2]"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2">{t('login.form.facebookLogin')}</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;