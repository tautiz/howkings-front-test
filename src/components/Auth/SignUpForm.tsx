import React, { useState } from 'react';
import { X, Loader2, Mail, Lock, User, MapPin, Building2 } from 'lucide-react';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface SignUpFormProps {
  onClose: () => void;
}

interface SignUpData {
  type: 'individual' | 'organization';
  fullName: string;
  email: string;
  password: string;
  country: string;
  city: string;
  organizationName?: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onClose }) => {
  const showOrgRegistration = useFeatureFlag('FEATURE_ALLOW_ORGANIZATION_REGISTRATION');
  const [savedData, setSavedData] = useLocalStorage<Partial<SignUpData>>('signup_form', {});
  
  const [formData, setFormData] = useState<SignUpData>({
    type: savedData.type || 'individual',
    fullName: savedData.fullName || '',
    email: savedData.email || '',
    password: '',
    country: savedData.country || '',
    city: savedData.city || '',
    organizationName: savedData.organizationName || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);

    // Save form data (except password)
    if (name !== 'password') {
      setSavedData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://bos.howkings.lt/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }

      // Clear saved form data on successful registration
      setSavedData({});
      
      // Handle successful registration
      const data = await response.json();
      // TODO: Store token and redirect
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {showOrgRegistration && (
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'type', value: 'individual' } } as any)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                  ${formData.type === 'individual'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                Individual
              </button>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'type', value: 'organization' } } as any)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                  ${formData.type === 'organization'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                Organization
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {formData.type === 'organization' ? 'Organization Name' : 'Full Name'}
              </label>
              <div className="relative">
                {formData.type === 'organization' ? (
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                ) : (
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                )}
                <input
                  type="text"
                  name={formData.type === 'organization' ? 'organizationName' : 'fullName'}
                  value={formData.type === 'organization' ? formData.organizationName : formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={formData.type === 'organization' ? 'Enter organization name' : 'Enter your full name'}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Country"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="City"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg 
              hover:bg-blue-600 transition-colors duration-300 
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;