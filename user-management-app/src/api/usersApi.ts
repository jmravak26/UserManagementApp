import axios from 'axios';
import { UserRole, UserStatus } from '../types/User';

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
  
  const api = axios.create({
    baseURL: config.baseURL,
    timeout: 5000
  });

  if (mode === 'mock') {
    // JSONPlaceholder version
    const res = await api.get(config.endpoint);
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
    // Real backend version
    const res = await api.get(config.endpoint, { params: { page } });
    return res.data;
  }
};