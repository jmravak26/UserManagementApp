# Real Backend Enhancement Plan

## Goal
Upgrade the "Real Backend" mode to use:
- **Real Database** (SQLite/PostgreSQL) 
- **JWT Authentication** with password hashing
- **Persistent data** that survives server restarts

## Implementation Phases

### Phase 1: Database Integration
**Add SQLite database (easy local setup)**

#### Backend Changes:
```bash
cd backend
npm install prisma @prisma/client sqlite3
npx prisma init --datasource-provider sqlite
```

#### Files to Create/Modify:
- `prisma/schema.prisma` - Database schema
- `src/config/database.ts` - Database connection
- `src/services/userService.ts` - Database operations
- Replace `mockUsers.ts` with real database queries

#### Features:
- ✅ Persistent user data
- ✅ Real CRUD operations
- ✅ Data survives server restart
- ✅ Database migrations

### Phase 2: JWT Authentication
**Add real login system with password hashing**

#### Backend Changes:
```bash
npm install bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

#### Files to Create/Modify:
- `src/controllers/authController.ts` - Login/register logic
- `src/middleware/auth.ts` - JWT verification
- `src/routes/authRoutes.ts` - Auth endpoints
- `src/utils/jwt.ts` - JWT helpers
- Add password field to User model

#### Features:
- ✅ Real user registration
- ✅ Password hashing (bcrypt)
- ✅ JWT token generation
- ✅ Protected routes
- ✅ Role-based access control

### Phase 3: Frontend Integration
**Update frontend to handle real authentication**

#### Frontend Changes:
- Update login form to handle real auth
- Add registration form
- Store JWT tokens properly
- Handle auth errors
- Add token refresh logic

#### Features:
- ✅ Real login/logout
- ✅ User registration
- ✅ Token-based authentication
- ✅ Automatic token refresh

## Database Schema Design

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  username  String   @unique
  email     String   @unique
  password  String   // Hashed with bcrypt
  avatar    String?
  birthDate String
  phone     String?
  role      Role     @default(USER)
  status    Status   @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

## API Endpoints to Add

### Authentication:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Protected User Routes:
- `GET /api/users` - Get users (requires auth)
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user (own profile or admin)
- `DELETE /api/users/:id` - Delete user (admin only)

## Environment Variables to Add

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Bcrypt
BCRYPT_ROUNDS=12
```

## Development Workflow

### Current State:
```
Mock Mode: JSONPlaceholder (demos)
Real Mode: In-memory data (development)
```

### After Implementation:
```
Mock Mode: JSONPlaceholder (demos)
Real Mode: SQLite + JWT (full-stack development)
```

## Benefits

### For Learning:
- ✅ Real database experience
- ✅ Authentication implementation
- ✅ Security best practices
- ✅ Full-stack integration

### For Portfolio:
- ✅ Shows database skills
- ✅ Demonstrates security knowledge
- ✅ Production-ready patterns
- ✅ Complete full-stack app

### For Development:
- ✅ Persistent data during development
- ✅ Real user management
- ✅ Test authentication flows
- ✅ Role-based features

## Next Steps

1. **Phase 1**: Implement SQLite database
2. **Phase 2**: Add JWT authentication
3. **Phase 3**: Update frontend integration
4. **Phase 4**: Add advanced features (password reset, email verification)

---

This will make your "Real Backend" mode a truly production-ready full-stack application! 🚀