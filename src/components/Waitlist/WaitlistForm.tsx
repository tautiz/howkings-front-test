import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WaitlistFormData {
  email: string;
}

export const WaitlistForm = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistFormData>();

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-4">🎉 {t('waitlist.form.success')}</h3>
        <p className="text-gray-300">
          {t('waitlist.subtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl shadow-2xl"
      >
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">
            {t('waitlist.form.email')}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              {...register('email', {
                required: t('waitlist.form.error.required'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('waitlist.form.error.invalid'),
                },
              })}
              type="email"
              id="email"
              className={`block w-full pl-10 pr-3 py-2 bg-gray-800 border ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              <span>{t('common.loading')}</span>
            </>
          ) : (
            <>
              <span>{t('waitlist.form.submit')}</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
