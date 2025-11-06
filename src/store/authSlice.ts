import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) { state.loading = true; state.error = null; },
    loginSuccess(state, action: PayloadAction<{ token: string }>) {
      state.loading = false; state.token = action.payload.token;
    },
    loginFail(state, action: PayloadAction<string>) { state.loading = false; state.error = action.payload; },
    logout(state) { state.token = null; }
  }
});

export const { loginStart, loginSuccess, loginFail, logout } = authSlice.actions;
export default authSlice.reducer;