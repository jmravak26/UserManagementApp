import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '../types/User';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  userRole: UserRole | null;
}

// Ensures that we are kept on the same page after page refresh
const savedAuth = localStorage.getItem('authToken');
const savedRole = localStorage.getItem('userRole');
const initialState: AuthState = {
  token: savedAuth ? JSON.parse(savedAuth) : null,
  loading: false,
  error: null,
  userRole: savedRole ? JSON.parse(savedRole) : null,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ token: string; role?: UserRole }>) {
      state.loading = false;
      state.token = action.payload.token;
      state.userRole = action.payload.role || UserRole.USER; // Default to USER role
      localStorage.setItem('authToken', JSON.stringify(action.payload.token)); // Save token
      localStorage.setItem('userRole', JSON.stringify(state.userRole)); // Save user role
    },
    loginFail(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.userRole = null;
      localStorage.removeItem('authToken'); // Clean up token after logout
      localStorage.removeItem('userRole'); // Clean up user role after logout
      localStorage.removeItem('addedLocalUsers'); // Clean up locally added users after logout
    }
  }
});

export const { loginStart, loginSuccess, loginFail, logout } = authSlice.actions;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.token;
export default authSlice.reducer;