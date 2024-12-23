import { parsePhoneNumberFromString } from 'libphonenumber-js';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validatePassword = (password: string): ValidationResult => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Slaptažodis turi būti bent ${minLength} simbolių ilgio`
    };
  }

  if (!hasUpperCase) {
    return {
      isValid: false,
      message: 'Slaptažodis turi turėti bent vieną didžiąją raidę'
    };
  }

  if (!hasNumber) {
    return {
      isValid: false,
      message: 'Slaptažodis turi turėti bent vieną skaičių'
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      message: 'Slaptažodis turi turėti bent vieną specialų simbolį'
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
        message: 'Neteisingas telefono numerio formatas'
      };
    }
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      message: 'Neteisingas telefono numerio formatas'
    };
  }
};

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Neteisingas el. pašto formatas'
    };
  }
  return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
  if (name.length < 2) {
    return {
      isValid: false,
      message: 'Vardas turi būti bent 2 simbolių ilgio'
    };
  }
  if (name.length > 50) {
    return {
      isValid: false,
      message: 'Vardas negali būti ilgesnis nei 50 simbolių'
    };
  }
  return { isValid: true };
};
