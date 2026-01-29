import axios from 'axios';
import { UserRole, UserStatus } from '../types/User';
import type { User } from '../types/User';
import api from './authApi'; // Use authenticated API instance

type DatabaseMode = 'mock' | 'real';

// Helper function to assign default roles to API users (for JSONPlaceholder)
const getDefaultRole = (userId: number): UserRole => {
  // Assign roles based on user ID for demo purposes
  if (userId === 1) return UserRole.ADMIN;
  if (userId <= 3) return UserRole.MANAGER;
  return UserRole.USER;
};

// Helper function to assign default status to API users (for JSONPlaceholder)
const getDefaultStatus = (userId: number): UserStatus => {
  // Most users are active, some inactive for demo purposes (every 7th user inactive)
  return userId % 7 === 0 ? UserStatus.INACTIVE : UserStatus.ACTIVE;
};

// Helper function to generate random birth dates (for JSONPlaceholder)
const getRandomBirthDate = (): string => {
  const start = new Date(2000, 1, 1);
  const end = new Date(2025, 12, 31);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const day = randomDate.getDate().toString().padStart(2, '0');
  const month = (randomDate.getMonth() + 1).toString().padStart(2, '0');
  const year = randomDate.getFullYear();
  return `${day}/${month}/${year}`;
};

const PAGE_SIZE = 4; // Used for JSONPlaceholder pagination

// API configuration based on mode
const getApiConfig = (mode: DatabaseMode) => {
  if (mode === 'mock') {
    return {
      baseURL: 'https://jsonplaceholder.typicode.com',
      endpoint: '/users',
      transform: true
    };
  } else {
    return {
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
      endpoint: '/api/users',
      transform: false
    };
  }
};

export const getUsers = async (page = 1, mode: DatabaseMode = 'real') => {
  const config = getApiConfig(mode);
  
  if (mode === 'mock') {
    const mockApi = axios.create({
      baseURL: config.baseURL,
      timeout: 5000
    });
    
    // JSONPlaceholder version
    const res = await mockApi.get(config.endpoint);
    // Map API users and assign default roles and birth dates
    const allUsers = res.data.map((u: any) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      avatar: `https://i.pravatar.cc/150?u=${u.id}`,
      role: getDefaultRole(u.id),
      birthDate: getRandomBirthDate(),
      phone: undefined,
      status: getDefaultStatus(u.id)
    }));

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const paginated = allUsers.slice(start, end);

    const hasMore = end < allUsers.length;

    return { data: paginated, hasMore };
  } else {
    // Real backend version - use authenticated API
    const res = await api.get(config.endpoint, { params: { page } });
    return res.data;
  }
};

// Create user - only works in real backend mode
export const createUser = async (userData: Omit<User, 'id'>, mode: DatabaseMode = 'real') => {
  if (mode === 'mock') {
    throw new Error('Create user not supported in mock mode');
  }
  
  const res = await api.post('/api/users', userData);
  return res.data;
};

// Update user - only works in real backend mode
export const updateUser = async (id: number, userData: Partial<User>, mode: DatabaseMode = 'real') => {
  if (mode === 'mock') {
    throw new Error('Update user not supported in mock mode');
  }
  
  const res = await api.put(`/api/users/${id}`, userData);
  return res.data;
};

// Delete user - only works in real backend mode
export const deleteUser = async (id: number, mode: DatabaseMode = 'real') => {
  if (mode === 'mock') {
    throw new Error('Delete user not supported in mock mode');
  }
  
  const res = await api.delete(`/api/users/${id}`);
  return res.data;
};