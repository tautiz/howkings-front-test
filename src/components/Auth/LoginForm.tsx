import React, { useState } from 'react';
import { X, Loader2, Mail, Lock } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../contexts/AuthContext';
import { featureService } from '../../config/features';

interface LoginFormProps {
  onClose: () => void;
  onForgotPassword: () => void;
}

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onForgotPassword }) => {
  const { login } = useAuth();
  const [savedData, setSavedData] = useLocalStorage<Partial<LoginData>>('login_form', {});
  const [formData, setFormData] = useState<LoginData>({
    email: savedData.email || '',
    password: '',
    rememberMe: savedData.rememberMe || false
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
      setError(err.message || 'Invalid email or password');
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

        <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>

        <form 
          onSubmit={handleSubmit}
          data-testid="login-form"
          className="space-y-6"
        >
          <div className="space-y-4">
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
                  placeholder="Enter your password"
                  required
                />
              </div>
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
              <span className="ml-2 text-sm text-gray-300">Remember me</span>
            </label>

            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 
              text-white rounded-lg focus:ring-2 focus:ring-blue-500 
              focus:outline-none transition-colors disabled:opacity-50 
              disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Loading...
              </>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="relative my-6 hidden">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-400 bg-gray-800">Or</span>
            </div>
          </div>

          {featureService.isEnabled('enableFacebookAuth') && (
            <div className="mt-6">
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
                <span className="ml-2">Prisijungti su Facebook</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;