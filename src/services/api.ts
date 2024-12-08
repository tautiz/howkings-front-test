import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://bos.howkings.local';

export interface PendingRequest {
    method: string;
    url: string;
    data?: any;
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
    async (error: AxiosError) => {
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
export const register = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}) => api.post('/api/register', data);

export const login = async (data: { email: string; password: string }) => {
    const response = await api.post('/api/login', data);
    const { access_token } = response.data;
    
    if (access_token) {
        localStorage.setItem('access_token', access_token);
        
        // Dispatch login success event
        window.dispatchEvent(new CustomEvent('auth:login-success'));
    }
    
    return response;
};

export const logout = async () => {
    try {
        await api.post('/api/logout');
    } finally {
        localStorage.removeItem('access_token');
    }
};

// Request pool endpoints
export const listRequests = () => api.get('/api/module-requests');

export const createRequest = (data: {
    module_name: string;
    description: string;
    language: string;
    tags: string[];
  }) => api.post('/api/module-requests', data);

export const addVote = (moduleRequestId: number) => 
    api.post(`/api/module-requests/vote`, { 
        module_request_id: moduleRequestId,
        language: 'EN'
    });

export default api;
