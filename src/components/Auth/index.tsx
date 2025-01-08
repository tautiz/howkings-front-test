import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';

export type AuthFormType = 'signin' | 'signup' | 'forgot-password' | null;

interface AuthProps {
  initialForm?: AuthFormType;
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ initialForm = null, onClose }) => {
  const [currentForm, setCurrentForm] = useState<AuthFormType>(initialForm);

  if (!currentForm) return null;

  switch (currentForm) {
    case 'signin':
      return (
        <LoginForm
          onClose={onClose}
          onForgotPassword={() => setCurrentForm('forgot-password')}
        />
      );
    case 'signup':
      return <SignUpForm onClose={onClose} />;
    case 'forgot-password':
      return (
        <ForgotPasswordForm
          onClose={onClose}
          onBack={() => setCurrentForm('signin')}
        />
      );
    default:
      return null;
  }
};

export default Auth;