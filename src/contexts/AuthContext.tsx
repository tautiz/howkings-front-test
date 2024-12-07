import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login, logout, register, refresh } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
    id: number;
    name: string;
    email: string;
    profile_photo_url: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                } else {
                    // Jei nėra user duomenų localStorage, gauname iš /me endpoint
                    try {
                        const { data } = await getCurrentUser();
                        setUser(data);
                        localStorage.setItem('user', JSON.stringify(data));
                    } catch (error: any) {
                        if (error.response?.status !== 401) {
                            console.error('Error fetching user data:', error);
                        }
                    }
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            setError(null);
            const { data } = await login({ email, password });
            localStorage.setItem('token', data.access_token);
            
            // Gauname vartotojo duomenis ir išsaugome
            const userData = await getCurrentUser();
            const user = userData.data;
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            
            toast.success('Successfully logged in!');
        } catch (error: any) {
            const errorMessage = error.response?.status === 401
                ? 'Incorrect email or password'
                : error.response?.data?.message || 'Login failed. Please try again later.';
            setError(errorMessage);
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const handleRegister = async (userData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
    }) => {
        try {
            setError(null);
            await register(userData);
            await handleLogin(userData.email, userData.password);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const value = {
        user,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
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
