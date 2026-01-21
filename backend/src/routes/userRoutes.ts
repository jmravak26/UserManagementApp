import { Router, Request, Response } from 'express';
import { users, getNextId } from '../data/mockUsers';
import { CreateUserRequest, UpdateUserRequest, UserStatus, UserRole, User } from '../types';

const router = Router();

// GET /api/users - Get all users with pagination
router.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 4; // Match your frontend PAGE_SIZE
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const paginatedUsers = users.slice(startIndex, endIndex);
  const hasMore = endIndex < users.length;
  
  res.json({
    data: paginatedUsers,
    hasMore,
    total: users.length,
    page,
    pageSize
  });
});

// GET /api/users/:id - Get single user
router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// POST /api/users - Create new user
router.post('/', (req: Request, res: Response) => {
  const userData: CreateUserRequest = req.body;
  
  // Basic validation
  if (!userData.name || !userData.username || !userData.email) {
    return res.status(400).json({ error: 'Name, username, and email are required' });
  }
  
  // Check if username or email already exists
  const existingUser = users.find(u => 
    u.username === userData.username || u.email === userData.email
  );
  
  if (existingUser) {
    return res.status(400).json({ error: 'Username or email already exists' });
  }
  
  const newUser: User = {
    id: getNextId(),
    name: userData.name,
    username: userData.username,
    email: userData.email,
    avatar: `https://i.pravatar.cc/150?u=${getNextId()}`,
    role: userData.role || UserRole.USER,
    birthDate: userData.birthDate,
    phone: userData.phone,
    status: UserStatus.ACTIVE
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /api/users/:id - Update user
router.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const updateData: UpdateUserRequest = req.body;
  
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Update user data
  users[userIndex] = { ...users[userIndex], ...updateData };
  
  res.json(users[userIndex]);
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  res.json({ message: 'User deleted successfully', user: deletedUser });
});

export default router;