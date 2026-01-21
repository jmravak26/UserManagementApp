import { User, UserRole, UserStatus } from '../types';

// Mock data - simulating a database
export let users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?u=1',
    role: UserRole.ADMIN,
    birthDate: '15/03/1990',
    phone: '+1234567890',
    status: UserStatus.ACTIVE
  },
  {
    id: 2,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?u=2',
    role: UserRole.MANAGER,
    birthDate: '22/07/1985',
    phone: '+1234567891',
    status: UserStatus.ACTIVE
  },
  {
    id: 3,
    name: 'Bob Johnson',
    username: 'bobjohnson',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?u=3',
    role: UserRole.USER,
    birthDate: '10/12/1992',
    phone: '+1234567892',
    status: UserStatus.INACTIVE
  },
  {
    id: 4,
    name: 'Alice Brown',
    username: 'alicebrown',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?u=4',
    role: UserRole.USER,
    birthDate: '05/09/1988',
    phone: '+1234567893',
    status: UserStatus.ACTIVE
  },
  {
    id: 5,
    name: 'Michael Chen',
    username: 'mchen',
    email: 'michael.chen@example.com',
    avatar: 'https://i.pravatar.cc/150?u=5',
    role: UserRole.MANAGER,
    birthDate: '18/11/1987',
    phone: '+1234567894',
    status: UserStatus.ACTIVE
  },
  {
    id: 6,
    name: 'Sarah Wilson',
    username: 'swilson',
    email: 'sarah.wilson@example.com',
    avatar: 'https://i.pravatar.cc/150?u=6',
    role: UserRole.USER,
    birthDate: '03/06/1993',
    phone: '+1234567895',
    status: UserStatus.ACTIVE
  },
  {
    id: 7,
    name: 'David Martinez',
    username: 'dmartinez',
    email: 'david.martinez@example.com',
    avatar: 'https://i.pravatar.cc/150?u=7',
    role: UserRole.USER,
    birthDate: '27/02/1991',
    phone: '+1234567896',
    status: UserStatus.INACTIVE
  },
  {
    id: 8,
    name: 'Emily Davis',
    username: 'edavis',
    email: 'emily.davis@example.com',
    avatar: 'https://i.pravatar.cc/150?u=8',
    role: UserRole.ADMIN,
    birthDate: '14/08/1986',
    phone: '+1234567897',
    status: UserStatus.ACTIVE
  },
  {
    id: 9,
    name: 'James Taylor',
    username: 'jtaylor',
    email: 'james.taylor@example.com',
    avatar: 'https://i.pravatar.cc/150?u=9',
    role: UserRole.USER,
    birthDate: '09/04/1994',
    phone: '+1234567898',
    status: UserStatus.ACTIVE
  },
  {
    id: 10,
    name: 'Lisa Anderson',
    username: 'landerson',
    email: 'lisa.anderson@example.com',
    avatar: 'https://i.pravatar.cc/150?u=10',
    role: UserRole.MANAGER,
    birthDate: '21/01/1989',
    phone: '+1234567899',
    status: UserStatus.INACTIVE
  }
];

// Helper function to get next ID
export const getNextId = (): number => {
  return Math.max(...users.map(u => u.id)) + 1;
};