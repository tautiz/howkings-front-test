import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://bos.howkings.lt';

interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message?: string;
    error?: string;
    data?: T;
}

export interface PendingRequest {
    method: string;
    url: string;
    data?: any;
}

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}

let pendingRequest: PendingRequest | null = null;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const showToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    window.dispatchEvent(new CustomEvent('app:show-toast', {
        detail: { message, type }
    }));
};

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiResponse>) => {
        const originalRequest = error.config;

        // Handle 409 Conflict for duplicate votes
        if (error.response?.status === 409) {
            showToast(error.response.data?.message || 'Operation not allowed', 'error');
            return Promise.reject(error);
        }

        // If error is Unauthenticated
        if (error.response?.data?.error === "Unauthenticated." && originalRequest) {
            // Store the failed request
            pendingRequest = {
                method: originalRequest.method || 'GET',
                url: originalRequest.url || '',
                data: originalRequest.data
            };

            // Clear token and trigger login button click
            localStorage.removeItem('access_token');
            
            // Dispatch event to trigger the main login button
            window.dispatchEvent(new CustomEvent('auth:show-login'));

            // Return a promise that will be resolved when the user logs in
            return new Promise((resolve, reject) => {
                const handleLoginSuccess = async () => {
                    try {
                        if (pendingRequest) {
                            const { method, url, data } = pendingRequest;
                            pendingRequest = null;
                            const retryResponse = await api.request({ method, url, data });
                            resolve(retryResponse);
                        }
                    } catch (retryError) {
                        reject(retryError);
                    }
                    window.removeEventListener('auth:login-success', handleLoginSuccess);
                };

                window.addEventListener('auth:login-success', handleLoginSuccess);
            });
        }

        // Handle other errors
        showToast(error.response?.data?.message || 'An error occurred', 'error');
        return Promise.reject(error);
    }
);

// Auth endpoints
import { loginRateLimit, registrationRateLimit } from './rateLimitService';

export const register = async (data: RegisterData) => {
    const key = `register_${data.email}`;
    if (!registrationRateLimit.canAttempt(key)) {
        const remainingTime = Math.ceil(registrationRateLimit.getRemainingTime(key) / 1000);
        throw new Error(`Per daug bandymų. Bandykite dar kartą po ${remainingTime} sekundžių.`);
    }

    const response = await api.post<ApiResponse>('/api/register', data);
    registrationRateLimit.reset(key);
    return response;
};

export const login = async (email: string, password: string) => {
    const key = `login_${email}`;
    if (!loginRateLimit.canAttempt(key)) {
        const remainingTime = Math.ceil(loginRateLimit.getRemainingTime(key) / 1000);
        throw new Error(`Per daug bandymų. Bandykite dar kartą po ${remainingTime} sekundžių.`);
    }

    const response = await api.post<ApiResponse>('/api/login', { email, password });
    loginRateLimit.reset(key);
    const { access_token } = response.data.data || {};
    
    if (access_token) {
        localStorage.setItem('access_token', access_token);
        
        // Dispatch login success event
        window.dispatchEvent(new CustomEvent('auth:login-success'));
    }
    
    return response;
};

export const validateToken = () => api.get<ApiResponse>('/auth/validate-token');
export const refreshToken = (refreshToken: string) => 
    api.post<ApiResponse>('/auth/refresh-token', { refresh_token: refreshToken });

export const logout = async () => {
    try {
        await api.post<ApiResponse>('/api/logout');
    } finally {
        localStorage.removeItem('access_token');
    }
};

export const deleteAccount = () => {
    return api.delete(`${API_URL}/auth/account`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }
    });
};

// Request pool endpoints
export const listRequests = () => api.get<ApiResponse>('/api/module-requests');

export const createRequest = (data: {
    module_name: string;
    description: string;
    language: string;
    tags: string[];
}) => api.post<ApiResponse>('/api/module-requests', data);

// Balsavimo būsenos interfeisas
interface VoteResponse extends ApiResponse {
    data?: {
        votes: number;
    };
}

// Balsavimo klaidos
export enum VoteError {
    ALREADY_VOTED = 'ALREADY_VOTED',
    NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
    MODULE_NOT_FOUND = 'MODULE_NOT_FOUND'
}

// Balsavimo funkcija su klaidų valdymu
export const addVote = async (moduleRequestId: number): Promise<VoteResponse> => {
    try {
        // Patikriname autentifikaciją
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error(VoteError.NOT_AUTHENTICATED);
        }

        const response = await api.post<VoteResponse>(`/api/module-requests/vote`, {
            module_request_id: moduleRequestId,
            language: "EN"
        });

        // Optimistinis UI atnaujinimas
        if (response.data?.status === 'success') {
            // Įvykio paleidimas UI atnaujinimui
            window.dispatchEvent(new CustomEvent('module:voted', {
                detail: {
                    moduleId: moduleRequestId,
                    votes: response.data.data?.votes || 0
                }
            }));
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error || 'Balsavimo klaida';
            showToast(errorMessage, 'error');
            throw new Error(errorMessage);
        }
        throw error;
    }
};

export default api;
