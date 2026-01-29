export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  USER = 'User'
}

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password?: string; // Optional for responses (excluded for security)
  avatar?: string;
  role: UserRole;
  birthDate: string;
  phone?: string;
  status: UserStatus;
}

export interface CreateUserRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  birthDate: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  username?: string;
  email?: string;
  avatar?: string;
  birthDate?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

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
  user: Omit<User, 'password'>;
}