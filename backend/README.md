# User Management Backend API

Node.js + Express + TypeScript backend with SQLite database and JWT authentication.

## 🚀 Live API

**Production**: [https://usermanagementapp-production.up.railway.app](https://usermanagementapp-production.up.railway.app)

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3001`

## 🔧 Environment Setup

Copy `.env.example` to `.env` (optional - works with defaults):
```bash
cp .env.example .env
```

**Default Configuration:**
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL="file:./database.db"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## 📊 Database

- **Type**: SQLite
- **File**: `database.db` (auto-created)
- **Auto-seeded**: 10 mock users on first run
- **Schema**: Users table with authentication support

### Default Users
- **Admin**: `admin@demo.com` / `admin123`
- **Manager**: `manager@demo.com` / `manager123`
- **User**: `user@demo.com` / `user123`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | User registration | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users?page=1&limit=10` | Get users (paginated) | Yes |
| GET | `/api/users/:id` | Get single user | Yes |
| POST | `/api/users` | Create user | Yes (Admin) |
| PUT | `/api/users/:id` | Update user | Yes |
| DELETE | `/api/users/:id` | Delete user | Yes (Admin) |

### System
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |
| GET | `/api/database` | Database viewer (dev only) | No |
| GET | `/` | API information | No |

## 🔐 Authentication

- **Method**: JWT (JSON Web Tokens)
- **Header**: `Authorization: Bearer <token>`
- **Expiration**: 24 hours
- **Password Hashing**: bcryptjs

## 🛠️ Scripts

- `npm run dev` - Development server with hot reload (nodemon)
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run postinstall` - Auto-build after install (for deployment)

## 📁 Project Structure

```
backend/
├── src/
│   ├── middleware/
│   │   └── auth.ts          # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.ts    # Authentication endpoints
│   │   └── userRoutes.ts    # User CRUD endpoints
│   ├── services/
│   │   └── database.ts      # SQLite database service
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   └── server.ts            # Express server setup
├── prisma/
│   └── schema.prisma        # Prisma schema (unused, for future)
├── .env                     # Environment variables
├── railway.json             # Railway deployment config
├── package.json
└── tsconfig.json
```

## 🚀 Deployment

### Railway (Current)
- **Auto-deployment**: Triggered on push to `main` branch
- **Build**: `npm run build`
- **Start**: `npm start`
- **Health Check**: `/health` endpoint

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite3
- **Authentication**: JWT + bcryptjs
- **CORS**: Enabled for cross-origin requests
- **Development**: nodemon + ts-node

## 📊 CORS Configuration

Configured to allow requests from:
- `http://localhost:5173` (development frontend)
- `https://react-usr-mgmt-app.web.app` (production frontend)

## 🔍 Development

### Database Viewer
Visit `http://localhost:3001/api/database` to view all users in the database (development only).

### Adding New Endpoints
1. Create route in `src/routes/`
2. Add middleware if needed in `src/middleware/`
3. Update database service in `src/services/database.ts`
4. Add types in `src/types/index.ts`

### Environment Variables
- Development uses `.env` file
- Production uses Railway environment variables
- All variables have sensible defaults