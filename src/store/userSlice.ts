import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers } from '../api/usersApi';
import type { User } from '../types/User';

const LOCAL_STORAGE_KEY = 'addedLocalUsers';

const loadPersistedUsers = (): User[] => {
    try {
        const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (serializedState === null) {
            return [];
        }
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

export const fetchUsers = createAsyncThunk('users/fetch', async () => {
    const data = await getUsers();
    return data.data as User[];
});

interface UsersState {
    apiItems: User[];
    localItems: User[];
    items: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    apiItems: [],
    localItems: loadPersistedUsers(),
    items: loadPersistedUsers(),
    loading: false,
    error: null
};

const CLEAN_STATE: UsersState = {
    apiItems: [],
    localItems: [],
    items: [],
    loading: false,
    error: null
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        // --- Only persist the newly added user, and update both lists ---
        addLocalUser(state, action) {
            const newUser = action.payload as User;            
            // 1. Add to the localItems list
            state.localItems.unshift(newUser);            
            // 2. Update the combined items list
            state.items.unshift(newUser);            
            // 3. Persist ONLY the localItems list
            savePersistedUsers(state.localItems);
        },        
        // NEW REDUCER: Resets the in-memory state back to empty arrays
        resetUsers: () => CLEAN_STATE 
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.pending, (s) => { 
            s.loading = true; 
            s.error = null; 
        });
        
        builder.addCase(fetchUsers.fulfilled, (s, a) => { 
            s.loading = false;
            // 1. Save the API users separately
            s.apiItems = a.payload;
            // 2. Create the combined list: local users first, then API users
            s.items = [...s.localItems, ...s.apiItems];
        });
        
        builder.addCase(fetchUsers.rejected, (s, a) => { 
            s.loading = false; 
            s.error = a.error.message ?? 'Failed to load'; 
        });
    }
});

// Export the new reset action
export const { addLocalUser, resetUsers } = usersSlice.actions; 
export default usersSlice.reducer;