// useAuthProvider.ts
import { useState, useEffect, useMemo } from 'react';
import * as api from '../services/api';
import { AuthResponse, User, PendingAction, showToast, handleError, executePendingAction } from './authHelpers';
import { analyticsService } from '../services/analyticsService';

function decodeJWT(token: string): { exp?: number } {
    // Paprastas JWT dekodavimas (be patikrinimo), tik pavyzdžiui.
    // Base64 decoding:
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return {};
    const payload = JSON.parse(atob(payloadBase64));
    return payload;
}

function isTokenExpired(token: string): boolean {
    const payload = decodeJWT(token);
    if (!payload.exp) return true; // Jei nėra exp lauko, laikome tokeną negaliojančiu
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
}

export const useAuthProvider = () => {
    const [user, setUser] = useState<User | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
    const [authForm, setAuthForm] = useState<'login' | 'signup' | 'forgot-password' | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const setAuthState = (userData: User | null, accessToken?: string, refreshToken?: string) => {
        if (userData && accessToken && refreshToken) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
        } else {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const storedAccessToken = localStorage.getItem('access_token');
            const storedRefreshToken = localStorage.getItem('refresh_token');

            if (storedUser && storedAccessToken && storedRefreshToken) {
                try {
                    // Jei access token pasibaigęs, bandome atnaujinti
                    if (isTokenExpired(storedAccessToken)) {
                        // Bandom atnaujinti
                        const response = await api.post<AuthResponse>('/api/refresh', {
                            refresh_token: storedRefreshToken
                        });
                        if (response.data.status === 'success') {
                            const { user: userData, tokens } = response.data.data;
                            setAuthState(userData, tokens.access_token, tokens.refresh_token);
                        } else {
                            setAuthState(null); // Nepavyko atnaujinti
                        }
                    } else {
                        // Access token galioja
                        const parsedUser: User = JSON.parse(storedUser);
                        setUser(parsedUser);
                    }
                } catch (err) {
                    // Refresh nepavyko
                    console.error('Token refresh error:', err);
                    setAuthState(null);
                }
            }
            setIsInitialized(true);
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        // Track login attempt
        analyticsService.trackFormInteraction('login-form', 'start', {
            email_domain: email.split('@')[1]
        });

        try {
            const response = await api.login({ email, password });
            const authResponse = response.data as AuthResponse;

            if (authResponse.status === 'success' && authResponse.data.user && authResponse.data.tokens) {
                const { user: userData, tokens } = authResponse.data;
                setAuthState(userData, tokens.access_token, tokens.refresh_token);

                // Track successful login
                analyticsService.trackFormInteraction('login-form', 'complete', {
                    user_id: userData.id,
                    user_type: userData.type || 'standard'
                });

                // Update user properties
                analyticsService.setUserProperties({
                    userId: userData.id,
                    userType: userData.type || 'standard',
                    lastLoginDate: new Date().toISOString()
                });

                setAuthForm(null);
                showToast(authResponse.message || 'Successfully logged in', 'success');

                await executePendingAction(pendingAction);
                setPendingAction(null);

                window.dispatchEvent(new CustomEvent('auth:login-success'));
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            // Track login error
            analyticsService.trackFormInteraction('login-form', 'error', {
                error_type: error.message || 'Unknown error'
            });

            showToast('Invalid credentials', 'error');
            throw error;
        }
    };

    const register = async (data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
    }) => {
        // Track form submission start
        analyticsService.trackFormInteraction('registration-form', 'start', {
            has_phone: !!data.phone
        });

        try {
            const response = await api.register(data);
            const authResponse = response.data as AuthResponse;

            if (authResponse.status === 'success' && authResponse.data.user && authResponse.data.tokens) {
                const { user: userData, tokens } = authResponse.data;
                setAuthState(userData, tokens.access_token, tokens.refresh_token);

                // Track successful registration
                analyticsService.trackFormInteraction('registration-form', 'complete', {
                    user_id: userData.id,
                    has_phone: !!data.phone
                });

                // Set user properties for future tracking
                analyticsService.setUserProperties({
                    userId: userData.id,
                    userType: userData.type || 'standard',
                    registrationDate: new Date().toISOString()
                });

                setAuthForm(null);
                showToast(authResponse.message || 'Registration successful', 'success');

                // Execute pending action if exists
                await executePendingAction(pendingAction);
                setPendingAction(null);

                // Dispatch registration success event
                window.dispatchEvent(new CustomEvent('auth:registration-success'));
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            // Track registration error
            analyticsService.trackFormInteraction('registration-form', 'error', {
                error_type: error.message || 'Unknown error'
            });
            
            showToast('Registration failed', 'error');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear user and tokens
            setAuthState(null);
            showToast('Logged out', 'info');
        }
    };

    const isAuthenticated = useMemo(() => {
        const accessToken = localStorage.getItem('access_token');
        return Boolean(user && accessToken && !isTokenExpired(accessToken));
    }, [user]);

    if (!isInitialized) {
        return {
            user: null,
            isAuthenticated: false,
            login: async () => { /* laukiam kol isInitialized taps true */ },
            logout: async () => { /* laukiam kol isInitialized taps true */ },
            register: async () => { /* laukiam kol isInitialized taps true */ },
            showLoginModal,
            setShowLoginModal,
            setPendingAction,
            pendingAction,
            authForm,
            setAuthForm
        }
    }

    return {
        user,
        isAuthenticated,
        login,
        logout,
        register,
        showLoginModal,
        setShowLoginModal,
        setPendingAction,
        pendingAction,
        authForm,
        setAuthForm
    };
};
