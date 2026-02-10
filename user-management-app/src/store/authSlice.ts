import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register, getCurrentUser } from '../api/authApi';
import type { LoginRequest, RegisterRequest } from '../api/authApi';
import { UserRole } from '../types/User';

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest) => {
    const response = await login(credentials);
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    return response;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const loadStoredAuth = createAsyncThunk(
  'auth/loadStored',
  async () => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    
    if (token && storedUser) {
      const user = JSON.parse(storedUser);
      
      // If it's a mock token, don't validate with backend
      if (token.startsWith('mock-token-')) {
        return {
          token,
          user
        };
      }
      
      // For real tokens, validate with backend
      try {
        const currentUser = await getCurrentUser();
        return {
          token,
          user: currentUser
        };
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        throw error;
      }
    }
    throw new Error('No stored auth');
  }
);

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  userRole: UserRole | null;
  user: any | null;
  isAuthenticated: boolean;
}

const savedAuth = localStorage.getItem('authToken');
const savedUser = localStorage.getItem('currentUser');
const initialState: AuthState = {
  token: savedAuth || null,
  loading: false,
  error: null,
  userRole: savedUser ? JSON.parse(savedUser).role : null,
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedAuth,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.userRole = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userRole'); // Legacy cleanup
      localStorage.removeItem('addedLocalUsers');
    },
    clearError(state) {
      state.error = null;
    },
    mockLogin(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userRole = action.payload.user.role as UserRole;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userRole = action.payload.user.role as UserRole;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Login failed';
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userRole = action.payload.user.role as UserRole;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = typeof action.payload === 'string' ? action.payload : (action.error.message || 'Registration failed');
    });

    // Load stored auth
    builder.addCase(loadStoredAuth.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userRole = action.payload.user.role as UserRole;
    });
  }
});

export const { logout, clearError, mockLogin } = authSlice.actions;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export default authSlice.reducer;