import React, { useState } from 'react';
import { X, Loader2, Mail, Lock, User, Phone } from 'lucide-react';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsService } from '../../services/analyticsService';

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
}

interface ApiErrors {
  [key: string]: string[];
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onClose }) => {
  const { register } = useAuth();
  const showOrgRegistration = useFeatureFlag('FEATURE_ALLOW_ORGANIZATION_REGISTRATION');
  const [savedData, setSavedData] = useLocalStorage<Partial<SignUpData>>('signup_form', {});
  
  const [formData, setFormData] = useState<SignUpData>({
    type: savedData.type || 'individual',
    firstName: savedData.firstName || '',
    lastName: savedData.lastName || '',
    email: savedData.email || '',
    phone: savedData.phone || '',
    password: '',
    organizationName: savedData.organizationName || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ApiErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Išvalome klaidos pranešimą šiam laukeliui
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    
    setGeneralError(null);

    // Save form data (except password)
    if (name !== 'password') {
      setSavedData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
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
      
      // Siunčiam analytics įvykį
      analyticsService.trackFormInteraction('signup_form', 'submit', 'success');
      
      onClose();
    } catch (err: any) {
      // Tikriname ar yra API klaidos
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setGeneralError(err.response?.data?.message || 'Įvyko nenumatyta klaida');
      }
      
      analyticsService.trackFormInteraction('signup_form', 'submit', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName: string) => {
    const baseClasses = "w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2";
    return `${baseClasses} ${
      errors[fieldName] 
        ? "border-2 border-red-500 focus:ring-red-500" 
        : "focus:ring-blue-500"
    }`;
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

        <h2 className="text-2xl font-bold text-white mb-6">Sukurti paskyrą</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {showOrgRegistration && (
            <div>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={getInputClassName('type')}
              >
                <option value="individual">Individualus</option>
                <option value="organization">Organizacija</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-500">{errors.type[0]}</p>
              )}
            </div>
          )}

          {formData.type === 'organization' ? (
            <div className="relative">
              <label htmlFor="organizationName" className="sr-only">
                Organizacijos pavadinimas
              </label>
              <input
                id="organizationName"
                type="text"
                name="organizationName"
                required
                placeholder="Organizacijos pavadinimas"
                value={formData.organizationName}
                onChange={handleChange}
                className={getInputClassName('organizationName')}
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {errors.organizationName && (
                <p className="mt-1 text-sm text-red-500">{errors.organizationName[0]}</p>
              )}
            </div>
          ) : (
            <>
              <div className="relative">
                <label htmlFor="firstName" className="sr-only">
                  Vardas
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  required
                  placeholder="Vardas"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={getInputClassName('firstName')}
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName[0]}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="lastName" className="sr-only">
                  Pavardė
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  required
                  placeholder="Pavardė"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={getInputClassName('lastName')}
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName[0]}</p>
                )}
              </div>
            </>
          )}

          <div className="relative">
            <label htmlFor="email" className="sr-only">
              El. paštas
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="El. paštas"
              value={formData.email}
              onChange={handleChange}
              className={getInputClassName('email')}
            />
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="phone" className="sr-only">
              Telefonas
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              required
              placeholder="Telefonas"
              value={formData.phone}
              onChange={handleChange}
              className={getInputClassName('phone')}
            />
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone[0]}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Slaptažodis
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="Slaptažodis"
              value={formData.password}
              onChange={handleChange}
              className={getInputClassName('password')}
            />
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password[0]}</p>
            )}
          </div>

          {generalError && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">
              {generalError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-white transition-colors ${
              isLoading
                ? 'bg-blue-500/50 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
            <span>{isLoading ? 'Registruojama...' : 'Registruotis'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;