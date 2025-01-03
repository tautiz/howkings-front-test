import { parsePhoneNumberFromString } from 'libphonenumber-js';

export interface ValidationResult {
  isValid: boolean;
  errorKey?: string;
  params?: Record<string, string>;
}

export const validatePassword = (password: string): ValidationResult => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      errorKey: 'passwordMinLength',
      params: { length: minLength.toString() }
    };
  }

  if (!hasUpperCase) {
    return {
      isValid: false,
      errorKey: 'passwordUppercase'
    };
  }

  if (!hasNumber) {
    return {
      isValid: false,
      errorKey: 'passwordNumber'
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      errorKey: 'passwordSpecial'
    };
  }

  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      return {
        isValid: false,
        errorKey: 'phoneInvalid'
      };
    }
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errorKey: 'phoneInvalid'
    };
  }
};

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errorKey: 'emailInvalid'
    };
  }
  return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
  if (name.length < 2) {
    return {
      isValid: false,
      errorKey: 'nameMinLength'
    };
  }
  if (name.length > 50) {
    return {
      isValid: false,
      errorKey: 'nameMaxLength'
    };
  }
  return { isValid: true };
};
