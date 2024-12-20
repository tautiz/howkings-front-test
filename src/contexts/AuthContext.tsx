// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '../services/api';
import { analyticsService } from '../services/analyticsService';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Inicializuojam analytics
    analyticsService.initializeAnalytics();

    // Bandome atstatyti vartotojo sesiją
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await api.login(email, password);
      
      if (response.data.status === 'success') {
        const { user: userData, tokens } = response.data.data;
        
        // Išsaugom vartotojo duomenis
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('access_token', tokens.access_token);
        if (tokens.refresh_token) {
          localStorage.setItem('refresh_token', tokens.refresh_token);
        }

        // Siunčiam analytics įvykį
        analyticsService.trackEvent({
          action: 'login',
          category: 'auth',
          label: 'success'
        });
      } else {
        throw new Error(response.data.message || 'Unknown error occurred');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Įvyko nenumatyta klaida';
      setError(errorMessage);
      
      // Siunčiam analytics įvykį apie klaidą
      analyticsService.trackEvent({
        action: 'login',
        category: 'auth',
        label: 'error'
      });
      
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string, phone: string) => {
    try {
      setError(null);
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      const response = await api.register({
        firstName,
        lastName,
        email,
        phone,
        password
      });
      
      if (response.data.status === 'success') {
        const { user: userData, tokens } = response.data.data;
        
        // Išsaugom vartotojo duomenis
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('access_token', tokens.access_token);
        if (tokens.refresh_token) {
          localStorage.setItem('refresh_token', tokens.refresh_token);
        }

        // Siunčiam analytics įvykį
        analyticsService.trackEvent({
          action: 'register',
          category: 'auth',
          label: 'success'
        });
      } else {
        throw new Error(response.data.message || 'Unknown error occurred');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Įvyko klaida bandant registruotis';
      setError(errorMessage);
      
      // Siunčiam analytics įvykį apie klaidą
      analyticsService.trackEvent({
        action: 'register',
        category: 'auth',
        label: 'error'
      });
      
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      setError(null);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // Siunčiam analytics įvykį
      analyticsService.trackEvent({
        action: 'logout',
        category: 'auth',
        label: 'success'
      });
    } catch (err: any) {
      console.error('Logout error:', err);
      // Net jei įvyko klaida, vis tiek išvalome vietinius duomenis
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // Siunčiam analytics įvykį apie klaidą
      analyticsService.trackEvent({
        action: 'logout',
        category: 'auth',
        label: 'error'
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
