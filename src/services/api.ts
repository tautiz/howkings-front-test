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

export const getCurrentUser = () => api.get('/api/user');

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
