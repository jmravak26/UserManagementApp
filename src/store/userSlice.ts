import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers } from '../api/usersApi';
import type { User } from '../types/User';

const LOCAL_STORAGE_KEY = 'addedLocalUsers';

const loadPersistedUsers = (): User[] => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) return [];
    return JSON.parse(serializedState) as User[];
  } catch (e) {
    console.error("Could not load persisted state", e);
    return [];
  }
};

const savePersistedUsers = (users: User[]) => {
  try {
    const serializedState = JSON.stringify(users);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (e) {
    console.error("Could not save state", e);
  }
};

// Updated thunk to support pagination
export const fetchUsers = createAsyncThunk('users/fetch', async (page: number = 1) => {
  const { data, hasMore } = await getUsers(page);
  return { data, page, hasMore };
});

interface UsersState {
  apiItems: User[];
  localItems: User[];
  items: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: UsersState = {
  apiItems: [],
  localItems: loadPersistedUsers(),
  items: loadPersistedUsers(),
  loading: false,
  error: null,
  hasMore: true,
  page: 0
};

const CLEAN_STATE: UsersState = {
  apiItems: [],
  localItems: [],
  items: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 0
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addLocalUser(state, action) {
      const newUser = action.payload as User;
      state.localItems.unshift(newUser);
      state.items.unshift(newUser);
      savePersistedUsers(state.localItems);
    },
    updateUser(state, action) {
      const updatedUser = action.payload as User;
      
      // Update in localItems if it exists there
      const localIndex = state.localItems.findIndex(u => u.id === updatedUser.id);
      if (localIndex !== -1) {
        state.localItems[localIndex] = updatedUser;
        savePersistedUsers(state.localItems);
      }
      
      // Update in apiItems if it exists there
      const apiIndex = state.apiItems.findIndex(u => u.id === updatedUser.id);
      if (apiIndex !== -1) {
        state.apiItems[apiIndex] = updatedUser;
      }
      
      // Update in combined items array
      const itemsIndex = state.items.findIndex(u => u.id === updatedUser.id);
      if (itemsIndex !== -1) {
        state.items[itemsIndex] = updatedUser;
      }
    },
    resetUsers: () => CLEAN_STATE
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (s) => {
      s.loading = true;
      s.error = null;
    });

    builder.addCase(fetchUsers.fulfilled, (s, a) => {
      s.loading = false;
      const { data, page, hasMore } = a.payload;

      // Append new page results instead of replacing
      if (page > 1) {
        s.apiItems = [...s.apiItems, ...data];
      } else {
        s.apiItems = data;
      }

      s.page = page;
      s.hasMore = hasMore;

      // Combine local and API users
      s.items = [...s.localItems, ...s.apiItems];
    });

    builder.addCase(fetchUsers.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? 'Failed to load';
    });
  }
});

export const { addLocalUser, updateUser, resetUsers } = usersSlice.actions;
export default usersSlice.reducer;
