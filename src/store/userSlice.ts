import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers } from '../api/usersApi';
import type { User } from '../types/User';

export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const data = await getUsers();
  return data.data as User[];
});

interface UsersState {
  items: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addLocalUser(state, action) {
      state.items.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (s) => { s.loading = true; s.error = null; });
    builder.addCase(fetchUsers.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    builder.addCase(fetchUsers.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Failed to load'; });
  }
});

export const { addLocalUser } = usersSlice.actions;
export default usersSlice.reducer;
