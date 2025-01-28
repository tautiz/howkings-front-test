import axios, { AxiosError } from 'axios';
import { UserData } from './userDataService';

const API_URL = '/api';

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

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle unauthorized requests
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
            // Išsaugome dabartinį requestą
            const originalRequest = error.config;
            if (originalRequest) {
                pendingRequestsManager.setPendingRequest({
                    method: originalRequest.method || 'GET',
                    url: originalRequest.url || '',
                    data: originalRequest.data
                });
                
                // Dispatch event to show login modal
                window.dispatchEvent(new CustomEvent('auth:required'));
                
                // Throw custom error to handle in UI
                throw new Error('AUTH_REQUIRED');
            }
        }
        return Promise.reject(error);
    }
);

// PendingRequests valdymo funkcijos
const pendingRequestsManager = {
    setPendingRequest: (request: PendingRequest) => {
        localStorage.setItem('pendingRequest', JSON.stringify(request));
    },
    getPendingRequest: (): PendingRequest | null => {
        const stored = localStorage.getItem('pendingRequest');
        return stored ? JSON.parse(stored) : null;
    },
    clearPendingRequest: () => {
        localStorage.removeItem('pendingRequest');
    },
    executePendingRequest: async () => {
        const request = pendingRequestsManager.getPendingRequest();
        if (!request) return;

        try {
            await api({
                method: request.method,
                url: request.url,
                data: request.data
            });
            pendingRequestsManager.clearPendingRequest();
        } catch (error) {
            console.error('Failed to execute pending request:', error);
        }
    }
};

// Auth endpoints
import { registrationRateLimit } from './rateLimitService';

export const register = async (data: RegisterData) => {
    const key = `registration_${data.email}`;
    if (!registrationRateLimit.canMakeRequest(key)) {
        const remainingTime = registrationRateLimit.getRemainingTime(key);
        throw new Error(`Per daug bandymų. Bandykite dar kartą po ${remainingTime} sekundžių.`);
    }

    const response = await api.post<ApiResponse>('/register', data);
    registrationRateLimit.reset(key);
    return response;
};

export async function login(email: string, password: string) {
    try {
        const response = await api.post<ApiResponse>('/login', { email, password });
        
        if (response.data.status === 'success' && response.data.data?.tokens?.access_token) {
            const { tokens, user } = response.data.data;
            
            // Išsaugome tokenus
            localStorage.setItem('access_token', tokens.access_token);
            localStorage.setItem('refresh_token', tokens.refresh_token);
            
            // Išsaugome vartotojo duomenis
            localStorage.setItem('user', JSON.stringify(user));
            
            return {
                status: 'success',
                data: {
                    user,
                    access_token: tokens.access_token
                }
            };
        }
        
        return {
            status: 'error',
            error: 'Invalid email or password'
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            status: 'error',
            error: error instanceof Error ? error.message : 'Login failed'
        };
    }
}

export const validateToken = async (): Promise<UserData> => {
    const response = await api.get<ApiResponse<{ user: UserData }>>('/me');
    if (response.data.status === 'success' && response.data.data?.user) {
        return response.data.data.user;
    }
    throw new Error(response.data.message || 'Failed to validate token');
};

export const refreshToken = (refreshToken: string) => 
    api.post<ApiResponse>('/refresh-token', { refresh_token: refreshToken });

export const logout = () => {
    localStorage.removeItem('access_token');
    return api.post<ApiResponse>('/logout');
};

export const deleteAccount = () => {
    return api.delete('/me', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }
    });
};

// Request pool endpoints
export const listRequests = async () => {
    try {
        const response = await api.get<ApiResponse>('/module-requests');
        if (response.data?.data) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('List requests error:', error);
        return [];
    }
};

export const createRequest = (data: {
    module_name: string;
    description: string;
    language: string;
    tags: string[];
}) => api.post<ApiResponse>('/module-requests', data);

// Balsavimo būsenos interfeisas
interface VoteResponse {
    status: 'success' | 'error';
    data?: {
        votes: number;
    };
    error?: string;
    message?: string;
}

// Balsavimo klaidos
export enum VoteError {
    ALREADY_VOTED = 'ALREADY_VOTED',
    NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
    MODULE_NOT_FOUND = 'MODULE_NOT_FOUND',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Balsavimo funkcija su geresniu klaidų apdorojimu ir kalbos nustatymu
export const addVote = async (moduleRequestId: number): Promise<VoteResponse> => {
    try {
        // Gauname vartotojo kalbą iš naršyklės arba localStorage
        const userLanguage = localStorage.getItem('user_language') || navigator.language.split('-')[0].toUpperCase() || 'EN';

        const response = await api.post<VoteResponse>(`/module-requests/vote`, {
            module_request_id: moduleRequestId.toString(),
            language: userLanguage
        });

        return {
            status: 'success',
            data: {
                votes: response.data.data?.votes || 0
            },
            message: response.data.message
        };
    } catch (error) {
        console.error('Vote error:', error);

        if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
                return {
                    status: 'error',
                    error: VoteError.NOT_AUTHENTICATED
                };
            }

            if (error.response?.status === 409) {
                return {
                    status: 'error',
                    error: VoteError.ALREADY_VOTED
                };
            }

            if (error.response?.status === 404) {
                return {
                    status: 'error',
                    error: VoteError.MODULE_NOT_FOUND
                };
            }
        }

        return {
            status: 'error',
            error: VoteError.UNKNOWN_ERROR
        };
    }
};

// Išplečiame AxiosInstance tipą
declare module 'axios' {
    interface AxiosInstance {
        addVote(moduleRequestId: number): Promise<VoteResponse>;
        register(data: RegisterData): Promise<ApiResponse>;
        login(email: string, password: string): Promise<ApiResponse>;
        validateToken(): Promise<ApiResponse>;
        refreshToken(refreshToken: string): Promise<ApiResponse>;
        logout(): Promise<ApiResponse>;
        deleteAccount(): Promise<ApiResponse>;
        listRequests(): Promise<ApiResponse>;
        createRequest(data: { module_name: string; description: string; language: string; tags: string[]; }): Promise<ApiResponse>;
    }
}

export default api;
