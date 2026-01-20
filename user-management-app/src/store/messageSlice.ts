import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { EmailMessage } from '../types/Message';

const LOCAL_STORAGE_KEY = 'messageHistory';

const loadMessageHistory = (): EmailMessage[] => {
  try {
    const serialized = localStorage.getItem(LOCAL_STORAGE_KEY);
    return serialized ? JSON.parse(serialized) : [];
  } catch {
    return [];
  }
};

const saveMessageHistory = (messages: EmailMessage[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Could not save message history', e);
  }
};

interface MessageState {
  history: EmailMessage[];
}

const initialState: MessageState = {
  history: loadMessageHistory()
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    sendMessage(state, action: PayloadAction<EmailMessage>) {
      state.history.unshift(action.payload);
      saveMessageHistory(state.history);
    },
    clearHistory(state) {
      state.history = [];
      saveMessageHistory([]);
    }
  }
});

export const { sendMessage, clearHistory } = messageSlice.actions;
export default messageSlice.reducer;
