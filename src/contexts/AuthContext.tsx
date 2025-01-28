// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '../services/api';
import { analyticsService } from '../services/analyticsService';
import { tokenValidationService } from '../services/tokenValidationService';
import { AuthFormType } from '../components/Auth';

interface User {
  id: string;
  email: string;
  name: string;
}

interface PendingAction {
  type: 'vote' | 'create_request';
  payload: any;
  onComplete?: () => void;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  handleInvalidToken: () => void;
  deleteAccount: () => Promise<void>;
  setPendingAction: (action: PendingAction | null) => void;
  setAuthForm: (form: AuthFormType) => void;
  pendingAction: PendingAction | null;
  authForm: AuthFormType | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [authForm, setAuthForm] = useState<AuthFormType | null>(null);

  const handleInvalidToken = () => {
    setUser(null);
    tokenValidationService.clearAuthData();
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (isInitialized) return;

      analyticsService.initializeAnalytics();
      setIsInitialized(true);

      // Bandome gauti vartotojo duomenis, jei yra token
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await tokenValidationService.validateToken();
          console.log('User data:', userData);
          setUser(userData);
        } catch (error) {
          // Jei klaida - tiesiog išvalome duomenis
          handleInvalidToken();
        }
      }
    };

    initializeAuth();
  }, [isInitialized]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await api.login(email, password);
      
      if (response.status === 'success' && response.data?.user) {
        // Išsaugom vartotojo duomenis
        setUser(response.data.user);
        
        // Siunčiam analytics įvykį
        analyticsService.trackEvent({
          action: 'login',
          category: 'auth',
          label: 'success'
        });
        
        // Execute pending action if exists
        if (pendingAction) {
          if (pendingAction.type === 'vote') {
            await api.addVote(pendingAction.payload.moduleRequestId);
          } else if (pendingAction.type === 'create_request') {
            await api.createRequest(pendingAction.payload.data);
          }
          pendingAction.onComplete?.();
          setPendingAction(null);
        }
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      analyticsService.trackEvent({
        action: 'login',
        category: 'auth',
        label: 'error'
      });
      throw error;
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
        password,
      });
      
      if (response.data.status === 'success') {
        const { user: userData, tokens } = response.data.data;
        
        // Išsaugom vartotojo duomenis
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        tokenValidationService.saveTokens(tokens.access_token, tokens.refresh_token);

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
    } catch (err: any) {
      console.error('Logout error:', err);
      // Jei gauname 401, reiškia token'as jau negalioja
      if (err.response?.status === 401) {
        analyticsService.trackEvent({
          action: 'logout',
          category: 'auth',
          label: 'token_expired'
        });
      }
    } finally {
      // Visada išvalome vartotojo duomenis
      handleInvalidToken();
      analyticsService.trackEvent({
        action: 'logout',
        category: 'auth',
        label: 'success'
      });
    }
  };

  const deleteAccount = async () => {
    try {
      setError(null);
      await api.deleteAccount();
      
      // Išvalome vartotojo duomenis
      setUser(null);
      localStorage.removeItem('user');
      tokenValidationService.clearAuthData();

      // Siunčiam analytics įvykį
      analyticsService.trackEvent({
        action: 'delete_account',
        category: 'auth',
        label: 'success'
      });

      window.location.href = '/login';
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Įvyko klaida bandant ištrinti paskyrą';
      setError(errorMessage);
      
      analyticsService.trackEvent({
        action: 'delete_account',
        category: 'auth',
        label: 'error'
      });
      
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: user !== null,
      error,
      login,
      register,
      logout,
      handleInvalidToken,
      deleteAccount,
      setPendingAction,
      setAuthForm,
      pendingAction,
      authForm
    }}>
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
