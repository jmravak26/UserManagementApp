import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SelectionState {
  selectedUserIds: number[];
}

const initialState: SelectionState = {
  selectedUserIds: [],
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    toggleUserSelection(state, action: PayloadAction<number>) {
      const userId = action.payload;
      const index = state.selectedUserIds.indexOf(userId);
      
      if (index === -1) {
        state.selectedUserIds.push(userId);
      } else {
        state.selectedUserIds.splice(index, 1);
      }
    },
    
    selectAllUsers(state, action: PayloadAction<number[]>) {
      state.selectedUserIds = action.payload;
    },
    
    deselectAllUsers(state) {
      state.selectedUserIds = [];
    },
    
    removeDeletedUsers(state, action: PayloadAction<number[]>) {
      const deletedIds = action.payload;
      state.selectedUserIds = state.selectedUserIds.filter(
        id => !deletedIds.includes(id)
      );
    }
  }
});

export const { 
  toggleUserSelection, 
  selectAllUsers, 
  deselectAllUsers, 
  removeDeletedUsers 
} = selectionSlice.actions;

export default selectionSlice.reducer;