// src/context/AuthContext.tsx
import React, { createContext, useContext } from 'react';
import { useAuthProvider } from './useAuthProvider';

interface AuthContextType {
    user: import('./authHelpers').User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    showLoginModal: boolean;
    setShowLoginModal: (show: boolean) => void;
    setPendingAction: (action: import('./authHelpers').PendingAction | null) => void;
    pendingAction: import('./authHelpers').PendingAction | null;
    authForm: 'login' | 'signup' | 'forgot-password' | null;
    setAuthForm: (form: 'login' | 'signup' | 'forgot-password' | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuthProvider();
    return (
        <AuthContext.Provider value={auth}>
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
