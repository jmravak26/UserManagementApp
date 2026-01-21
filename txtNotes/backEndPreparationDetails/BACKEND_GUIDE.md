# Backend Implementation Guide

## Overview
This guide helps you set up a backend for the User Management App.

---

## Recommended Tech Stack

### Option 1: Node.js + Express + TypeScript (Recommended)
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL or MongoDB
- **ORM:** Prisma (PostgreSQL) or Mongoose (MongoDB)
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod or Joi

### Option 2: Python + FastAPI
- **Runtime:** Python 3.10+
- **Framework:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT

### Option 3: Java + Spring Boot
- **Runtime:** Java 17+
- **Framework:** Spring Boot
- **Database:** PostgreSQL
- **ORM:** JPA/Hibernate
- **Authentication:** Spring Security + JWT

---

## Project Structure (Node.js + Express + TypeScript)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database connection
│   │   └── env.ts                # Environment variables
│   │
│   ├── controllers/
│   │   ├── authController.ts     # Login, register
│   │   ├── userController.ts     # User CRUD
│   │   └── messageController.ts  # Email/messages
│   │
│   ├── middleware/
│   │   ├── auth.ts               # JWT verification
│   │   ├── errorHandler.ts       # Global error handling
│   │   ├── validation.ts         # Request validation
│   │   └── rbac.ts               # Role-based access control
│   │
│   ├── models/
│   │   ├── User.ts               # User model
│   │   └── Message.ts            # Message model
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── messageRoutes.ts
│   │
│   ├── services/
│   │   ├── userService.ts        # Business logic
│   │   ├── authService.ts
│   │   └── emailService.ts
│   │
│   ├── types/
│   │   └── index.ts              # Shared TypeScript types
│   │
│   ├── utils/
│   │   ├── jwt.ts                # JWT helpers
│   │   └── validators.ts         # Custom validators
│   │
│   ├── app.ts                    # Express app setup
│   └── server.ts                 # Server entry point
│
├── prisma/                       # If using Prisma
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Quick Start (Node.js + Express + TypeScript)

### 1. Initialize Project

```bash
mkdir backend
cd backend
npm init -y
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install express cors dotenv
npm install jsonwebtoken bcryptjs
npm install prisma @prisma/client  # or mongoose for MongoDB

# TypeScript dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/cors @types/jsonwebtoken @types/bcryptjs
npm install -D ts-node nodemon

# Validation
npm install zod

# Additional utilities
npm install helmet express-rate-limit
```

### 3. TypeScript Configuration

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

### 5. Environment Variables

Create `.env`:
```env
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/usermanagement

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## Database Schema (Prisma Example)

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  username  String   @unique
  email     String   @unique
  password  String
  avatar    String?
  birthDate String
  phone     String?
  role      Role     @default(USER)
  status    Status   @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sentMessages     Message[] @relation("sender")
  receivedMessages Message[] @relation("recipients")

  @@index([email])
  @@index([username])
}

enum Role {
  ADMIN
  MANAGER
  USER
}

enum Status {
  ACTIVE
  INACTIVE
}

model Message {
  id        String   @id @default(uuid())
  subject   String
  body      String
  template  String?
  sentAt    DateTime @default(now())
  
  senderId  Int
  sender    User     @relation("sender", fields: [senderId], references: [id])
  
  recipients User[]  @relation("recipients")

  @@index([senderId])
}
```

---

## Minimal Server Setup

### src/server.ts
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes (to be implemented)
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/messages', messageRoutes);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## Authentication Middleware Example

### src/middleware/auth.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  role: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

---

## Next Steps

1. **Set up database** - Install PostgreSQL/MongoDB
2. **Run migrations** - `npm run prisma:migrate`
3. **Implement controllers** - Start with auth, then users
4. **Add validation** - Use Zod for request validation
5. **Write tests** - Unit and integration tests
6. **Add logging** - Winston or Pino
7. **Deploy** - Heroku, AWS, or DigitalOcean

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Logging implemented
- [ ] Error handling tested
- [ ] Security headers (helmet)
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Monitoring set up (e.g., Sentry)

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT Best Practices](https://jwt.io/introduction)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
