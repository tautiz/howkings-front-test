import React from 'react';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isDisabled: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, isDisabled }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting || isDisabled}
      className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 
        transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit Request'
      )}
    </button>
  );
};

export default SubmitButton;