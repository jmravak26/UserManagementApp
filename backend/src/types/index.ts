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
  birthDate: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  username?: string;
  email?: string;
  birthDate?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}