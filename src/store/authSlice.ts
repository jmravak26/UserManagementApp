import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

//Ensures that we are kept on the same page after page refresh
const savedAuth = localStorage.getItem('authToken');
const initialState: AuthState = {
  token: savedAuth ? JSON.parse(savedAuth) : null,
  loading: false,
  error: null,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ token: string }>) {
      state.loading = false;
      state.token = action.payload.token;
      localStorage.setItem('authToken', JSON.stringify(action.payload.token)); // Save token
    },
    loginFail(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem('authToken'); // Clean up token after logout
      localStorage.removeItem('addedLocalUsers'); // Clean up locally added users after logout
    }
  }
});

export const { loginStart, loginSuccess, loginFail, logout } = authSlice.actions;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.token;
export default authSlice.reducer;