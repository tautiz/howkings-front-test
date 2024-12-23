import axios from 'axios';
import { API_URL } from '../config';

export const getCsrfToken = (): string | null => {
  // Gauname token'ą iš cookie
  const cookies = document.cookie.split(';');
  const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
  return xsrfCookie ? xsrfCookie.split('=')[1] : null;
};

export const initializeCsrf = async (): Promise<void> => {
  try {
    // Gauname CSRF token'ą iš serverio
    await axios.get(`${API_URL}/api/csrf-token`, {
      withCredentials: true // Būtina, kad cookie būtų išsaugotas
    });
    
    // Token'as bus automatiškai išsaugotas cookie per Set-Cookie header'į
    
    // Pridedame CSRF token'ą prie visų Axios užklausų
    axios.interceptors.request.use(config => {
      const token = getCsrfToken();
      if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
      }
      return config;
    });
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error);
  }
};

export const refreshCsrfToken = async (): Promise<void> => {
  await initializeCsrf();
};
