import axios from 'axios';
import { UserRole, UserStatus } from '../types/User';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000
});

// Helper function to assign default roles to API users
const getDefaultRole = (userId: number): UserRole => {
  // Assign roles based on user ID for demo purposes
  if (userId === 1) return UserRole.ADMIN;
  if (userId <= 3) return UserRole.MANAGER;
  return UserRole.USER;
};

// Helper function to assign default status to API users
const getDefaultStatus = (userId: number): UserStatus => {
  // Most users are active, some inactive for demo purposes (every 7th user inactive)
  return userId % 7 === 0 ? UserStatus.INACTIVE : UserStatus.ACTIVE;
};

// Helper function to generate random birth dates
const getRandomBirthDate = (): string => {
  const start = new Date(1970, 0, 1);
  const end = new Date(2000, 11, 31);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const day = randomDate.getDate().toString().padStart(2, '0');
  const month = (randomDate.getMonth() + 1).toString().padStart(2, '0');
  const year = randomDate.getFullYear();
  return `${day}/${month}/${year}`;
};

const PAGE_SIZE = 4;

export const getUsers = async (page = 1) => {
  const res = await api.get('/users');
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
};