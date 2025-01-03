import React, { useState, useEffect } from 'react';
import { X, Loader2, Mail, Lock, User, Phone } from 'lucide-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { useLanguage } from '../../contexts/LanguageContext';
import FormStep from './FormStep';
import GDPRConsent from './GDPRConsent';
import PasswordStrength from './PasswordStrength';
import { validatePassword, validatePhone, validateEmail, validateName } from '../../utils/validation';

interface SignUpFormProps {
  onClose: () => void;
}

interface SignUpData {
  type: 'individual' | 'organization';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  organizationName?: string;
  gdprConsent: boolean;
}

interface ApiErrors {
  [key: string]: string[];
}

interface ValidationErrors {
  [key: string]: string;
}

const TOTAL_STEPS = 3;

const SignUpForm: React.FC<SignUpFormProps> = ({ onClose }) => {
  const { register } = useAuth();
  const { translations } = useLanguage();
  const showOrgRegistration = useFeatureFlag('FEATURE_ALLOW_ORGANIZATION_REGISTRATION');
  const [savedData, setSavedData] = useLocalStorage<Partial<SignUpData>>('signup_form', {});
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SignUpData>({
    type: savedData.type || 'individual',
    firstName: savedData.firstName || '',
    lastName: savedData.lastName || '',
    email: savedData.email || '',
    phone: savedData.phone || '',
    password: '',
    organizationName: savedData.organizationName || '',
    gdprConsent: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<ApiErrors>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Real-time validacija
  const validateField = (name: string, value: string): string | null => {
    let result: ValidationResult;

    switch (name) {
      case 'firstName':
      case 'lastName':
        result = validateName(value);
        break;
      
      case 'email':
        result = validateEmail(value);
        break;
      
      case 'phone':
        result = validatePhone(value);
        break;
      
      case 'password':
        result = validatePassword(value);
        break;
      
      default:
        return null;
    }

    if (!result.isValid && result.errorKey) {
      const message = result.params 
        ? translations.signUp.errors[result.errorKey].replace(
            `{${Object.keys(result.params)[0]}}`, 
            Object.values(result.params)[0]
          )
        : translations.signUp.errors[result.errorKey];
      return message;
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Formatuojame telefono numerį
    if (name === 'phone') {
      const phoneNumber = parsePhoneNumberFromString(value, 'LT');
      if (phoneNumber) {
        setFormData(prev => ({ ...prev, [name]: phoneNumber.format('INTERNATIONAL') }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Validuojame lauką
    const error = validateField(name, value);
    if (error) {
      setValidationErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setApiErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    
    setGeneralError(null);

    // Išsaugome formos duomenis (išskyrus slaptažodį)
    if (name !== 'password') {
      setSavedData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (): boolean => {
    const stepFields = {
      0: ['type', 'firstName', 'lastName', 'organizationName'],
      1: ['email', 'phone', 'password'],
      2: ['gdprConsent']
    }[currentStep];

    const errors: ValidationErrors = {};
    
    stepFields?.forEach(field => {
      if (field === 'gdprConsent' && !formData.gdprConsent) {
        errors[field] = translations.signUp.errors.gdprRequired;
      } else if (field !== 'organizationName' || formData.type === 'organization') {
        const error = validateField(field, formData[field as keyof SignUpData] as string);
        if (error) {
          errors[field] = error;
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) {
      setGeneralError(translations.signUp.errors.validationFailed);
      return;
    }

    setIsLoading(true);
    setApiErrors({});
    setGeneralError(null);

    try {
      if (formData.type === 'individual') {
        await register(
          formData.email, 
          formData.password, 
          `${formData.firstName} ${formData.lastName}`,
          formData.phone
        );
      } else {
        await register(
          formData.email, 
          formData.password, 
          formData.organizationName || '',
          formData.phone
        );
      }
      
      analyticsService.trackFormInteraction('signup_form', 'submit', 'success');
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setApiErrors(err.response.data.errors);
      } else {
        setGeneralError(err.response?.data?.message || translations.signUp.errors.unexpectedError);
      }
      
      analyticsService.trackFormInteraction('signup_form', 'submit', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName: string) => {
    const baseClasses = "w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2";
    const hasError = apiErrors[fieldName] || validationErrors[fieldName];
    return `${baseClasses} ${hasError ? "border-2 border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`;
  };

  const renderError = (fieldName: string) => {
    const error = validationErrors[fieldName] || (apiErrors[fieldName] && apiErrors[fieldName][0]);
    if (error) {
      return <p className="mt-1 text-sm text-red-500">{error}</p>;
    }
    return null;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            {showOrgRegistration && (
              <div className="space-y-4">
                <label className="block">
                  <input
                    type="radio"
                    name="type"
                    value="individual"
                    checked={formData.type === 'individual'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {translations.signUp.individual}
                </label>
                <label className="block">
                  <input
                    type="radio"
                    name="type"
                    value="organization"
                    checked={formData.type === 'organization'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {translations.signUp.organization}
                </label>
              </div>
            )}

            {formData.type === 'organization' ? (
              <div className="relative">
                <label htmlFor="organizationName" className="sr-only">
                  {translations.signUp.organizationName}
                </label>
                <input
                  id="organizationName"
                  type="text"
                  name="organizationName"
                  required
                  placeholder={translations.signUp.organizationName}
                  value={formData.organizationName}
                  onChange={handleChange}
                  className={getInputClassName('organizationName')}
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {renderError('organizationName')}
              </div>
            ) : (
              <>
                <div className="relative">
                  <label htmlFor="firstName" className="sr-only">
                    {translations.signUp.firstName}
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    required
                    placeholder={translations.signUp.firstName}
                    value={formData.firstName}
                    onChange={handleChange}
                    className={getInputClassName('firstName')}
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  {renderError('firstName')}
                </div>

                <div className="relative">
                  <label htmlFor="lastName" className="sr-only">
                    {translations.signUp.lastName}
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    required
                    placeholder={translations.signUp.lastName}
                    value={formData.lastName}
                    onChange={handleChange}
                    className={getInputClassName('lastName')}
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  {renderError('lastName')}
                </div>
              </>
            )}
          </>
        );

      case 1:
        return (
          <>
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                {translations.signUp.email}
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder={translations.signUp.email}
                value={formData.email}
                onChange={handleChange}
                className={getInputClassName('email')}
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {renderError('email')}
            </div>

            <div className="relative">
              <label htmlFor="phone" className="sr-only">
                {translations.signUp.phone}
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                required
                placeholder={translations.signUp.phone}
                value={formData.phone}
                onChange={handleChange}
                className={getInputClassName('phone')}
              />
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {renderError('phone')}
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                {translations.signUp.password}
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                placeholder={translations.signUp.password}
                value={formData.password}
                onChange={handleChange}
                className={getInputClassName('password')}
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {renderError('password')}
              <PasswordStrength password={formData.password} />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <GDPRConsent
              onConsent={(consented) => 
                setFormData(prev => ({ ...prev, gdprConsent: consented }))
              }
              consented={formData.gdprConsent}
            />
            {renderError('gdprConsent')}
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {translations.signUp.title}
        </h2>

        <FormStep currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderStepContent()}

          {generalError && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">
              {generalError}
            </div>
          )}

          <div className="flex justify-between space-x-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 py-2 px-4 rounded-lg text-white bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                {translations.signUp.prev}
              </button>
            )}

            <button
              type={currentStep === TOTAL_STEPS - 1 ? 'submit' : 'button'}
              onClick={currentStep === TOTAL_STEPS - 1 ? undefined : handleNextStep}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-white transition-colors ${
                isLoading
                  ? 'bg-blue-500/50 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
              <span>
                {isLoading
                  ? translations.signUp.loading
                  : currentStep === TOTAL_STEPS - 1
                  ? translations.signUp.submit
                  : translations.signUp.next}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;