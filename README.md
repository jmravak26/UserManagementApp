# User Management Application

A full-stack user management system built with React frontend and Node.js backend API.

## 🚀 Live Demo

- **Frontend**: [https://react-usr-mgmt-app.web.app](https://react-usr-mgmt-app.web.app)
- **Backend API**: [https://usermanagementapp-production.up.railway.app](https://usermanagementapp-production.up.railway.app)

## 📁 Project Structure

```
managementApp/
├── user-management-app/    # React frontend (Vite + TypeScript)
├── backend/               # Node.js + Express + TypeScript API
├── txtNotes/              # Project documentation and guides
├── .github/workflows/     # GitHub Actions for Firebase deployment
└── README.md             # This file
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Forms**: Formik + Yup validation
- **HTTP Client**: Axios
- **Styling**: CSS3 with responsive design
- **Deployment**: Firebase Hosting

### Backend
- **Runtime**: Node.js + Express.js + TypeScript
- **Database**: SQLite with auto-seeding
- **Authentication**: JWT tokens
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for cross-origin requests
- **Deployment**: Railway

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd managementApp
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Server runs on `http://localhost:3001`

### 3. Frontend Setup
```bash
cd user-management-app
npm install
npm run dev
```
App runs on `http://localhost:5173`

## 🔧 Environment Configuration

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001
```

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL="file:./database.db"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## 🎯 Features

### Core Features
- **Authentication**: JWT-based login/register system
- **User Management**: Full CRUD operations with pagination
- **Role-based Access**: Admin, Manager, User permissions
- **Real-time Search**: Instant user filtering
- **Responsive Design**: Mobile-first approach

### Advanced Features
- **Bulk Operations**: Multi-select, bulk delete, role changes
- **Data Export/Import**: CSV import/export functionality
- **Advanced Filtering**: Role, status, date range filters with presets
- **Communication**: Email users, message history tracking
- **Analytics Dashboard**: User statistics and insights
- **Database Mode Toggle**: Switch between real backend and mock data

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users?page=1&limit=10` - Get users (paginated)
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### System
- `GET /health` - Health check
- `GET /api/database` - Database viewer (development)

## 🚀 Deployment

### Frontend (Firebase Hosting)
- **Auto-deployment**: Triggered on push to `main` branch
- **Build Command**: `npm run build`
- **GitHub Actions**: Configured in `.github/workflows/`

### Backend (Railway)
- **Auto-deployment**: Triggered on push to `main` branch
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Configuration**: `railway.json`

## 🔄 Database Mode Switching

The application supports two data sources:

- **Real Backend**: Local/deployed Node.js API with SQLite database
- **Mock Database**: JSONPlaceholder API for demo purposes

Switch between modes on the login page. Your choice persists across sessions.

## 📚 Documentation

Detailed documentation available in `txtNotes/`:
- **Backend Setup**: `backEndPreparationDetails/BACKEND_GUIDE.md`
- **API Documentation**: `backEndPreparationDetails/API_DOCUMENTATION.md`
- **Migration Guide**: `backEndPreparationDetails/MIGRATION_GUIDE.md`
- **Feature Implementations**: `featureImprovementsDetails/`

## 🧪 Development

### Running Both Services
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd user-management-app && npm run dev
```

### Build for Production
```bash
# Frontend
cd user-management-app && npm run build

# Backend
cd backend && npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.