import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Debug logging
console.log('🔧 API_BASE_URL:', API_BASE_URL);
console.log('🔧 Environment:', import.meta.env.MODE);
console.log('🔧 All env vars:', import.meta.env);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  birthDate: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    avatar?: string;
    birthDate: string;
    phone?: string;
    status: string;
  };
}

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  console.log('🚀 Attempting login to:', API_BASE_URL + '/api/auth/login');
  console.log('📝 Credentials:', { email: credentials.email, password: '***' });
  
  try {
    const response = await api.post('/api/auth/login', credentials);
    console.log('✅ Login successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Login failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    throw error;
  }
};

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export default api;