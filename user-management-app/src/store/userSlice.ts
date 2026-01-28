import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers, createUser, updateUser, deleteUser } from '../api/usersApi';
import type { User } from '../types/User';
import { UserRole } from '../types/User';

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

// Fetch users thunk
export const fetchUsers = createAsyncThunk('users/fetch', async ({ page = 1, mode = 'real' }: { page?: number, mode?: 'mock' | 'real' }) => {
  const { data, hasMore } = await getUsers(page, mode);
  return { data, page, hasMore, mode };
});

// Create user thunk
export const createUserThunk = createAsyncThunk('users/create', async ({ userData, mode }: { userData: Omit<User, 'id'>, mode: 'mock' | 'real' }) => {
  if (mode === 'real') {
    const newUser = await createUser(userData, mode);
    return { user: newUser, mode };
  } else {
    // Mock mode - generate local ID and return user
    const localId = Date.now();
    const newUser = { ...userData, id: localId };
    return { user: newUser, mode };
  }
});

// Update user thunk
export const updateUserThunk = createAsyncThunk('users/update', async ({ id, userData, mode }: { id: number, userData: Partial<User>, mode: 'mock' | 'real' }) => {
  if (mode === 'real') {
    const updatedUser = await updateUser(id, userData, mode);
    return { user: updatedUser, mode };
  } else {
    // Mock mode - return updated user data
    const updatedUser = { ...userData, id } as User;
    return { user: updatedUser, mode };
  }
});

// Delete user thunk
export const deleteUserThunk = createAsyncThunk('users/delete', async ({ id, mode }: { id: number, mode: 'mock' | 'real' }) => {
  if (mode === 'real') {
    await deleteUser(id, mode);
    return { id, mode };
  } else {
    // Mock mode - just return the id
    return { id, mode };
  }
});

interface UsersState {
  apiItems: User[];
  localItems: User[];
  items: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  currentMode: 'mock' | 'real';
}

const initialState: UsersState = {
  apiItems: [],
  localItems: loadPersistedUsers(),
  items: loadPersistedUsers(),
  loading: false,
  error: null,
  hasMore: true,
  page: 0,
  currentMode: 'real'
};

const CLEAN_STATE: UsersState = {
  apiItems: [],
  localItems: [],
  items: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 0,
  currentMode: 'real'
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addLocalUser(state, action) {
      // Only for mock mode
      if (state.currentMode === 'mock') {
        const newUser = action.payload as User;
        state.localItems.unshift(newUser);
        state.items.unshift(newUser);
        savePersistedUsers(state.localItems);
      }
    },
    updateLocalUser(state, action) {
      // Only for mock mode
      if (state.currentMode === 'mock') {
        const updatedUser = action.payload as User;
        
        const localIndex = state.localItems.findIndex(u => u.id === updatedUser.id);
        if (localIndex !== -1) {
          state.localItems[localIndex] = updatedUser;
          savePersistedUsers(state.localItems);
        }
        
        const apiIndex = state.apiItems.findIndex(u => u.id === updatedUser.id);
        if (apiIndex !== -1) {
          state.apiItems[apiIndex] = updatedUser;
        }
        
        const itemsIndex = state.items.findIndex(u => u.id === updatedUser.id);
        if (itemsIndex !== -1) {
          state.items[itemsIndex] = updatedUser;
        }
      }
    },
    bulkDeleteUsers(state, action) {
      const userIdsToDelete = action.payload as number[];
      
      if (state.currentMode === 'mock') {
        state.localItems = state.localItems.filter(user => !userIdsToDelete.includes(user.id));
        state.apiItems = state.apiItems.filter(user => !userIdsToDelete.includes(user.id));
        state.items = state.items.filter(user => !userIdsToDelete.includes(user.id));
        savePersistedUsers(state.localItems);
      } else {
        // Real mode - remove from current items (will be refreshed from backend)
        state.items = state.items.filter(user => !userIdsToDelete.includes(user.id));
        state.apiItems = state.apiItems.filter(user => !userIdsToDelete.includes(user.id));
      }
    },
    bulkUpdateUserRoles(state, action) {
      const { userIds, role } = action.payload as { userIds: number[], role: UserRole };
      
      if (state.currentMode === 'mock') {
        state.localItems = state.localItems.map(user => 
          userIds.includes(user.id) ? { ...user, role } : user
        );
        state.apiItems = state.apiItems.map(user => 
          userIds.includes(user.id) ? { ...user, role } : user
        );
        state.items = state.items.map(user => 
          userIds.includes(user.id) ? { ...user, role } : user
        );
        savePersistedUsers(state.localItems);
      } else {
        // Real mode - update current items (will be synced with backend)
        state.items = state.items.map(user => 
          userIds.includes(user.id) ? { ...user, role } : user
        );
        state.apiItems = state.apiItems.map(user => 
          userIds.includes(user.id) ? { ...user, role } : user
        );
      }
    },
    bulkImportUsers(state, action) {
      const importedUsers = action.payload as User[];
      if (state.currentMode === 'mock') {
        state.localItems = [...importedUsers, ...state.localItems];
        state.items = [...importedUsers, ...state.items];
        savePersistedUsers(state.localItems);
      }
      // Real mode bulk import will need backend endpoint
    },
    setCurrentMode(state, action) {
      state.currentMode = action.payload;
    },
    resetUsers: () => CLEAN_STATE
  },
  extraReducers: (builder) => {
    // Fetch users
    builder.addCase(fetchUsers.pending, (s) => {
      s.loading = true;
      s.error = null;
    });

    builder.addCase(fetchUsers.fulfilled, (s, a) => {
      s.loading = false;
      const { data, page, hasMore, mode } = a.payload;
      s.currentMode = mode;

      if (page > 1) {
        s.apiItems = [...s.apiItems, ...data];
      } else {
        s.apiItems = data;
      }

      s.page = page;
      s.hasMore = hasMore;

      // Combine data based on mode
      if (mode === 'mock') {
        s.items = [...s.localItems, ...s.apiItems];
      } else {
        s.items = s.apiItems; // Real mode: only use backend data
      }
    });

    builder.addCase(fetchUsers.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? 'Failed to load';
    });

    // Create user
    builder.addCase(createUserThunk.fulfilled, (s, a) => {
      const { user, mode } = a.payload;
      if (mode === 'real') {
        s.apiItems.unshift(user);
        s.items.unshift(user);
      } else {
        s.localItems.unshift(user);
        s.items.unshift(user);
        savePersistedUsers(s.localItems);
      }
    });

    // Update user
    builder.addCase(updateUserThunk.fulfilled, (s, a) => {
      const { user, mode } = a.payload;
      
      if (mode === 'real') {
        const apiIndex = s.apiItems.findIndex(u => u.id === user.id);
        if (apiIndex !== -1) {
          s.apiItems[apiIndex] = user;
        }
        const itemsIndex = s.items.findIndex(u => u.id === user.id);
        if (itemsIndex !== -1) {
          s.items[itemsIndex] = user;
        }
      } else {
        // Mock mode logic (existing)
        const localIndex = s.localItems.findIndex(u => u.id === user.id);
        if (localIndex !== -1) {
          s.localItems[localIndex] = user;
          savePersistedUsers(s.localItems);
        }
        const apiIndex = s.apiItems.findIndex(u => u.id === user.id);
        if (apiIndex !== -1) {
          s.apiItems[apiIndex] = user;
        }
        const itemsIndex = s.items.findIndex(u => u.id === user.id);
        if (itemsIndex !== -1) {
          s.items[itemsIndex] = user;
        }
      }
    });

    // Delete user
    builder.addCase(deleteUserThunk.fulfilled, (s, a) => {
      const { id, mode } = a.payload;
      
      if (mode === 'real') {
        s.apiItems = s.apiItems.filter(u => u.id !== id);
        s.items = s.items.filter(u => u.id !== id);
      } else {
        s.localItems = s.localItems.filter(u => u.id !== id);
        s.apiItems = s.apiItems.filter(u => u.id !== id);
        s.items = s.items.filter(u => u.id !== id);
        savePersistedUsers(s.localItems);
      }
    });
  }
});

export const { addLocalUser, updateLocalUser, bulkDeleteUsers, bulkUpdateUserRoles, bulkImportUsers, setCurrentMode, resetUsers } = usersSlice.actions;
export default usersSlice.reducer;
