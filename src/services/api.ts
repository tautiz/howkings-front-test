import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://bos.howkings.local';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await refresh();
                const newToken = data.access_token;
                localStorage.setItem('token', newToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                processQueue(null, newToken);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('token');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

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

export const login = (data: { email: string; password: string }) => 
    api.post('/api/login', data);

export const logout = () => api.post('/api/logout');

export const refresh = () => api.post('/api/refresh');

export const getCurrentUser = () => api.get('/api/me');

// Request pool endpoints
export const listRequests = () => api.get('/api/requests');

export const createRequest = (data: {
    title: string;
    description: string;
    module_id: number;
}) => api.post('/api/requests', data);

export const addVote = (requestId: number) => 
    api.post(`/api/vote`, { request_id: requestId });

export default api;
