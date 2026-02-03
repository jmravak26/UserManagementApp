import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { dbService } from './services/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parse JSON bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'User Management Backend is running!' 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'User Management API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      database: '/api/database'
    }
  });
});

// Database viewer endpoint (for development/debugging)
app.get('/api/database', async (req, res) => {
  try {
    const users = await dbService.getUsers(1, 100); // Get first 100 users
    res.json({
      message: 'Database Contents',
      totalUsers: users.total,
      users: users.data
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch database contents' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔄 Initializing SQLite database...');
    await dbService.initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    app.listen(PORT, () => {
      const isProduction = process.env.NODE_ENV === 'production';
      const baseUrl = isProduction 
        ? 'https://usermanagementapp-production.up.railway.app'
        : `http://localhost:${PORT}`;
      
      console.log(`🚀 Server running on ${baseUrl}`);
      console.log(`📋 Health check: ${baseUrl}/health`);
      console.log(`👥 Users API: ${baseUrl}/api/users`);
      console.log(`🗄 Database viewer: ${baseUrl}/api/database`);
      console.log(`🗄 Database: SQLite (database.db)`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await dbService.disconnect();
  process.exit(0);
});

startServer();