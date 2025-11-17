// Define available user roles for role-based access control
export const UserRole = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  USER: 'User'
} as const;

// Create type from the const object
export type UserRole = typeof UserRole[keyof typeof UserRole];

// Define user status for activity tracking
export const UserStatus = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  avatar: string;
  birthDate: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
}
