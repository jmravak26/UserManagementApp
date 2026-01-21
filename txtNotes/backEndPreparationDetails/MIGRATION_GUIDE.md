# Frontend/Backend Separation Migration Guide

## Current Status ✅

The project is now **backend-ready** with the following changes:

### 1. Environment Variables
- ✅ `.env` - Current configuration (uses jsonplaceholder for now)
- ✅ `.env.example` - Template for future backend URL
- ✅ `.gitignore` - Updated to exclude .env files

### 2. API Configuration
- ✅ `src/api/usersApi.ts` - Now uses `VITE_API_BASE_URL` from environment
- ✅ Easy to switch between mock API and real backend

### 3. Documentation
- ✅ `API_DOCUMENTATION.md` - Complete API contract for backend
- ✅ `BACKEND_GUIDE.md` - Step-by-step backend setup guide

---

## How to Use

### Current Setup (Mock API)
```bash
# .env file
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com

npm run dev
```

### Future Setup (Real Backend)
```bash
# .env file
VITE_API_BASE_URL=http://localhost:3000/api

# Start backend (in separate terminal)
cd backend
npm run dev

# Start frontend
npm run dev
```

---

## Option 1: Keep Current Structure (Recommended for Now)

**Pros:**
- No file moving required
- Works immediately
- Easy to maintain
- Can add backend later in separate folder

**Structure:**
```
user-management-app/          # Frontend (current)
├── src/
├── public/
├── .env
└── package.json

backend/                       # Future backend (separate folder)
├── src/
├── prisma/
└── package.json
```

**When to implement backend:**
1. Create `backend/` folder at same level as `user-management-app/`
2. Follow `BACKEND_GUIDE.md`
3. Update `.env` to point to `http://localhost:3000/api`
4. Backend implements endpoints from `API_DOCUMENTATION.md`

---

## Option 2: Monorepo Structure (Advanced)

**Pros:**
- Single repository
- Shared TypeScript types
- Unified version control

**Cons:**
- More complex setup
- Requires workspace configuration

**Structure:**
```
user-management-system/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── shared/
│   └── types/              # Shared TypeScript types
│
├── package.json            # Root package.json with workspaces
└── README.md
```

**Setup:**
```json
// Root package.json
{
  "name": "user-management-system",
  "private": true,
  "workspaces": [
    "frontend",
    "backend",
    "shared"
  ],
  "scripts": {
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev:backend": "npm run dev --workspace=backend",
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\""
  }
}
```

---

## Migration Steps (If You Want Monorepo)

### 1. Create New Structure
```bash
# Create root folder
mkdir user-management-system
cd user-management-system

# Move current project to frontend
mv ../user-management-app ./frontend

# Create backend folder
mkdir backend
mkdir shared
```

### 2. Set Up Root Package.json
```bash
npm init -y
npm install -D concurrently
```

### 3. Update Frontend .env
```bash
cd frontend
# Update .env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. Initialize Backend
```bash
cd ../backend
# Follow BACKEND_GUIDE.md
```

### 5. Create Shared Types (Optional)
```bash
cd ../shared
npm init -y
# Copy types from frontend/src/types/
```

---

## Recommended Approach

**For Now:** Keep current structure (Option 1)
- ✅ No disruption
- ✅ Backend can be added anytime
- ✅ All preparation done

**Later:** When backend is ready
- Create `backend/` folder separately
- Follow `BACKEND_GUIDE.md`
- Update `.env` to point to backend
- Test integration

**Future:** Consider monorepo (Option 2)
- When project grows
- When you need shared types
- When multiple developers work on it

---

## Testing Backend Integration

### 1. Start Backend
```bash
cd backend
npm run dev
# Backend runs on http://localhost:3000
```

### 2. Update Frontend .env
```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Start Frontend
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Verify Connection
- Login should call `POST http://localhost:3000/api/auth/login`
- Users list should call `GET http://localhost:3000/api/users`
- Check browser Network tab for API calls

---

## Troubleshooting

### CORS Errors
Backend needs CORS configuration:
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Environment Variables Not Loading
- Restart dev server after changing `.env`
- Vite requires `VITE_` prefix for env vars
- Check `import.meta.env.VITE_API_BASE_URL`

### API Calls Failing
- Verify backend is running
- Check backend URL in `.env`
- Inspect Network tab in browser DevTools
- Check backend logs for errors

---

## Next Steps

1. ✅ **Done:** Environment variables configured
2. ✅ **Done:** API documentation created
3. ✅ **Done:** Backend guide written
4. ⏳ **Future:** Implement backend following `BACKEND_GUIDE.md`
5. ⏳ **Future:** Test integration
6. ⏳ **Future:** Deploy both frontend and backend

---

## Summary

Your frontend is now **100% ready** for backend integration:
- Environment variables configured
- API layer abstracted
- Documentation complete
- No code changes needed when backend is ready

Just update `.env` and the frontend will automatically connect to your backend! 🚀
