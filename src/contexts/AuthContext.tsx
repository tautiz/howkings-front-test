import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    showLoginModal: boolean;
    setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        // Listen for show login events
        const handleShowLogin = () => {
            // Find and click the login button in the navigation
            const loginButton = document.querySelector('[data-testid="login-button"]') as HTMLElement;
            if (loginButton) {
                loginButton.click();
            }
        };

        window.addEventListener('auth:show-login', handleShowLogin);
        
        return () => {
            window.removeEventListener('auth:show-login', handleShowLogin);
        };
    }, []);

    const showToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
        window.dispatchEvent(new CustomEvent('app:show-toast', {
            detail: { message, type }
        }));
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await api.login({ email, password });
            const { user: userData } = response.data;
            
            if (userData) {
                setUser(userData);
                setShowLoginModal(false);
                showToast('Successfully logged in', 'success');
            } else {
                throw new Error('No user data received');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Login failed. Please check your credentials.');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.logout();
            setUser(null);
            showToast('Logged out successfully', 'info');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear the user state even if the API call fails
            setUser(null);
            showToast('Logged out', 'info');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            showLoginModal,
            setShowLoginModal
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

export default AuthContext;
