import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface FormStepProps {
  currentStep: number;
  totalSteps: number;
}

const FormStep: React.FC<FormStepProps> = ({ currentStep, totalSteps }) => {
  const { translations } = useLanguage();

  const getStepTitle = (index: number): string => {
    switch (index) {
      case 0:
        return translations.signUp.steps.basicInfo;
      case 1:
        return translations.signUp.steps.contacts;
      case 2:
        return translations.signUp.steps.confirmation;
      default:
        return '';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                }`}
              >
                {index < currentStep ? (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-white">{index + 1}</span>
                )}
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {getStepTitle(index)}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`flex-1 h-0.5 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FormStep;
