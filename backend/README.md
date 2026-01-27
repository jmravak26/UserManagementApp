# User Management Backend API

Node.js + Express + TypeScript backend with SQLite database for the User Management Application.

## Quick Start

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3001`

## Environment Setup (Optional)

The app works with default values. To customize, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default values:
```
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL="file:./database.db"
```

## Database

- **Type**: SQLite
- **File**: `database.db`
- **Auto-seeded**: 10 mock users on first run
- **Schema**: Users table with pagination support

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/users?page=1` | Get users (paginated) |
| GET | `/api/users/:id` | Get single user |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## Scripts

- `npm run dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build

## Tech Stack

- Node.js + Express.js
- TypeScript
- SQLite3
- CORS enabled
- Auto-seeding with mock data