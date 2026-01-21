# User Management Application

A full-stack user management system built with React frontend and Node.js backend API.

## Project Structure

```
managementApp/
├── user-management-app/    # React frontend application
├── backend/               # Node.js + Express + TypeScript API
├── txtNotes/              # Project documentation and guides
└── README.md             # This file
```

## Getting Started

### Frontend (React App)
```bash
cd user-management-app
npm install
npm run dev
```

### Backend (Node.js API)
```bash
cd backend
npm install
npm run dev
```

## Database Mode Switching

The application supports two data sources:

- **Real Backend**: Local Node.js API with mock data (http://localhost:3001)
- **Mock Database**: JSONPlaceholder API for demo purposes

Switch between modes on the login page. Your choice is saved and persists across sessions.

## Features

- **User Management**: CRUD operations with pagination
- **Role-based Access**: Admin, Manager, User permissions
- **Bulk Operations**: Multi-select, bulk delete, role changes
- **Data Export/Import**: CSV import/export functionality
- **Advanced Filtering**: Role, status, date range filters with presets
- **Communication**: Email users, message history
- **Analytics Dashboard**: User statistics and insights
- **Database Mode Toggle**: Switch between real backend and mock data

## API Endpoints

### Backend Server (http://localhost:3001)
- `GET /` - API information
- `GET /health` - Health check
- `GET /api/users?page=1` - Get users with pagination
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Development

### Running Both Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd user-management-app
npm run dev
```

### Environment Variables

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:3001
```

**Backend (.env)**
```
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## Technology Stack

### Frontend
- React 18 + TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Formik + Yup for forms
- CSS3 with responsive design

### Backend
- Node.js + Express.js
- TypeScript
- In-memory data storage (mock users)
- CORS enabled
- RESTful API design

## Deployment

- **Frontend**: Firebase Hosting
- **Backend**: Ready for deployment (Heroku, AWS, etc.)