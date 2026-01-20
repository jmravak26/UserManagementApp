import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import usersReducer from './userSlice';
import selectionReducer from './selectionSlice';
import messageReducer from './messageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    selection: selectionReducer,
    messages: messageReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;