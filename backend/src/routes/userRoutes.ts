import { Router, Request, Response } from 'express';
import { dbService } from '../services/database';
import { CreateUserRequest, UpdateUserRequest, UserStatus, UserRole, User } from '../types';

const router = Router();

// GET /api/users - Get all users with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 4; // Match your frontend PAGE_SIZE
    
    const result = await dbService.getUsers(page, pageSize);
    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const user = await dbService.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/users - Create new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const userData: CreateUserRequest = req.body;
    
    // Basic validation
    if (!userData.name || !userData.username || !userData.email) {
      return res.status(400).json({ error: 'Name, username, and email are required' });
    }
    
    const newUser = {
      name: userData.name,
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`,
      role: userData.role || UserRole.USER,
      birthDate: userData.birthDate,
      phone: userData.phone,
      status: UserStatus.ACTIVE
    };
    
    const createdUser = await dbService.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const updateData: UpdateUserRequest = req.body;
    
    const updatedUser = await dbService.updateUser(id, updateData);
    res.json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error.message === 'User not found') {
      res.status(404).json({ error: 'User not found' });
    } else if (error.message && error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const deletedUser = await dbService.deleteUser(id);
    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    if (error.message === 'User not found') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
});

export default router;